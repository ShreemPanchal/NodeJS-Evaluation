import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST as string,
        dialect: "mysql",
    }
)

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log(" All tables synced successfully!");
    } catch (err) {
        console.error(" Error syncing tables:", err);
    }
};

syncDatabase();

export default sequelize;