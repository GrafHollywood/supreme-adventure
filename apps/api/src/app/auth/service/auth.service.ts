import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersService } from '../../users/users.service';
import {
  RegisterUserDto,
  TUserLoginResult,
  TUserResult,
} from '../dto/register-user.dto';
import { JwtPayload } from '../strategies/jwt.strategy';
export interface Tokens {
  access_token: string;
  refresh_token: string;
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<TUserResult | null> {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const { passwordHash, ...userResult } = user;
      const isMatch = await bcrypt.compare(password, passwordHash);
      return isMatch ? userResult : null;
    }
    return null;
  }

  async login(user: TUserResult): Promise<TUserLoginResult> {
    const { id, username, name } = await this.userService.findOneByUsername(
      user.username
    );
    const payload: JwtPayload = { username: user.username, sub: user.id };
    const tokens = this.getTokens(payload);
    return {
      id,
      username,
      name,
      ...tokens,
    };
  }

  async registerUser(newUser: RegisterUserDto): Promise<TUserLoginResult> {
    const { username, name, password } = newUser;
    const createUserDto: CreateUserDto = {
      username: username,
      name: name,
      passwordHash: await bcrypt.hash(password, 10),
    };
    try {
      const { id, username, name } = await this.userService.create(
        createUserDto
      );
      const payload: JwtPayload = { username, sub: id };
      const tokens = this.getTokens(payload);
      return {
        id,
        username,
        name,
        ...tokens,
      };
    } catch (e) {
      throw new BadRequestException('User already exists');
    }
  }

  getTokens(payload: JwtPayload): Tokens {
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '60s' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '15d' }),
    };
  }
}
