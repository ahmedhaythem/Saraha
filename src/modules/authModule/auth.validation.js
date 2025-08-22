import Joi from "joi";
import {generalValidation} from "../../middleware/validation.middleware.js";


export const loginSchema={
    body:Joi.object({
        email:generalValidation.email.required(),
        password:Joi.string().min(5).max(10).required()
    }).required()
}

export const confirmEmailSchema=({
    body:Joi.object({
        email:generalValidation.email.required(),
        otp:Joi.number().required()
    }).required()  
})

export const signupSchema=({
    body:Joi.object({
        name:generalValidation.name.required(),
        email:generalValidation.email.required(),
        password:generalValidation.password.required(),
        confrimPassword:generalValidation.confrimPassword.required(),
        phone:generalValidation.phone.required(),
        age:generalValidation.age
    }).required()
})