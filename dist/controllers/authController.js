"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const users_1 = __importDefault(require("../models/users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const ADMIN_EMAILS = ["admin@example.com", "superadmin@yourdomain.com"];
    try {
        const existingUser = yield users_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";
        const user = yield users_1.default.create({ name, email, phoneNumber, password: hashedPassword, role });
        res.status(201).json({ message: "User created successfully", user, role });
        return;
    }
    catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    if (!email && !phoneNumber) {
        res.status(400).json({ message: 'Please provide either an email or phone number' });
        return;
    }
    const ADMIN_EMAILS = ["admin@example.com", "superadmin@yourdomain.com"];
    try {
        const whereCondition = [];
        if (email)
            whereCondition.push({ email });
        if (phoneNumber)
            whereCondition.push({ phoneNumber });
        const user = yield users_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: whereCondition
            }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const isEqual = yield bcryptjs_1.default.compare(password, user.password);
        if (!isEqual) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";
        const resetToken = jsonwebtoken_1.default.sign({ email: user.email, userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', user, resetToken, role });
        return;
    }
    catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const user = yield users_1.default.findOne({ where: { email: email } });
        if (!user) {
            res.status(401).json({ message: "User not Found" });
            return;
        }
        const resetToken = jsonwebtoken_1.default.sign({ email: user.email, userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.DB_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `<h1>Click this <a href="http://localhost:5000/reset/${resetToken}">link</a> to reset your password</h1>`
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset link sent to your email" });
        return;
    }
    catch (err) {
        console.log("resetPassword err:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
const newPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetToken, newPassword, confirmNewPassword } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        if (newPassword !== confirmNewPassword) {
            res.status(401).json({ message: "Passwords do not match" });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(resetToken, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const user = yield users_1.default.findByPk(userId);
        if (!user) {
            res.status(401).json({ message: "User not Found" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: "Password reset successfully" });
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.default = { signup, login, resetPassword, newPassword, logout };
