"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
const products_1 = __importDefault(require("./products"));
class User extends sequelize_1.Model {
    static fetchAll() {
        return User.findAll();
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    resetToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiration: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
}, {
    sequelize: database_1.default,
    modelName: 'users'
});
User.hasMany(products_1.default, { foreignKey: "userId" });
products_1.default.belongsTo(User, { foreignKey: "userId" });
exports.default = User;
