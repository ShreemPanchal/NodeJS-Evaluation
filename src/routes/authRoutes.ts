import { Router } from "express";
import AuthController from '../controllers/authController';
import { check } from 'express-validator';

const router = Router();

router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').isLength({min: 6}).matches(/.*[!@#$%^&*_].*/).withMessage('Password must be at least 6 characters long and contain at least one special character')
], AuthController.signup);

router.post('/login', [
    check('email')
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email'),
    check('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please enter a valid phone number'),
    check('password')
        .isLength({ min: 6 })
        .matches(/.*[!@#%$^&*_].*/)
        .withMessage('Password must be at least 6 characters long and contain at least one special character'),
    check()
        .custom((value, { req }) => {
            if (!req.body.email && !req.body.phoneNumber) {
                throw new Error('Either email or phone number is required');
            }
            return true;
        })
], AuthController.login);

router.post('/reset-password', [
    check('email').isEmail().withMessage('Please enter a valid email')      
], AuthController.resetPassword);   

router.post('/new-password', [      
    check('newPassword').isLength({min: 6}).matches(/.*[!@#%$^&*_].*/).withMessage('Password must be at least 6 characters long and contain at least one special character'),
    check("confirmNewPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),     
], AuthController.newPassword); 

router.post('logout', AuthController.logout);

export default router;