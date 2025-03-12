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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header("Authorization");
        if (!token) {
            res.status(401).json({ message: "Access Denied. No Token Provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const user = yield users_1.default.findByPk(decoded.userId);
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
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or Expired Token" });
        return;
    }
});
exports.default = isAuth;
