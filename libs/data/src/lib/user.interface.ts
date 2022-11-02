import { Tokens } from './auth.interface';

export interface UserResult {
  id: string;
  username: string;
  name: string;
}
export type UserLoginResult = UserResult & Tokens;
