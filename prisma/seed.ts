import { PrismaClient } from '@pris-gen/client';
import { camelCase, isEmpty } from 'es-toolkit/compat';
import * as faker from '@generated/faker/data';
import { parseArgs, ParseArgsOptionsConfig } from 'node:util';
import { SYSTEM_USER_GMAIL } from '../src/app/users/consts/user.const';
import { PrismaPg } from '@prisma/adapter-pg';

const options: ParseArgsOptionsConfig = {
  environment: { type: 'string' },
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const getModelDependencies = () => {
  const runtimeDataModel = (prisma as any)._runtimeDataModel;
  const models = runtimeDataModel.models;
  const dependencies = {};

  Object.keys(models).forEach((modelName) => {
    const modelData = models[modelName];
    dependencies[modelName] = {};

    const fields = modelData.fields;

    if (fields) {
      fields.forEach((field) => {
        const { name: fieldName } = field;

        if (field.relationName && !field.type.includes(modelName)) {
          const referencedModel = field.type;
          const isRefMultiple =
            fieldName === `${referencedModel.toLowerCase()}s`;
          if (isRefMultiple) return;

          dependencies[modelName][fieldName] = referencedModel;
        }
      });
    }
  });

  return dependencies;
};

const sortModelsByDependency = () => {
  const dependencies = getModelDependencies();
  const models = Object.keys(dependencies);
  const sorted: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(modelName: string) {
    if (visited.has(modelName) || visiting.has(modelName)) return;

    visiting.add(modelName);

    const referencedModels = new Set(
      Object.values<string>(dependencies[modelName]),
    );

    for (const refModel of referencedModels) {
      if (models.includes(refModel)) {
        visit(refModel);
      }
    }

    visiting.delete(modelName);
    visited.add(modelName);
    sorted.push(modelName);
  }

  for (const model of models) {
    visit(model);
  }

  const data = {};
  for (const modelSorted of sorted) {
    data[modelSorted] = dependencies[modelSorted];
  }

  return data;
};

const createUserAdmin = async () => {
  const email = 'admin@gmail.com';
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!isEmpty(user)) return;

  await prisma.user.create({
    data: {
      email,
      fullName: 'User Admin',
      password: '$2b$10$elWZb7IiVaXGCDV8rnW4FOjpneHgiHd.s4VKt9yPw3bBBGL7TlmGK',
      userRoles: {
        create: {
          role: {
            create: {
              name: 'Admin role',
              isSystem: true,
            },
          },
        },
      },
    },
  });
};

const createSystemUser = async () => {
  const systemUser = await prisma.user.findUnique({
    where: { email: SYSTEM_USER_GMAIL },
  });
  if (!isEmpty(systemUser)) return;

  await prisma.user.create({
    data: {
      email: SYSTEM_USER_GMAIL,
      fullName: 'System User',
      password: crypto.randomUUID(),
    },
  });
};

const createDevData = async () => {
  const models = sortModelsByDependency();
  const fieldsRelationSkip = new Set(['parent']);
  for (const model of Object.keys(models)) {
    let quantityGenerate = 5;
    while (quantityGenerate > 0) {
      quantityGenerate--;
      const prismaModel = prisma[camelCase(model)];
      const skip = await prismaModel.count();

      const modelReferences = models[model];
      const idsReference = {};
      if (!isEmpty(modelReferences)) {
        for (const field of Object.keys(modelReferences)) {
          if (fieldsRelationSkip.has(field)) continue;

          const modelReference = modelReferences[field];
          const modelReferenceCamel = camelCase(modelReference);
          const prismaModel = prisma[modelReferenceCamel];
          if (!('id' in prismaModel.fields)) continue;

          const rootDataModelFirst = await prismaModel.findFirst({
            select: { id: true },
            take: 1,
            skip,
          });
          if (!rootDataModelFirst) continue;

          idsReference[`${modelReferenceCamel}ID`] = rootDataModelFirst.id;
        }
      }

      const dataCreate = faker[`fake${model}`]?.() ?? {};
      await prismaModel.create({
        data: { ...dataCreate, ...idsReference },
      });
    }
  }
  // await createSystemUser();
  // await createUserAdmin();
};

const main = async () => {
  const {
    values: { environment },
  } = parseArgs({ options });

  switch (environment) {
    case 'dev':
      return await createDevData();
    case 'prod':
    // return await createProdData();
    default:
      break;
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
