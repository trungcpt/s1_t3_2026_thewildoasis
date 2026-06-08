import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, fullName: 'trungcpt' },
    { id: 2, fullName: 'trungcpt2' },
    { id: 3, fullName: 'trungcpt3' },
  ];

  getUsers(query) {
    return this.users;
  }

  getUser(id: number) {
    const userFound = this.users.find((user) => user.id === id);
    if (!userFound) throw new Error('User not found!');
    return userFound;
  }

  createUser(userCreate: User) {
    // validate data
    this.users.push(userCreate);
    return userCreate;
  }

  updateUser(id: string, updateUser: User) {
    // User exist
    const userFound = this.users.find((user) => user.id === parseInt(id));

    if (!userFound) throw new Error('User not exits');

    // Validate data

    // Update data
    const usersUpdated = this.users.map((user) => {
      if (user.id === userFound.id) {
        return { ...user, ...updateUser };
      }
      return user;
    });
    this.users = usersUpdated;
    return updateUser;
  }

  deleteUser(id: string) {
    // User exist
    const userDelete = this.users.find((user) => user.id === parseInt(id));

    if (!userDelete) throw new Error('User not exists');

    const usersDeleted = this.users.filter((user) => user.id !== userDelete.id);
    this.users = usersDeleted;
    return userDelete;
  }
}
