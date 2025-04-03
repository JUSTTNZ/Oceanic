import dotenv from 'dotenv';

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const ENV = {
  MONGODB_URI: getEnv('MONGODB_URI'),
  PORT: parseInt(getEnv('PORT')),
  ACCESS_TOKEN_SECRET: getEnv('ACCESS_TOKEN_SECRET'),
  ACCESS_TOKEN_EXPIRY: getEnv('ACCESS_TOKEN_EXPIRY'),
  REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
  REFRESH_TOKEN_EXPIRY: getEnv('REFRESH_TOKEN_EXPIRY'),
  NODE_ENV: process.env.NODE_ENV || 'development',
};
