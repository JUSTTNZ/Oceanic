import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

class UserService {
  private _User: typeof User;

  constructor() {
    this._User = User;
  }

  async register(userObject: {
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
  }): Promise<typeof User> {
    try {
      const { email, username } = userObject;

      // Check for existing user by email or username
      const existingUser = await this._User.findOne({
        $or: [{ email }, { username }]
      });
      
      if (existingUser) {
        throw new ApiError({
          statusCode: 409,
          message: "User with this email or username already exists"
        });
      }

      // Role assignment logic
      const userCount = await this._User.countDocuments({});
      let role = 'user';
      
      if (userCount === 0) {
        role = 'superadmin'; // First user becomes superadmin
      } else if (userCount === 1) {
        role = 'admin'; // Second user becomes admin
      }

      // Create user with assigned role
      const user = await this._User.create({
        ...userObject,
        role,
        isVerified: false
      });

      if (!user) {
        throw new ApiError({
          statusCode: 500,
          message: "Failed to create user account"
        });
      }

      // Return user without password
      const userWithoutPassword = user.toObject();
      delete (userWithoutPassword as { password?: string }).password;
      return userWithoutPassword

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ApiError({
          statusCode: 500,
          message: error.message,
          stack: error.stack
        });
      } else {
        throw new ApiError({
          statusCode: 500,
          message: "An unknown error occurred during registration"
        });
      }
  }
}

export default new UserService();