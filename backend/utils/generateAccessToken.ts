// import { User } from "../models/user.model.js";
// import { ApiError } from "./ApiError.js";

// interface TokenPair {
//   accessToken: string;
//   refreshToken: string;
// }

// const generateAccessAndRefreshToken = async (userId: string): Promise<TokenPair> => {
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       throw new ApiError(404, "User not found");
//     }

//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error: any) {
//     // Optional: log the real error somewhere
//     console.error("Token generation error:", error);
//     throw new ApiError(403, "Something went wrong while generating access and refresh token");
//   }
// };

// export default generateAccessAndRefreshToken;
