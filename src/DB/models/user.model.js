import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: {
        type: Number,
        min: 18,
        max: 60
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    emailOtp:{
        type:String
    },
    passwordOtp:{
        type:String
    },
    refreshToken: { type: String },
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

const User = mongoose.model('User', userSchema);
export default User;