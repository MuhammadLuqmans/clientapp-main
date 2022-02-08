import { ILoginData } from "../interfaces/interfaces";
import { LoginRequestModel } from "../swagger-clients/ibwatchdog-api-clients.service";
import { getAuthorizationClient } from "./ibwatchdog-api.service";

class ApplicationUser {
  userId?: string | undefined;
  displayName?: string | undefined;
  token?: string | undefined;
  isAdmin?: boolean | undefined;

  constructor(name: string, token: string) {
    this.displayName = name;
    this.token = token;
  }
}


export class AuthService {
  static currentUser?: ApplicationUser;

  static readUserFromSessionStorage() {
    const userJson = sessionStorage.getItem("laduc-user");
    return userJson ? JSON.parse(userJson) as ApplicationUser : undefined;
  }

  static isLoggedIn() {
    AuthService.currentUser = this.readUserFromSessionStorage();
    return AuthService.currentUser !== undefined;
  }

  static async login(data: ILoginData) {
    AuthService.currentUser = AuthService.readUserFromSessionStorage();
    if (!AuthService.currentUser) {
      const client = getAuthorizationClient();
      const resp = await client.login({ email: data.email, password: data.password } as LoginRequestModel);
      AuthService.currentUser = resp as ApplicationUser;
      sessionStorage.setItem("laduc-user", JSON.stringify(AuthService.currentUser));
    }
  }

  static logout() {
    console.log("logout called.");
    sessionStorage.removeItem("laduc-user");
    AuthService.currentUser = undefined;
  }
}

export default AuthService;
