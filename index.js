import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import UsersRouter from './routes/';

config();

const port = process.env.PORT || 4500;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('./views'));
app.use('/Users', UsersRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
