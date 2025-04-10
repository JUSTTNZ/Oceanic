// types/user.types.ts
export interface IUserRegister {
    username: string;
    email: string;
    password: string;
    fullname: string;
    phoneNumber: string;
    bankDetails?: {
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    };
  }