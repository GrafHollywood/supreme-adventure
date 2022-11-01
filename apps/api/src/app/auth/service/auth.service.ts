import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
    const { id, username, name } = user;
    const payload: JwtPayload = { username, sub: id };
    const { access_token, refresh_token } = this.getTokens(payload);
    await this.updateUserRefreshToken(id, refresh_token);
    return { id, username, name, access_token, refresh_token };
  }

  async logout(userId: string): Promise<TUserResult> {
    const { id, username, name } = await this.userService.update(userId, {
      refreshTokenHash: null,
    });
    return { id, username, name };
  }

  async registerUser(newUser: RegisterUserDto): Promise<TUserLoginResult> {
    const { username, name, password } = newUser;
    const createUserDto: CreateUserDto = {
      username: username,
      name: name,
      passwordHash: await bcrypt.hash(password, 10),
    };
    try {
      const createdUser = await this.userService.create(createUserDto);
      const { id, username, name } = createdUser;
      const payload: JwtPayload = { username, sub: id };
      const { access_token, refresh_token } = this.getTokens(payload);
      await this.updateUserRefreshToken(id, refresh_token);
      return { id, username, name, access_token, refresh_token };
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

  async updateUserRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(userId, { refreshTokenHash });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const payload: JwtPayload = { username: user.username, sub: user.id };
    const tokens = this.getTokens(payload);
    await this.updateUserRefreshToken(userId, tokens.refresh_token);
    return tokens;
  }
}
