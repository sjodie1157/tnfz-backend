import express from 'express';
import controller from '../controller/Items.js';

const ItemsRouter = express.Router();

ItemsRouter.get('/', controller.getItems);
ItemsRouter.get('/:id', controller.getSingleItem);
ItemsRouter.get('/addItems', controller.addItem);

export default ItemsRouter;