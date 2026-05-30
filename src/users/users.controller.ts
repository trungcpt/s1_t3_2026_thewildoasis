import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

type User = {
  id: number;
  fullName: string;
};

@Controller('users')
export class UsersController {
  private users: User[] = [
    { id: 1, fullName: 'trungcpt' },
    { id: 2, fullName: 'trungcpt2' },
    { id: 3, fullName: 'trungcpt3' },
  ];

  @Get()
  getUsers(@Query('name') query) {
    console.log('>>> query', query);
    return this.users;
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    const userFound = this.users.find((user) => user.id === parseInt(id));
    return userFound;
  }

  @Post()
  createUser() {}

  @Patch()
  updateUser() {}

  @Delete()
  deleteUser() {}
}
