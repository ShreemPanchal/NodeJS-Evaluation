import {Model , DataTypes} from 'sequelize';
import sequelize from '../util/database';
import Product from './products';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
    resetToken: string;
    resetTokenExpiration: Date;
}

class User extends Model implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public phoneNumber!: string;
    public password!: string;
    public role!: string;
    public resetToken!: string; 
    public resetTokenExpiration!: Date;

    public static fetchAll() {
        return User.findAll();
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
         phoneNumber:{
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role:{
            type:DataTypes.ENUM('admin','user'),
            allowNull: false,
            defaultValue: 'user'
        },
        resetToken:{
            type: DataTypes.STRING,
            allowNull: true
        },
        resetTokenExpiration:{
            type: DataTypes.DATE,
            allowNull: true
        } ,
       
    },
    {
        sequelize,
        modelName: 'users'
    }
);

User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });
export default User;