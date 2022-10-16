import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<Omit<UserDto, 'passwordHash'> | null> {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const { passwordHash, ...result } = user;
      const isMatch = await bcrypt.compare(password, passwordHash);
      return isMatch ? result : null;
    }
    return null;
  }
}
