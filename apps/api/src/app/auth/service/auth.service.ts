import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersService } from '../../users/users.service';
import { RegisterUserDto, TUserResult } from '../dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<TUserResult | null> {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const { passwordHash, ...result } = user;
      const isMatch = await bcrypt.compare(password, passwordHash);
      return isMatch ? result : null;
    }
    return null;
  }

  async registerUser(newUser: RegisterUserDto): Promise<TUserResult> {
    const { username, name, password } = newUser;
    const createUserDto: CreateUserDto = {
      username: username,
      name: name,
      passwordHash: await bcrypt.hash(password, 10),
    };
    try {
      const user = await this.userService.create(createUserDto);
      // eslint-disable-next-line
      const { passwordHash, ...result } = user;
      return result;
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
