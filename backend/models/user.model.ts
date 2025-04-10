import mongoose, { Schema } from 'mongoose';
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ms from 'ms';
//import { getJwtConfig } from '../utils/envConfig.js';


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


const UserSchema = new Schema (
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
        required: [true, "password is required"]
    },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: [true, "Phonenumber already exists"],
        trim: true,
        match: [
            /^(070|080|090|081|091)\d{8}$/,
            'Phone number must be 11 digits and start with one of the valid prefixes: 070, 080, 090, 081, 091.',
        ],
    },
    bankDetails: {
        bankName: String,
        accountNumber: String,
        accountName: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
    }, {  timestamps: true}
)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)

    next();
})


UserSchema.methods.comparePassword = async function (enteredPassword: string) {

    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.generateAccessToken = function (): string {
    const payload = {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role
    };
  
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is not configured');
    }
  
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    if (!accessTokenExpiry || !isValidExpiry(accessTokenExpiry)) {
      throw new Error('Invalid ACCESS_TOKEN_EXPIRY format. Use like "15m" or "1h"');
    }
  
    return jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenExpiry }
    );
  };
  
  UserSchema.methods.generateRefreshToken = function (): string {
    const payload = { _id: this._id }; // Minimal payload for refresh token
  
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH_TOKEN_SECRET is not configured');
    }
  
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
    if (!refreshTokenExpiry || !isValidExpiry(refreshTokenExpiry)) {
      throw new Error('Invalid REFRESH_TOKEN_EXPIRY format. Use like "7d" or "30d"');
    }
  
    return jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: refreshTokenExpiry }
    );
  };
  
  // Helper function to validate expiry format
  function isValidExpiry(expiry: string): boolean {
    if (/^\d+$/.test(expiry)) return true; // Accept plain numbers (seconds)
    try {
      return Boolean(ms(expiry)); // Validate string formats like "15m"
    } catch {
      return false;
    }
  }

export const User = mongoose.model('User', UserSchema);