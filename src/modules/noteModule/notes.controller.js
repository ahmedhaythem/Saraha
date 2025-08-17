import { Router } from "express";
import * as noteServices from "./note.services.js";
import auth from "../../middleware/auth.middleware.js";

const router = Router();


router.post("/Send-Note", noteServices.createNote);
router.get("/MyNotes", auth,noteServices.getNotes);
router.delete("/Delete-Note/:id", auth,noteServices.deleteNote);




export default router;