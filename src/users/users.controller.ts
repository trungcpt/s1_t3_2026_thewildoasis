import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Query('name') query) {
    return this.usersService.getUsers(query);
  }

  @Get(':id') // => /users/:id
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() userCreate: User) {
    return this.usersService.createUser(userCreate);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUser: User) {
    return this.usersService.updateUser(id, updateUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
