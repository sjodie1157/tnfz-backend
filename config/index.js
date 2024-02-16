import mysql from 'mysql2';
import { config } from "dotenv";

config();

const pool = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    multipleStatements: true,
    connectionLimit: 30
});

const connection = pool.promise();

export { connection };
