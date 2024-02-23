import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import UsersRouter from './routes/UsersRouter.js';
import ItemsRouter from './routes/ItemsRouter.js'; 
import cookieParser from 'cookie-parser';

config();

const port = process.env.PORT || 4500;
const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('./views'));
app.use('/Users', UsersRouter);
app.use('/Items', ItemsRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
