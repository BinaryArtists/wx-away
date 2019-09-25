export interface UserInfo {
  nickName: string;
  avatarUrl: string;
  country: string,
  province: string,
  city: string,
  gender: number
}

export interface UserAuth {
  code: string; // user authCode
}

export class UserService {
  info: UserInfo;
  id: string;
  token: string;
  auth: UserAuth;

  constructor () {

  }


}

export const user = new UserService();