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
const products_1 = __importDefault(require("../models/products"));
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, discount, category, imageUrl } = req.body;
        if (req.user.role !== "admin") {
            res.status(403).json({ message: "Forbidden: Admins Only" });
            return;
        }
        if (!name || !price || !category || !imageUrl) {
            res.status(400).json({ message: "All required fields must be filled" });
            return;
        }
        const newProduct = yield products_1.default.create({
            name,
            description,
            price,
            discount: discount,
            category,
            imageUrl,
        });
        res.status(201).json({ message: "Product added successfully", product: newProduct });
        return;
    }
    catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, minPrice, maxPrice, discount, minRating, sort } = req.query;
    const whereClause = Object.keys(req.query).filter((key) => req.query[key]).map((key) => {
        if (key === 'category') {
            return { categoryId: req.query[key] };
        }
        if (key === 'minPrice') {
            return { minPrice: req.query[key] };
        }
        if (key === 'maxPrice') {
            return { maxPrice: req.query[key] };
        }
        if (key === 'discount') {
            return { discount: req.query[key] };
        }
        if (key === 'minRating') {
            return { minRating: req.query[key] };
        }
    });
    try {
        const products = yield products_1.default.findAll({ where: { whereClause } });
        res.status(200).json({ products });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.default = { addProduct, getProducts };
