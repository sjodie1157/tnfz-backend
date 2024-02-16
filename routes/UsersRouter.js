import express from 'express';
import controller from '../controller/Users.js';

const router = express.Router();

router.get('/', controller.getUsers);
router.get('/:id', controller.getOneUser);
router.post('/addUser', controller.addUser);
router.patch('/updateUser/:id', controller.updateUser);
router.delete('/removeUser/:id', controller.deleteUser);

export default router;
