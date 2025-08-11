// actions.ts

// Define types
interface User {
  uid: string;
  email: string;
  username: string;
  role: string;
  fullname: string;
  createdAt: string;
  phoneNumber: string;
  lastLogin: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Action type constants
const SET_USER = "SET_USER";
const UPDATE_USER = "UPDATE_USER";
const CLEAR_USER = "CLEAR_USER";
const SET_TOKENS = "SET_TOKENS";

// Action creators
export const setUser = (user: User) => ({
  type: SET_USER as typeof SET_USER,
  payload: user
});

export const updateUser = (updatedFields: Partial<User>) => ({
  type: UPDATE_USER as typeof UPDATE_USER,
  payload: updatedFields
});

export const clearUser = () => ({
  type: CLEAR_USER as typeof CLEAR_USER
});

export const setTokens = (tokens: Tokens) => ({
  type: SET_TOKENS as typeof SET_TOKENS,
  payload: tokens
});

// Action types
type SetUserAction = ReturnType<typeof setUser>;
type UpdateUserAction = ReturnType<typeof updateUser>;
type ClearUserAction = ReturnType<typeof clearUser>;
type SetTokensAction = ReturnType<typeof setTokens>;

// Union type
export type AuthAction =
  | SetUserAction
  | UpdateUserAction
  | ClearUserAction
  | SetTokensAction;