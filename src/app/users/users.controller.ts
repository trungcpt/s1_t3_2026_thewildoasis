import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { User } from './entities/users.entity';
import { ValidatorPipe } from '../../validator/validator.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  getUsers(@Query('name') query) {
    return this.usersService.getUsers(query);
  }

  @Get(':id') // => /users/:id
  @UsePipes(ValidatorPipe)
  getUser(@Param('id', ParseIntPipe) id: number) {
    console.log('>>> id', id);
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() userCreate: CreateUserDto) {
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
