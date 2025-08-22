import jwt from "jsonwebtoken";
import User from "../DB/models/user.model.js";
import { findById } from "../DB/DBServices.js";
import { revokeTokenModel } from "../DB/models/revokeToken.model.js";

const auth =async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({ error: "token must start with 'Bearer'" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESSTOKEN || "SECRET");
    const user = await findById(User,decoded.userId);
    try {

        if (!user) {
        return res.status(401).json({ error: "User not found for this token" });
        }

        if(await revokeTokenModel.findOne({jti:decoded.jti})){
            return res.status(200).json({error:"token is revoked"})
        }

        req.userId = decoded.userId;
        req.user=user
        req.decoded=decoded
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    if(!user.confirmed){
        return res.status(400).json({error:"email not confirmed"})
    }

    if(user.changedCredentialsAt?.getTime()>=decoded.iat*1000){
        return res.status(400).json({error:"please login again"})
    }
};

export default auth;
