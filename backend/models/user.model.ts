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

  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
  if (!accessTokenExpiry || !isValidExpiry(accessTokenExpiry)) {
    throw new Error('Invalid ACCESS_TOKEN_EXPIRY format. Use like "15m" or "1h"');
  }

  const opts = {expiresIn: accessTokenExpiry} as jwt.SignOptions //we add "as jwt.SignOptions" to make the jwt.sign method know that we passed an object and not a callback function.

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, opts);
  
};
  
UserSchema.methods.generateRefreshToken = function () {
  const payload = { _id: this._id }; // Minimal payload for refresh token

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured');
  }

  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  if (!refreshTokenExpiry || !isValidExpiry(refreshTokenExpiry)) {
    throw new Error('Invalid REFRESH_TOKEN_EXPIRY format. Use like "7d" or "30d"');
  }
  
  const opts =   { expiresIn: refreshTokenExpiry } as jwt.SignOptions; //we add "as jwt.SignOptions" to make the jwt.sign method know that we passed an object and not a callback function.

  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    opts
  );
};

  
  // Helper function to validate expiry format
  function isValidExpiry(expiry: any): boolean {
    // if it is a negative number return false.
    if(Number(expiry) < 0) return false;

    //check if expiry is a number written as a string.
    const regexIsNumber = /^\d+$/;

    //test for format like "10 days", "10d", "2 hrs", "4h".
    const regexAlphaNum = /^(\d{1,})+\s?[a-z]+$/;

    const isNumber = regexIsNumber.test(expiry);
    const isAlphaNum = regexAlphaNum.test(expiry);

    if (isNumber) return true; // Accept plain numbers (seconds)
    else{
      //if expiry contains a number and a letter.
      if(isAlphaNum){
        try {
          const milliseconds = ms(expiry);
          return milliseconds != undefined ? true : false; // Validate string formats like "15m"
        } catch {
          //if an error is thrown return false;
          return false;
        }
      }else return false;
    }
         
  }

export const User = mongoose.model('User', UserSchema);