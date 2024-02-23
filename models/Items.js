import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';

config();

const pool = createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    multipleStatements: true,
    connectionLimit: 30
});

const getItems = async () => {
    try {
        const [result] = await pool.query(`
            SELECT prodID, prodName, quantity, amount, category, prodURL
            FROM bpthgztafnrghzzqjk7c.Items;
        `);
        return result;
    } catch (error) {
        console.error("Error getting Items:", error.message);
        throw error;
    }
};

const getSingleItem = async (id) => {
    try {
        const [result] = await pool.query(`
            SELECT prodID, prodName, quantity, amount, category, prodURL
            FROM bpthgztafnrghzzqjk7c.Items
            WHERE prodID = ?`, [id]);
        return result;
    } catch (error) {
        console.error("Error getting one Item:", error.message);
        throw error;
    }
};

const addItem = async (prodName, quantity, amount, category, prodURL) => {
    try {
        const [result] = await pool.query(`
            INSERT INTO
            bpthgztafnrghzzqjk7c.Items (prodName, quantity, amount, category, prodURL)
            VALUES (?, ?, ?, ?, ?);`,
            [prodName, quantity, amount, category, prodURL]);
        const prodID = result.insertId;
        return { item: await getSingleItem(prodID) };
    } catch (error) {
        console.error("Error adding item:", error.message);
        throw error;
    }
};

export { getItems, getSingleItem, addItem };
