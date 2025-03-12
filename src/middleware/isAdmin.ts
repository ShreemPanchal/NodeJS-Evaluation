import { Request, Response, NextFunction } from "express";
import User from "../models/users"; // Ensure this path is correct

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.id; // Assume userId is set in the request, e.g., via authentication middleware

  try {
    const user = await User.findByPk(userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Admins only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
