import mongoose, { Schema, Document, Types } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ms from 'ms';

// --- Extend process.env types ---
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRY: string;
      REFRESH_TOKEN_EXPIRY: string;
    }
  }
}

// --- User interfaces ---
interface IUser {
  username: string;
  email: string;
  fullname: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  phoneNumber: string;
  isVerified: boolean;
  isGoogleAuth?: boolean;
  refreshToken?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  comparePassword(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}


export type UserDocument = IUser & Document &  IUserMethods & {
    _id: Types.ObjectId; // 👈 make _id explicit
  };

interface UserModel extends mongoose.Model<UserDocument> {}

// --- Schema ---
const UserSchema = new Schema<UserDocument, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: 'Please provide a valid email address'
      }
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user'
    },
    phoneNumber: {
      type: String,
      required: function () {
        return !this.isGoogleAuth;
      },
      unique: [true, 'Phone number already exists'],
      trim: true,
      match: [
        /^(070|080|090|081|091)\d{8}$/,
        'Phone number must be 11 digits and start with valid prefixes: 070, 080, 090, 081, 091.'
      ]
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isGoogleAuth: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

// --- Hooks ---
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// --- Methods ---
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    username: this.username,
    email: this.email,
    role: this.role
  };

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not configured');
  }

  if (!isValidExpiry(process.env.ACCESS_TOKEN_EXPIRY)) {
    throw new Error('Invalid ACCESS_TOKEN_EXPIRY format.');
  }

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  } as jwt.SignOptions);
};

UserSchema.methods.generateRefreshToken = function () {
  const payload = { _id: this._id };

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured');
  }

  if (!isValidExpiry(process.env.REFRESH_TOKEN_EXPIRY)) {
    throw new Error('Invalid REFRESH_TOKEN_EXPIRY format.');
  }

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  } as jwt.SignOptions);
};

// --- Helper ---
function isValidExpiry(expiry: any): boolean {
  if (Number(expiry) < 0) return false;
  const regexIsNumber = /^\d+$/;
  const regexAlphaNum = /^(\d{1,})+\s?[a-z]+$/;
  const isNumber = regexIsNumber.test(expiry);
  const isAlphaNum = regexAlphaNum.test(expiry);
  if (isNumber) return true;
  if (isAlphaNum) {
    try {
      return ms(expiry) !== undefined;
    } catch {
      return false;
    }
  }
  return false;
}

export const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);
