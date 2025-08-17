import { Router } from "express";
import * as noteServices from "./note.services.js";
import auth from "../../middleware/auth.middleware.js";

const router = Router();


router.post("/", auth, noteServices.createNote);




export default router;