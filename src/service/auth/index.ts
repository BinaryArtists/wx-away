export interface Auth {
  token: string;
}

export class AuthService {
  auth: Auth;

  constructor () {
    
  }
}


export const auth = new AuthService();

