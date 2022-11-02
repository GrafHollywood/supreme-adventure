import { ITokens } from './auth.interface';

export interface IUserResult {
  id: string;
  username: string;
  name: string;
}
export type IUserLoginResult = IUserResult & ITokens;
