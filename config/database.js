// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

try {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'chatapplication_api',
    process.env.DB_USER ,
    process.env.DB_PASSWORD ,
    
    {
      host: process.env.DB_HOST, 
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
    }
  );
  
  sequelize.authenticate()
    .then(() => console.log("MySQL Database connected successfully"))
    .catch(err => console.error("MySQL connection error:", err));
} catch (error) {
  console.error("MySQL connection error:", error);
}

export default sequelize;
