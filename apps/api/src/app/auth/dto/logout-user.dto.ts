import { ApiProperty } from '@nestjs/swagger';
import { IUserResult } from '@supreme-adventure/data';

export class UserResult implements IUserResult {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  name: string;
}
