import { createPool } from 'mysql';
import { config } from "dotenv";

config()

let connection = createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    multipleStatements: true,
    connectionLimit: 30
}).promise()

export { connection }