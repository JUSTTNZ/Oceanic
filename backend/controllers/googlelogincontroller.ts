import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import admin from 'firebase-admin'

const generateAccessAndRefreshToken = async (userId: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError({ statusCode: 404, message: "User not found" })
        }

        const accessToken = await (user as any).generateAccessToken();
        const refreshToken = await (user as any).generateRefreshToken();

        (user as any).refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError({ statusCode: 403, message: "Something went wrong while generating access and refresh token" })
    }
}
const handleGoogleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body; // Frontend sends Firebase ID token

  if (!idToken) {
    throw new ApiError({ statusCode: 400, message: "ID token is required" });
  }

  try {
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;

    if (!email) {
      throw new ApiError({ statusCode: 400, message: "Email not found in token" });
    }


    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
      const userCount = await User.countDocuments();
      let role = userCount === 0 ? "superadmin" : userCount === 1 ? "admin" : "user";

      user = await User.create({
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        fullname: name || "Google User",
        avatar: picture,
        isGoogleAuth: true,
        isVerified: true,
        role,
        phoneNumber: undefined,
        password: "firebase-auth-placeholder", 
      });
    }

  
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString());
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(200, "Google login successful", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    console.error("Firebase Google Auth error:", error);
    throw new ApiError({
      statusCode: 401,
      message: "Invalid or expired Firebase token",
    });
  }
});

export { handleGoogleLogin };