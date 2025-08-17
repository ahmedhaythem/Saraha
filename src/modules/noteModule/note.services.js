import Note from "../../DB/models/note.model.js";


export const createNote = async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content, userId: req.userId });
  await note.save();
  res.status(201).json(note);
};