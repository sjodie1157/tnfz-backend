import { getUsers, addUsers, getOneUser, updateUser, deleteUser } from "../models/Users.js";

export default {
    getUsers: async (req, res) => {
        res.send(await getUsers());
    },
    getOneUser: async (req, res) => {
        res.send(await getOneUser(+req.params.id));
    },
    addUsers: async (req, res) => {
        const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;
        const newUser = await addUsers(firstName, lastName, userAge, emailAdd, userPwd, userRoll);
        res.send(newUser);
    },
    updateUser: async (req, res) => {
        const [existingUser] = await getOneUser(+req.params.id);


        const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;

        const updatedfirstName = firstName !== undefined ? firstName : existingUser.firstName;
        const updatedlastName = lastName !== undefined ? lastName : existingUser.lastName;
        const updateduserAge = userAge !== undefined ? userAge : existingUser.userAge;
        const updatedemailAdd = emailAdd !== undefined ? emailAdd : existingUser.emailAdd;
        const updateduserPwd = userPwd !== undefined ? userPwd : existingUser.userPwd;
        const updateduserRoll = userRoll !== undefined ? userRoll : existingUser.userRoll;

        await updateUser(req.params.id, updatedfirstName, updatedlastName, updateduserAge, updatedemailAdd, updateduserPwd, updateduserRoll);

        res.json(await getUsers());
    },
    deleteUser: async (req, res) => {
        res.send(await deleteUser(req.params.id));
    }
};