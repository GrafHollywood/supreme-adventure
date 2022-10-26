import { User } from '../../users/entity/user.entity';

export class RegisterUserDto {
  username: string;
  name: string;
  password: string;
}

export type TUserResult = Omit<User, 'passwordHash'>;
