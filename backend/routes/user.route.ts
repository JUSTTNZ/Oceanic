import { Router } from "express"
// import { verifyJWT, adminAuth } from '../middlewares/auth.middlewares.js'
import {
    registerUser,
    loginUser,
} from "../controllers/user.controller.js"
import { userRegisterValidator } from "../middlewares/validator";

const router = Router();

//test endpoint
router.route("/register").post(userRegisterValidator, registerUser);

router.route("/login").post(loginUser)

export default router