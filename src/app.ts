 import path from 'path';
 import express from 'express';
 import bodyParser from 'body-parser';
 import AuthRoutes from './routes/authRoutes';
 import ProductRoutes from './routes/productRoutes'
 import dotenv from 'dotenv';
    dotenv.config();  

 const app= express();

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: false}));
 app.use(express.static(path.join(__dirname, 'public')));
 app.use('/seabasket/auth', AuthRoutes);
 app.use('/seabasket/products',ProductRoutes);

 app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });

