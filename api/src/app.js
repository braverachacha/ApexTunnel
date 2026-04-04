import express from 'express';
import cors from 'cors';

import { authRouter } from './routes/auth.js';

// app instance
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Router mapping

app.use('/auth', authRouter);

export { app };