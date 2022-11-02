import { ApiProperty } from '@nestjs/swagger';
import { IRegisterUserDto } from '@supreme-adventure/dto';

export class RegisterUserDto implements IRegisterUserDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  password: string;
}
