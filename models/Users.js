import mysql from 'mysql2';
import { config } from 'dotenv';
config();

import { createToken } from '../middleware/authenticateUser.js'; // Import createToken

// Import connection directly from mysql2
import { createPool } from 'mysql2/promise';

// Use createPool instead of mysql.createPool
const pool = createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    multipleStatements: true,
    connectionLimit: 30
});

const getUsers = async () => {
    try {
        const [result] = await pool.query(`
            SELECT userID, firstName, lastName, userAge, emailAdd, userPwd, userRoll
            FROM bpthgztafnrghzzqjk7c.Users;`);
        return result;
    } catch (error) {
        console.error("Error getting users:", error);
        throw error;
    }
};

const getOneUser = async (id) => {
    try {
        const [result] = await pool.query(`
        SELECT userID, firstName, lastName, userAge, emailAdd, userPwd, userRoll
        FROM bpthgztafnrghzzqjk7c.Users
        WHERE userID = ?`, [id]);
        return result;
    } catch (error) {
        console.error("Error getting one user:", error);
        throw error;
    }
};

const addUser = async (firstName, lastName, userAge, emailAdd, userPwd, userRoll) => {
    try {
        const [result] = await pool.query(`
        INSERT INTO
        bpthgztafnrghzzqjk7c.Users
        (firstName, lastName, userAge, emailAdd, userPwd, userRoll)
        VALUES(?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, userAge, emailAdd, userPwd, userRoll]);
        const userID = result.insertId;
        return getOneUser(userID);
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

const updateUser = async (id, firstName, lastName, userAge, emailAdd, userPwd, userRoll) => {
    try {
        const [existUser] = await getOneUser(id);

        if (!existUser) {
            throw new Error("User not found");
        }
        firstName = firstName || existUser.firstName;
        lastName = lastName || existUser.lastName;
        userAge = userAge || existUser.userAge;
        emailAdd = emailAdd || existUser.emailAdd;
        userPwd = userPwd || existUser.userPwd;
        userRoll = userRoll || existUser.userRoll;

        const [User] = await pool.query(
            `UPDATE bpthgztafnrghzzqjk7c.Users
            SET firstName = ?, lastName = ?, userAge = ?, emailAdd = ?, userPwd = ?, userRoll = ?
            WHERE userID = ?`,
            [firstName, lastName, userAge, emailAdd, userPwd, userRoll, id]
        );

        return getOneUser(id);
    } catch (error) {
        console.error("Error updating User:", error);
        throw error;
    }
}

const deleteUser = async (id) => {
    const [User] = await pool.query(`
    DELETE FROM bpthgztafnrghzzqjk7c.Users 
    WHERE userID = ?`, [id])
    return getUsers(User);
}

export { addUser, getUsers, getOneUser, updateUser, deleteUser };
