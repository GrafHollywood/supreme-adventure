import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { TUserResult } from '../dto/register-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.jwtSecret,
    });
  }

  async validate(payload: {
    username: string;
    sub: string;
  }): Promise<TUserResult> {
    // eslint-disable-next-line
    const { passwordHash, ...result } = await this.usersService.findOne(
      payload.sub
    );
    return result;
  }
}
