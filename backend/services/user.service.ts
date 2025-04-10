import { User } from '../models/user.model.js'; // Removed .js extension
import { ApiError } from '../utils/ApiError.js';
import { IUser } from '../types/user.types.js'; // Ensure this interface exists
import { UserDocument } from '../models/user.model.js'; // Import the document type

class UserService {
  private UserModel: typeof User;

  constructor(UserModel: typeof User = User) {
    this.UserModel = UserModel;
  }

  async register(userData: IUser): Promise<UserDocument> {
    const { email, username } = userData;

    // Check for existing user
    const existingUser = await this.UserModel.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email or username already exists');
    }

    // Set role based on whether this is the first account
    const isFirstAccount = (await this.UserModel.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    // Create new user
    const user = await this.UserModel.create({ ...userData, role });
    if (!user) {
      throw new ApiError(500, 'Failed to create user account');
    }

    return user;
  }

  async login(credentials: {
    email?: string;
    username?: string;
    password: string;
  }): Promise<UserDocument> {
    const { email, username, password } = credentials;

    if (!email && !username) {
      throw new ApiError(400, 'Email or username is required');
    }

    // Find user by email or username
    const user = await this.UserModel.findOne({
      $or: [{ email }, { username }]
    }).select('+password'); // Include password field for verification

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Remove password before returning
    user.password = undefined;
    return user;
  }
}

// Singleton instance
export const userService = new UserService();