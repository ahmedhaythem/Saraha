import { Router } from "express";
import * as authServices from "./auth.services.js";
import auth from "../../middleware/auth.middleware.js";

const router = Router()
router.post("/signup", authServices.signup);
router.post("/login", authServices.login);
router.post("/refresh-Token", authServices.refreshToken);
router.post("/confirm-Email", authServices.confirmEmail);
router.post("/forget-password", authServices.forgetPass);
router.patch("/change-password", authServices.changePass);




export default router;