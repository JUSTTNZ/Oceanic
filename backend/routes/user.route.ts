import { Router } from "express"
// import { verifyJWT, adminAuth } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginUser
} from "../controllers/user.controller.js"
import { userRegisterValidator, userLoginValidator } from "../middlewares/validator.js";

const router = Router();

//test endpoint
router.route("/register").post(userRegisterValidator, registerUser);
router.route("/login").post(userLoginValidator, loginUser);

export default router