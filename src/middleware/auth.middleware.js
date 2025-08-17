import jwt from "jsonwebtoken";
import User from "../DB/models/user.model.js";
import { findById } from "../DB/DBServices.js";

const auth =async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "token must start with 'Bearer'" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESSTOKEN || "SECRET");
    const user = await findById(User,decoded.userId);
    try {

        if (!user) {
        return res.status(401).json({ message: "User not found for this token" });
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    if(!user.confirmed){
        return res.status(400).json({error:"email not confirmed"})
    }
};

export default auth;
