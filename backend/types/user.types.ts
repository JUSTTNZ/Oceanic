export interface IUser {
    username: string;
    email: string;
    fullname: string;
    password: string;
    role: 'user' | 'admin' | 'superadmin';
    isVerified: boolean;
    refreshToken?: string;
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    };
  }
  