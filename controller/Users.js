import { getUsers, addUsers, getOneUser, updateUser, deleteUser, signIn } from "../models/Users.js";

export default {
    getUsers: async (req, res) => {
        try {
            const users = await getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    getOneUser: async (req, res) => {
        try {
            const user = await getOneUser(+req.params.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    addUsers: async (req, res) => {
        const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;
        try {
            const newUser = await addUsers(firstName, lastName, userAge, emailAdd, userPwd, userRoll);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const existingUser = await getOneUser(+req.params.id);
            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
            }

            const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;

            // Update user logic

            const updatedUser = await updateUser(req.params.id, updatedFields);
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await deleteUser(req.params.id);
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    signIn: async (req, res) => {
        const { emailAdd, userPwd } = req.body;
        try {
            const { token, user } = await signIn(emailAdd, userPwd);
            res.cookie('webtoken', token, { httpOnly: false });
            res.json({ token, user });
        } catch (error) {
            res.status(401).json({ error: "Invalid credentials" });
        }
    },
    signOut: async (req, res) => {
        try {
            res.clearCookie('webtoken');
            res.json({ message: 'Successfully signed out' });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
