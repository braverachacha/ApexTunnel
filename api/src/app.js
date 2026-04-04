import express from 'express';
import cors from 'cors';

// Routes import

import { authRouter } from './routes/auth.js';

// app instance
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Route registration

app.use('/auth', authRouter);

export { app };