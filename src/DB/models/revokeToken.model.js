
import { Schema, model,Types } from "mongoose";

const revokeTokenSchema=new Schema({
    jti:{
        type:String,
        require:true,
        unique:true
    },
    expireIn:{
        type:Date,
        required:true,
    },
    userId:{
        type:String,
        ref:"User",
        required:true,
    }
},{
    timestamps:true,
})

export const revokeTokenModel=model("revokeToken",revokeTokenSchema)