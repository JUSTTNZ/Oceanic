import { Router } from "express"
// import { verifyJWT, adminAuth } from "../middlewares/auth.middleware.js";
import {
    registerUser
} from "../controllers/user.controller.js"
import { userRegisterValidator } from "../middlewares/validator.js";

const router = Router();

//test endpoint
router.route("/register").post(userRegisterValidator, registerUser);

export default router