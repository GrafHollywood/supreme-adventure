import { UserDto } from '../../users/dto/user.dto';

export class RegisterUserDto {
  username: string;
  name: string;
  password: string;
}

export type TUserResult = Omit<UserDto, 'passwordHash'>;
