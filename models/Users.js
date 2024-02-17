import mysql from 'mysql2';
import { config } from 'dotenv';
config();

import { createToken } from '../middleware/authenticateUser.js'; // Import createToken

import { createPool } from 'mysql2/promise';
import { hash } from 'bcrypt';

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

const addUsers = async (firstName, lastName, userAge, emailAdd, userPwd, userRoll) => {
    try {
        let hashedPassword = await hash(userPwd, 10);
        const [result] = await pool.query(`
        INSERT INTO
        bpthgztafnrghzzqjk7c.Users
        (firstName, lastName, userAge, emailAdd, userPwd, userRoll)
        VALUES(?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, userAge, emailAdd, hashedPassword, userRoll]);
        const userID = result.insertId;
        let user = {
            emailAdd,
            userPwd: hashedPassword
        };
        let token = createToken(user);
        return { token, user: await getOneUser(userID) };
    } catch (error) {
        console.error("User Already exists", error);
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

export { addUsers, getUsers, getOneUser, updateUser, deleteUser };
