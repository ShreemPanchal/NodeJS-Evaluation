
import {Router} from "express"
import productController from "../controllers/productController";
import { check } from "express-validator";
import isAuth  from "../middleware/auth";


const router = Router();

router.get('/add-product', [   
    check('name').isString().withMessage('Please enter a valid product name'),
    check('description').isString().withMessage('Please enter a valid product description'),
    check('price').isNumeric().withMessage('Please enter a valid product price'),
    check('category').isString().withMessage('Please enter a valid product category'),
    check('quantity').isNumeric().withMessage('Please enter a valid product quantity'),
    check('image').isURL().withMessage('Please enter a valid product image URL')
],isAuth, productController.addProduct);   

router.get('/products', productController.getProducts);


export default router;