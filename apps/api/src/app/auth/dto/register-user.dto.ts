import { User } from '../../users/entity/user.entity';
import { Tokens } from '../service/auth.service';

export class RegisterUserDto {
  username: string;
  name: string;
  password: string;
}

export type TUserResult = Omit<User, 'passwordHash'>;
export type TUserLoginResult = TUserResult & Tokens;
