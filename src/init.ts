import { cleanupOpenApiDoc } from 'nestjs-zod';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { applyMiddlewares } from './common/middlewares/common.middleware';
import { isDevelopment } from './common/utils/env/env.util';

const removeFieldsAndRelations = (document: any) => {
  const auditFields = new Set([
    'id',
    'userID',
    'createdAt',
    'updatedAt',
    'createdBy',
    'deletedAt',
    'data',
    'user',
  ]);

  const schemas = document?.components?.schemas;
  if (!schemas) return document;

  for (const schema of Object.values<any>(schemas)) {
    if (!schema.properties) continue;

    const newProps: Record<string, any> = {};

    for (const [propName, prop] of Object.entries<any>(schema.properties)) {
      if (auditFields.has(propName)) continue;

      if (prop?.type === 'object' && !propName.endsWith('s')) {
        newProps[`${propName}ID`] = { type: 'string' };
      } else if (prop?.type !== 'object') {
        newProps[propName] = prop;
      }
    }

    schema.properties = newProps;

    if (Array.isArray(schema.required)) {
      schema.required = schema.required.filter(
        (field) => !auditFields.has(field),
      );
    }
  }

  return document;
};

const initOpenAPI = (app: INestApplication) => {
  const { APP_NAME } = process.env;
  const config = new DocumentBuilder()
    .setTitle(`${APP_NAME} API`)
    .setDescription(`${APP_NAME} API description`)
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => {
    let openApiDoc = SwaggerModule.createDocument(app, config);
    openApiDoc = removeFieldsAndRelations(openApiDoc);
    openApiDoc = cleanupOpenApiDoc(openApiDoc);
    const options: SwaggerCustomOptions = {
      useGlobalPrefix: true,
    };
    return { ...openApiDoc, ...options };
  };
  SwaggerModule.setup('', app, documentFactory);
};

const initApp = (app: INestApplication) => {
  const { APP_PREFIX = '/api', FE_URL } = process.env;
  app.setGlobalPrefix(APP_PREFIX);
  app.enableCors({
    origin: JSON.parse(FE_URL!),
  });
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'x-api-version',
  //   defaultVersion: '1',
  // });
  applyMiddlewares(app);
  if (isDevelopment()) {
    initOpenAPI(app);
  }
  app.enableShutdownHooks();
  return app;
};
export { initApp };
