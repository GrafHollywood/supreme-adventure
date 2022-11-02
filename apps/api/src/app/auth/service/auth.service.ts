import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens, UserLoginResult, UserResult } from '@supreme-adventure/data';
import { RegisterUserDto } from '@supreme-adventure/dto';
import * as argon2 from 'argon2';

import { environment } from '../../../environments/environment';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersService } from '../../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserResult | null> {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const { passwordHash, ...userResult } = user;
      const isMatch = await argon2.verify(passwordHash, password);
      return isMatch ? userResult : null;
    }
    return null;
  }

  async login(user: UserResult): Promise<UserLoginResult> {
    const { id, username, name } = user;
    const tokens = this.getTokens(username, id);
    await this.updateUserRefreshToken(id, tokens.refresh_token);
    return { id, username, name, ...tokens };
  }

  async logout(userId: string): Promise<UserResult> {
    const { id, username, name } = await this.userService.update(userId, {
      refreshTokenHash: null,
    });
    return { id, username, name };
  }

  async registerUser(newUser: RegisterUserDto): Promise<UserLoginResult> {
    const { username, name, password } = newUser;
    const createUserDto: CreateUserDto = {
      username: username,
      name: name,
      passwordHash: await argon2.hash(password),
    };
    try {
      const createdUser = await this.userService.create(createUserDto);
      const { id, username, name } = createdUser;
      const tokens = this.getTokens(username, id);
      await this.updateUserRefreshToken(id, tokens.refresh_token);
      return { id, username, name, ...tokens };
    } catch (e) {
      throw new BadRequestException('User already exists');
    }
  }

  getTokens(username: string, id: string): Tokens {
    const payload = { username, sub: id };
    const tokens = {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '5m',
        secret: environment.jwtSecret,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: environment.jwtRefreshSecret,
      }),
    };
    return {
      ...tokens,
      express_in: this.jwtService.decode(tokens.access_token)['exp'],
    };
  }

  async updateUserRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.userService.update(userId, { refreshTokenHash });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshTokenHash,
      refreshToken
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = this.getTokens(user.username, user.id);
    await this.updateUserRefreshToken(userId, tokens.refresh_token);
    return tokens;
  }
}
