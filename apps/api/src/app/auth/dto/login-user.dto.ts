import { ApiProperty } from '@nestjs/swagger';
import { IUserLoginResult } from '@supreme-adventure/data';
import { ILoginUserDto } from '@supreme-adventure/dto';

export class LoginUserDto implements ILoginUserDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class UserLoginResult implements IUserLoginResult {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
  @ApiProperty()
  express_in: number;
}
