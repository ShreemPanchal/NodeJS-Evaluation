import { Model, DataTypes } from "sequelize";
import sequelize from "../util/database";
import User from "./user"; // Ensure this path is correct

interface ProductsAttributes {
  id: number;
  userId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  category:string;
  discount: number;
  imageUrl: string;
}

class Product extends Model<ProductsAttributes> implements ProductsAttributes {
  public id!: number;
  public userId!: number;
  public categoryId!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public discount!: number;
  public imageUrl!: string;

  public static fetchAll() {
    return Product.findAll();
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure userId is non-nullable
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    discount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    category:{
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "products",
  }
);

// Define associations
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

export default Product;
