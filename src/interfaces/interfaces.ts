export interface ILoginData {
  email: string;
  password: string;
}

export interface ICreateUserRequest {
  displayName: string;
  email: string;
  password: string;
  roles?: string[] | undefined;
}

export interface IWatchlistItem {
  symbol: string;
  description: string;
  secType: string;
  bid?: number;
  ask?: number;
  volume?: number;
  underlyingPrice?: number;
  strike?: number;
  expirationDate?: string;
}

export enum OrderAction {
  BUY = "BUY",
  SELL = "SELL"
}
