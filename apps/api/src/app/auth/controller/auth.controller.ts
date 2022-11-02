import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from '../../users/users.service';
import { LoginUserDto, UserLoginResult } from '../dto/login-user.dto';
import { UserResult } from '../dto/logout-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { Tokens } from '../dto/token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-token-auth.guard';
import { AuthService } from '../service/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({
    description: 'Successful login',
    type: UserLoginResult,
  })
  @ApiUnauthorizedResponse({ description: 'Wrong username or password' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<UserLoginResult> {
    return this.authService.login(req.user);
  }

  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({
    description: 'Successful registration',
    type: UserLoginResult,
  })
  @ApiBadRequestResponse({ description: 'User already exists' })
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<UserLoginResult> {
    return this.authService.registerUser(registerUserDto);
  }

  @ApiCreatedResponse({
    description: 'Successful logout',
    type: UserResult,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req): Promise<UserResult> {
    return this.authService.logout(req.user.sub);
  }

  @ApiOkResponse({
    description: 'Get user profile',
    type: UserResult,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserResult> {
    const { id, username, name } = await this.userService.findOneByUsername(
      req.user.username
    );
    return { id, username, name };
  }

  @ApiCreatedResponse({
    description: 'Successful refresh tokens',
    type: Tokens,
  })
  @ApiForbiddenResponse({ description: 'Access Denied. Invalid token' })
  @ApiBearerAuth()
  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  refreshTokens(@Request() req): Promise<Tokens> {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
