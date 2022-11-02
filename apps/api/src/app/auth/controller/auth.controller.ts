import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Tokens, UserLoginResult, UserResult } from '@supreme-adventure/data';
import { RegisterUserDto } from '@supreme-adventure/dto';

import { UsersService } from '../../users/users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-token-auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<UserLoginResult> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<UserLoginResult> {
    return this.authService.registerUser(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req): Promise<UserResult> {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserResult> {
    const { id, username, name } = await this.userService.findOneByUsername(
      req.user.username
    );
    return { id, username, name };
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  refreshTokens(@Request() req): Promise<Tokens> {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
