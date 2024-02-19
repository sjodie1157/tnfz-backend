import { getUsers, addUsers, getOneUser, updateUser, deleteUser, signIn } from "../models/Users.js";

export default {
    getUsers: async (req, res) => {
        try {
            const users = await getUsers();
            res.send(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getOneUser: async (req, res) => {
        try {
            const user = await getOneUser(+req.params.id);
            res.send(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    addUsers: async (req, res) => {
        const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;
        try {
            const newUser = await addUsers(firstName, lastName, userAge, emailAdd, userPwd, userRoll);
            res.send(newUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const [existingUser] = await getOneUser(+req.params.id);

            const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;

            const updatedfirstName = firstName !== undefined ? firstName : existingUser.firstName;
            const updatedlastName = lastName !== undefined ? lastName : existingUser.lastName;
            const updateduserAge = userAge !== undefined ? userAge : existingUser.userAge;
            const updatedemailAdd = emailAdd !== undefined ? emailAdd : existingUser.emailAdd;
            const updateduserPwd = userPwd !== undefined ? userPwd : existingUser.userPwd;
            const updateduserRoll = userRoll !== undefined ? userRoll : existingUser.userRoll;

            await updateUser(req.params.id, updatedfirstName, updatedlastName, updateduserAge, updatedemailAdd, updateduserPwd, updateduserRoll);

            const users = await getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await deleteUser(req.params.id);
            res.send(deletedUser);
        } catch (error) {
            res.json({
                status: statusCode,
                msg: error.message
            });
        }
    },
    signIn: async (req, res) => {
        const { emailAdd, userPwd } = req.body;
        try {
            const { token, user } = await signIn(emailAdd, userPwd);
            res.json({ token, user });
        } catch (error) {
            res.json({
                msg: error.message
            });
        }
    }
};
