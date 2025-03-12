import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/users';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import  jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';        
dotenv.config();

type SignupRequestBody ={
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
}

interface LoginRequestBody {
    email?: string;
    phoneNumber?: string;
    password: string;
}

const signup = async (
    req: Request<{}, {}, SignupRequestBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, phoneNumber, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }
    const ADMIN_EMAILS:string[] = ["admin@example.com", "superadmin@yourdomain.com"];


    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

        const user = await User.create({ name, email, phoneNumber, password: hashedPassword, role });
        
        res.status(201).json({ message: "User created successfully", user,role });
        return;
    } catch (err) {
        console.error("Signup Error:", err);
         res.status(500).json({ message: 'Internal server error' });
         return;
    }
};

const login = async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response,
    next: NextFunction
):Promise<void> => {
    const { email, phoneNumber, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }
    if (!email && !phoneNumber) {
        res.status(400).json({ message: 'Please provide either an email or phone number' });
        return 
    }
    const ADMIN_EMAILS:string[] = ["admin@example.com", "superadmin@yourdomain.com"];

    try {

        const whereCondition = [];
        if (email) whereCondition.push({ email });
        if (phoneNumber) whereCondition.push({ phoneNumber });
        const user = await User.findOne({
            where: {
                [Op.or]: whereCondition
        }});

        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
           res.status(401).json({ message: 'Invalid email or password' });
           return
        }
        const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";
        const resetToken = jwt.sign({email: user.email, userId: user.id,role:user.role}, process.env.JWT_SECRET as string, {expiresIn: '1h'});

        res.status(200).json({ message: 'Login successful', user, resetToken ,role });
        return 
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

const resetPassword = async( req:Request, res:Response, next:NextFunction):Promise<void> => {
    const {email} = req.body ;
    const errors = validationResult(req);       
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const user = await User.findOne({where:{email:email}});
        if(!user){
            res.status(401).json({message:"User not Found"});
            return;
        }
        const resetToken = jwt.sign({email: user.email, userId: user.id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_ID,
                pass:process.env.EMAIL_PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.DB_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<h1>Click this <a href="http://localhost:5000/reset/${resetToken}">link</a> to reset your password</h1>`
        }

        await transporter.sendMail(mailOptions)
        res.status(200).json({message:"Reset link sent to your email"});
        return;
            
    } catch (err) {
        console.log("resetPassword err:", err);
        res.status(500).json({ message: "Internal server error" });
        return
    }
} 

const newPassword = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    const { resetToken ,newPassword,confirmNewPassword }= req. body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {    
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        if (newPassword !== confirmNewPassword) {
          res.status(401).json({ message: "Passwords do not match" });
          return;
        }
        const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET as string) as { userId: number };
        const userId = decodedToken.userId; 
        const user = await User.findByPk(userId);
        if(!user){
            res.status(401).json({message:"User not Found"});
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password=hashedPassword;
        await user.save();
        res.status(200).json({message:"Password reset successfully"});
        return;   
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

const logout = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        res.status(200).json({message:"Logged out successfully"});
    } catch (err) {     
        res.status(500).json({ message: "Internal server error" });
        return
    }
}   

export default { signup , login, resetPassword, newPassword, logout};