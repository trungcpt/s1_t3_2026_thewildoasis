// import { ImportExcel } from '../../../common/utils/excel-util/excel-util.const';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
// import { UserUncheckedCreateInputObjectSchema } from '@generated/zod/schemas';

const UserSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  age: z.number(),
});

export class CreateUserDto extends createZodDto(UserSchema) {}

// export class CreateUserRolesDto {
//   userID: string;
//   roleIDs: string[];
// }

// export class ImportUsersDto extends ImportExcel {}
