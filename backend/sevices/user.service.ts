import { User } from '../models/user.model'; // ✅ Corrected: named import, no .js extension
import { ApiError } from '../utils/ApiError'; // ✅ Corrected: named import
import { IUser } from '../types/user.types'; // ✅ Ensure this file exists
import { UserDocument } from '../models/user.model'; // ✅ Corrected: no .js extension

class UserService {
  private _User: typeof User;

  constructor() {
    this._User = User;
  }

  async register(userObject: IUser): Promise<UserDocument> {
    const { email, username } = userObject;

    const existingUser = await this._User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new ApiError(400, 'User already exists with that email or username');
    }

    const isFirstAccount = await this._User.countDocuments({}) === 0;
    userObject.role = isFirstAccount ? 'admin' : 'user';

    const user = await this._User.create(userObject);
    if (!user) throw new ApiError(401, 'Something went wrong while registering user');

    return user as UserDocument;
  }

  async login({ email, username, password }: { email?: string; username?: string; password: string }): Promise<UserDocument> {
    const user = await this._User.findOne({
      $or: [{ email }, { username }]
    });

    if (!user) throw new ApiError(404, 'User not found');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    return user as UserDocument;
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
