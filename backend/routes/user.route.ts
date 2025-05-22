import { Router } from "express"
import { verifyJWT, adminAuth } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshAccessToken,
    logOutUser,
    changeUserCurrentPassword,
    updateUserDetails
    
} from "../controllers/user.controller.js"
import { userRegisterValidator, userLoginValidator } from "../middlewares/validator.js";

const router = Router();

//test endpoint
router.route("/register").post(userRegisterValidator, registerUser);
router.route("/login").post(userLoginValidator, loginUser);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
router.route("/refreshToken").post(verifyJWT, refreshAccessToken);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/changePassword").put(verifyJWT, changeUserCurrentPassword);
router.route("/updateUser").put(verifyJWT, updateUserDetails);

export default router