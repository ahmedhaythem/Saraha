import User from "../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findById, findOne } from "../../DB/DBServices.js";


export const getUser=async (req,res) => {
    const id=req.userId

    try {
        const user =await User.findById(id).select("-password -otp")

        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const getAllUsers=async (req,res) => {
    try {
        const users=await User.find().select("-password -otp")
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const updateUser=async (req,res) => {
    const userId=req.userId
    const updates = req.body;
    
    try{
        if (updates.password) delete updates.password;

        if (updates.email) {
            const emailExists = await User.findOne({ email: updates.email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({ error: "Email already exists" });
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
            ).select("-password");
        
        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        if(!user.confirmed){
            return res.status(400).json({error:"email not confrimed"})
        }

        res.status(200).json({message:"User updated successfully"});
        
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}