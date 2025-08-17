import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;
