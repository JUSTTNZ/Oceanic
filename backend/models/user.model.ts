import mongoose, { Document, Model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

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

export interface UserDocument extends IUser, Document {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
    },
  },
  { timestamps: true }
);

// ✅ Access token generator
userSchema.methods.generateAccessToken = function () {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1d';

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { _id: this._id, role: this.role },
    accessTokenSecret,
    { expiresIn: accessTokenExpiry }
  );
};

// ✅ Refresh token generator
userSchema.methods.generateRefreshToken = function () {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '10d';

  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { _id: this._id },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiry }
  );
};

export const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
