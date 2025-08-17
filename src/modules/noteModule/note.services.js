import Note from "../../DB/models/note.model.js";


export const createNote = async (req, res) => {
  const {receiverId,message}=req.body
  try {
      const note = await Note.create({ receiverId, message });
      res.status(201).json(note);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const getNotes = async (req, res) => {
  const userId = req.userId;

  try {
      const notes = await Note.find({ receiverId: userId }).sort({createdAt:-1});
      res.status(200).json({notes:notes});
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const deleteNote=async (req,res) => {
  const userId=req.userId
  const noteId=req.params.id

  try {
    const note=await Note.findOneAndDelete({_id:noteId ,receiverId:userId})

    if (!note) {
      return res.status(404).json({error:"Note not found"})
    }
    res.status(200).json({message:"Note deleted successfully"})
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}