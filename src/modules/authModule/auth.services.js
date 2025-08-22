import User from "../../DB/models/user.model.js";
import { findOne ,findById } from "../../DB/DBServices.js";
import bcrypt, { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import {customAlphabet } from "nanoid";
import { template } from "../../utils/sendEmail/generatedHTML.js";
import { sendEmail } from "../../utils/sendEmail/sendEmail.js";
import { createOtp, emailEmitter } from "../../utils/sendEmail/emailEvents.js";





export const signup = async (req, res) => {
    const { name, email, password, phone, age } = req.body;

    const existing = await findOne(User,{ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const otp=createOtp()
    const hashedOtp = await hash(otp, 10);
    const newUser = new User({
        name, 
        email, 
        password, 
        phone, 
        age, 
        emailOtp:{
            otp:hashedOtp,
            expireIn:Date.now()+ 2 * 60 * 1000
    } 
});
    await newUser.save();

    emailEmitter.emit('confirmEmail',{email:newUser.email,otp,userName:newUser.name})
    res.status(201).json({ message: "User created" });
};


export const login = async(req,res)=>{
    const{email,password}=req.body

    const user= await User.findOne({email})
    if(!email || !password){
        return res.status(404).json({error:"email amd password are required"})
    }
    if (!user || !(await bcrypt.compare(password, user.password))){
        return res.status(400).json({ error: "Invalid email or password" });
    }

    if(!user.confirmed){
        return res.status(400).json({error:"email not confirmed"})
    }

    const accessToken=jwt.sign({userId:user._id},process.env.accessToken,{expiresIn:"2h"});
    const refreshToken=jwt.sign({userId:user._id},process.env.refreshToken,{expiresIn:"7d"})

    res.json({message:"Login successful",accessToken:accessToken,refreshToken:refreshToken})
}

export const refreshToken=async(req,res,next)=>{
    const {authorization}=req.headers
    const payload=jwt.verify(authorization,process.env.refreshToken)
    const user=await findById(User,payload.userId)

    if(!user){
        return next(new Error("user not found",{cause:404}))
    }
    const accessToken=jwt.sign({
        _id:user._id,
        email:user.email
    },process.env.accessToken
    ,{
        expiresIn:`1h`
    })
    res.status(200).json({data:{accessToken}})
}

export const confirmEmail=async (req,res) => {
    const {email,otp}=req.body

    if(!email||!otp){
        return res.status(400).json({error:"email and OTP are required "})
    }

    const user =await findOne(User,{email})

    if (!user) {
        return res.status(404).json({error:"User not found"})
    }


    if (user.otpBanUntil && user.otpBanUntil > Date.now()) {
        const remaining = Math.ceil((user.otpBanUntil - Date.now()) / 1000);
    return res.status(403).json({
        error: `Too many failed attempts. Try again in ${remaining} seconds.`,
        });
    }

    if(user.emailOtp.expireIn <= Date.now()){
        return res.status(500).json({error:"otp expired...please reconfirm your email"})
    }


    const isMatch=await bcrypt.compare(otp,user.emailOtp.otp)
    if (!isMatch) {
        user.failedOtpAttempts += 1;

        if (user.failedOtpAttempts >= 5) {
        user.otpBanUntil = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        return res.status(403).json({ error: "Too many failed attempts. Banned for 5 minutes." });
        }

        await user.save();
        return res.status(400).json({ error: "Invalid OTP" });
    }


    

    user.emailOtp = undefined;
    user.confirmed=true
    user.failedOtpAttempts = 0;
    user.otpBanUntil = null;
    await user.save()
    res.status(200).json({message:"Email verified successfully"})
}


export const resendCode=async (req,res) => {
    const {email}=req.body
    const user =await findOne(User,{email})

    if (!user) {
        return res.status(404).json({error:"User not found"})
    }

    if (user.otpBanUntil && user.otpBanUntil > Date.now()) {
        const remaining = Math.ceil((user.otpBanUntil - Date.now()) / 1000);
        return res.status(403).json({ 
        error: `You are temporarily banned. Try again in ${remaining} seconds.` 
        });
    }


    let type="emailOtp"
    let event="confirmEmail"
    if(req.url.includes('password')){
        type="passwordOtp"
        event="sendPasswrodOTP"
    }

    const otp =createOtp()
    const hashedOtp = await hash(otp, 10);
    user[type].otp=hashedOtp
    user[type].expireIn=Date.now() + 2 * 60 *1000
    user.failedOtpAttempts = 0;
    user.otpBanUntil = undefined;
    await user.save()
    emailEmitter.emit(event,{email:user.email, otp, userName:user.name})
    return res.status(200).json({message:"Done"})
}



export const forgetPass=async (req,res) => {
    const {email}=req.body

    const user=await User.findOne({email})
    if(!user){
        return res.status(404).json({error:"User not found"})
    }

    if(!user.confirmed){
        return res.status(400).json({error:"email not confrimed"})
    }

    const otp =createOtp()
    const hashedPasswordOtp=await hash(otp,10)
    user.passwordOtp={
        otp:hashedPasswordOtp,
        expireIn:Date.now() + 2 * 60 * 1000
    }
    await user.save()

    emailEmitter.emit('sendPasswrodOTP',{
        email:user.email,
        userName:user.name,
        otp
    })
    res.status(200).json({message:"Done"})
}




export const changePass=async(req,res)=>{
    const {email,otp,newPassword}=req.body
    const user= await User.findOne({email})
    if(!user){
        return res.status(404).json({error:"user not found"})
    }

    if(user.passwordOtp.expireIn <= Date.now()){
        return res.status(500).json({error:"otp expired...please resend changed password otp"})
    }

    const isMatch = await compare(otp, user.passwordOtp.otp);
    if (!isMatch) {
    return res.status(400).json({ error: "Invalid OTP" });
    }
    const hashedPassword = await hash(newPassword, 10);
    await User.updateOne({_id:user._id},{
        password:hashedPassword,
        $unset:{
            passwordOtp:""
        }
    })

    res.status(202).json({message:"Done"})
}