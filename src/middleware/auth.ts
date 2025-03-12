import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";

// Define an interface extending Express Request
interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}

const isAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            res.status(401).json({ message: "Access Denied. No Token Provided" });
            return;
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET as string) as { userId: string };
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or Expired Token" });
        return;
    }
};

export default isAuth;
