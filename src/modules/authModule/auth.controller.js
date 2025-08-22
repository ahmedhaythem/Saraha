import { Router } from "express";
import * as authServices from "./auth.services.js";
import auth from "../../middleware/auth.middleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { confirmEmailSchema } from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router()
router.post("/signup", validation(signupSchema),authServices.signup);

router.post("/login", validation(loginSchema) ,authServices.login);

router.post("/refresh-Token", authServices.refreshToken);

router.post("/confirm-Email", validation(confirmEmailSchema),authServices.confirmEmail);

router.post("/forget-password", authServices.forgetPass);
router.patch("/change-password", authServices.changePass);
router.patch("/resend-email-code", authServices.resendCode);
router.patch("/resend-password-code", authServices.resendCode);

router.post("/logout", auth,authServices.logout);
router.post("/logout-from-all-devices", auth,authServices.logoutFromAllDevices);




export default router;