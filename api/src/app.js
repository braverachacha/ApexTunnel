import express from 'express';
import cors from 'cors';

// app instance
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Protected routes guard
import { authenticate } from './middleware/auth.js';

// Route import

import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/user.js';

// Router mapping

app.use('/auth', authRouter);
app.use('/user', authenticate, userRouter);

export { app };