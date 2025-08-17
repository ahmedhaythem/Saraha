import { EventEmitter } from "events";
import { sendEmail } from "./sendEmail.js";
import { template } from "../../utils/sendEmail/generatedHTML.js";
import {customAlphabet } from "nanoid";


export const emailEmitter=new EventEmitter()

export const createOtp=()=>{
    const otp=customAlphabet('0123456789',6)()
    return otp
}

emailEmitter.on('confirmEmail',async ({email,userName,otp})=>{
    console.log("email sending...");
    

    const subject="Confrim email"
    const html=template(otp,userName,subject)

    await sendEmail({
        to:email,
        html,
        subject
    })

    console.log("email sent");
})

emailEmitter.on('sendPasswrodOTP',async ({email,userName,otp})=>{
    console.log("email sending...");
    

    const subject="forget password"
    const html=template(otp,userName,subject)

    await sendEmail({
        to:email,
        html,
        subject
    })

    console.log("email sent");
})