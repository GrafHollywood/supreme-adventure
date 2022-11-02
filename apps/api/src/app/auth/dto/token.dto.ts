import { ApiProperty } from '@nestjs/swagger';
import { ITokens } from '@supreme-adventure/data';
export class Tokens implements ITokens {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
  @ApiProperty()
  express_in: number;
}
