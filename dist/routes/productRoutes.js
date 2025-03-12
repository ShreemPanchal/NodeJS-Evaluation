"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controllers/productController"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.get('/add-product', [
    (0, express_validator_1.check)('name').isString().withMessage('Please enter a valid product name'),
    (0, express_validator_1.check)('description').isString().withMessage('Please enter a valid product description'),
    (0, express_validator_1.check)('price').isNumeric().withMessage('Please enter a valid product price'),
    (0, express_validator_1.check)('category').isString().withMessage('Please enter a valid product category'),
    (0, express_validator_1.check)('quantity').isNumeric().withMessage('Please enter a valid product quantity'),
    (0, express_validator_1.check)('image').isURL().withMessage('Please enter a valid product image URL')
], auth_1.default, productController_1.default.addProduct);
router.get('/products', productController_1.default.getProducts);
exports.default = router;
