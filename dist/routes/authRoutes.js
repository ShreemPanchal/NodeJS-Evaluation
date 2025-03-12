"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/signup', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).matches(/.*[!@#$%^&*_].*/).withMessage('Password must be at least 6 characters long and contain at least one special character')
], authController_1.default.signup);
router.post('/login', [
    (0, express_validator_1.check)('email')
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email'),
    (0, express_validator_1.check)('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please enter a valid phone number'),
    (0, express_validator_1.check)('password')
        .isLength({ min: 6 })
        .matches(/.*[!@#%$^&*_].*/)
        .withMessage('Password must be at least 6 characters long and contain at least one special character'),
    (0, express_validator_1.check)()
        .custom((value, { req }) => {
        if (!req.body.email && !req.body.phoneNumber) {
            throw new Error('Either email or phone number is required');
        }
        return true;
    })
], authController_1.default.login);
router.post('/reset-password', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid email')
], authController_1.default.resetPassword);
router.post('/new-password', [
    (0, express_validator_1.check)('newPassword').isLength({ min: 6 }).matches(/.*[!@#%$^&*_].*/).withMessage('Password must be at least 6 characters long and contain at least one special character'),
    (0, express_validator_1.check)("confirmNewPassword")
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage("Passwords do not match"),
], authController_1.default.newPassword);
router.post('logout', authController_1.default.logout);
exports.default = router;
