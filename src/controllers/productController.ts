import { Request, Response, NextFunction } from 'express';
import Product from '../models/products';

 const addProduct = async (req: Request, res: Response):Promise<void> => {
    try {
        const { name, price, description, discount, category, imageUrl } = req.body;
        if ((req as any ).user.role !== "admin") {
            res.status(403).json({ message: "Forbidden: Admins Only" });
            return;
        }
        
        if (!name || !price || !category || !imageUrl) {
            res.status(400).json({ message: "All required fields must be filled" });
            return;
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            discount: discount , 
            category,
            imageUrl,
        });

        res.status(201).json({ message: "Product added successfully", product: newProduct });
        return;
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};

const getProducts = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {   
    const {category, minPrice, maxPrice, discount ,minRating, sort} = req.query;
    const whereClause = Object.keys(req.query).filter((key:any) => req.query[key]).map((key:any) => {
        if (key === 'category') {
            return {categoryId: req.query[key]};
        }
        if (key === 'minPrice') {   
            return {minPrice: req.query[key]};
        }
        if(key === 'maxPrice'){
            return {maxPrice: req.query[key]};
        }
        if(key === 'discount'){
            return {discount: req.query[key]};
        }
        if (key === 'minRating') {
            return {minRating: req.query[key]};
        }
    });
    try {
        const products = await Product.findAll({where:{whereClause}});
        res.status(200).json({products});
    }
    catch (err) {   
        res.status(500).json({message: 'Internal server error'});
        return;
    }
};




export default { addProduct,getProducts };