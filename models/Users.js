import { compare, hash } from 'bcrypt';
import { createToken } from '../middleware/authenticateUser.js';
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

const addUsers = async (firstName, lastName, userAge, emailAdd, userPwd) => {
    try {
        let hashedPassword = await hash(userPwd, 10);
        const [result] = await pool.query(`
            INSERT INTO
            bpthgztafnrghzzqjk7c.Users
            (firstName, lastName, userAge, emailAdd, userPwd, userRoll)
            VALUES(?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, userAge, emailAdd, hashedPassword, "User"]);
        const userID = result.insertId;
        let user = {
            emailAdd,
            userPwd: hashedPassword
        };
        return { user: await getOneUser(userID) };
    } catch (error) {
        console.error("User Already exists", error);
        throw error;
    }
};

const updateUser = async (id, updatedFields) => {
    try {
        const [existUser] = await getOneUser(id);

        if (!existUser) {
            throw new Error("User not found");
        }

        const setClause = Object.keys(updatedFields).map(field => `${field} = ?`).join(', ');

        const params = [...Object.values(updatedFields), id];

        const [User] = await pool.query(
            `UPDATE bpthgztafnrghzzqjk7c.Users
            SET ${setClause}
            WHERE userID = ?`,
            params
        );
        let user = {
            emailAdd: updatedFields.emailAdd,
            userPwd: updatedFields.userPwd
        };
        return { user: await getOneUser(id) };
    } catch (error) {
        console.error("Error updating User:", error);
        throw error;
    }
};

const deleteUser = async (id) => {
    const [User] = await pool.query(`
        DELETE FROM bpthgztafnrghzzqjk7c.Users 
        WHERE userID = ?`, [id]);
    return getUsers(User);
};

const signIn = async (emailAdd, userPwd) => {
    try {
        if (!emailAdd || !userPwd) {
            throw new Error('Email or password cannot be empty');
        }

        const [users] = await pool.query(`
            SELECT userID, firstName, lastName, userAge, emailAdd, userPwd, userRoll FROM bpthgztafnrghzzqjk7c.Users
            WHERE emailAdd = ?`, [emailAdd]);
        const user = users[0];

        if (!user) {
            throw new Error('User not found');
        }

        const match = await compare(userPwd, user.userPwd);

        if (!match) {
            throw new Error('Incorrect password');
        }

        const token = createToken({ emailAdd, userPwd });
        return { token, user };
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

export { addUsers, getUsers, getOneUser, updateUser, deleteUser, signIn };
