import { Router } from "express";
import * as userServices from "./user.services.js";
import auth from "../../middleware/auth.middleware.js";

const router = Router()
router.get("/getUser", auth,userServices.getUser);
router.get("/getAllUsers",userServices.getAllUsers);





export default router;