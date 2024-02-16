import express from 'express';
import { verifyAToken } from '../middleware/authenticateUser.js';
import { addUser, getUsers, getOneUser, updateUser, deleteUser } from '../models/Users.js';

const router = express.Router();

router.get('/', verifyAToken, async (req, res) => {
    res.send(await getUsers());
});

router.get('/:id', verifyAToken, async (req, res) => {
    res.send(await getOneUser(+req.params.id));
});

router.post('/', verifyAToken, async (req, res) => {
    const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;
    const newUser = await addUser(firstName, lastName, userAge, emailAdd, userPwd, userRoll);
    res.send(newUser);
});

router.put('/:id', verifyAToken, async (req, res) => {
    const [existingUser] = await getOneUser(+req.params.id);
    if (!existingUser) {
        return res.status(404).send('User not found');
    }

    const { firstName, lastName, userAge, emailAdd, userPwd, userRoll } = req.body;

    const updatedfirstName = firstName !== undefined ? firstName : existingUser.firstName;
    const updatedlastName = lastName !== undefined ? lastName : existingUser.lastName;
    const updateduserAge = userAge !== undefined ? userAge : existingUser.userAge;
    const updatedemailAdd = emailAdd !== undefined ? emailAdd : existingUser.emailAdd;
    const updateduserPwd = userPwd !== undefined ? userPwd : existingUser.userPwd;
    const updateduserRoll = userRoll !== undefined ? userRoll : existingUser.userRoll;

    await updateUser(req.params.id, updatedfirstName, updatedlastName, updateduserAge, updatedemailAdd, updateduserPwd, updateduserRoll);

    res.json(await getUsers());
});

router.delete('/:id', verifyAToken, async (req, res) => {
    res.send(await deleteUser(req.params.id));
});

export default router;
