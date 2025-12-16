import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function verifyJWT(req, res, next) {
    const header = req.header("Authorization");

    if (!header) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const token = header.replace("Bearer ", "");
        
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.user = verified; 
        
        next();
    } catch (err) {
        
        res.status(403).json({ message: "Invalid Token" });
    }
}