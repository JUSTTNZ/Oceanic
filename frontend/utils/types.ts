// types.ts
export interface User {
  uid: string;
  email: string;
  username: string;
  role: string;
  fullname: string;
  createdAt: string;
  phoneNumber: string;
  lastLogin: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
}

export interface SetUserAction {
  type: "SET_USER";
  payload: {
    user: User;
    tokens: Tokens;
  };
}

export interface SetTokensAction {
  type: "SET_TOKENS";
  payload: Tokens;
}

export interface UpdateUserAction {
  type: "UPDATE_USER";
  payload: Partial<User>;
}

export interface ClearUserAction {
  type: "CLEAR_USER";
}

export type AuthAction = 
  | SetUserAction
  | SetTokensAction
  | UpdateUserAction
  | ClearUserAction;