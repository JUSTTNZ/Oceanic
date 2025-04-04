// models/User.js
import mongoose, { Document, Model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { IUser } from '../types/user.types';
// export interface IUser {
//   username: string;
//   email: string;
//   fullname: string;
//   password: string;
//   role: 'user' | 'admin' | 'superadmin';
//   isVerified: boolean;
//   refreshToken?: string;
//   bankDetails?: {
//     accountName: string;
//     accountNumber: string;
//     bankName: string;
//   };
// }

export interface UserDocument extends IUser, Document {
  matchPassword(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}


const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please enter a valid email address',
      },
    },
    fullname: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: {
        type: String,
        default: function () {
          return this.username;
        },
      },
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};




// ✅ Access token generator
// ✅ Access token generator
userSchema.methods.generateAccessToken = function () {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1d';

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { _id: this._id, role: this.role },
    accessTokenSecret,
    { expiresIn: accessTokenExpiry as string | number }
  );
};

// ✅ Refresh token generator
userSchema.methods.generateRefreshToken = function () {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { _id: this._id },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiry as string | number }
  );
};


export const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
