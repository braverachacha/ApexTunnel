import express from 'express';
import cors from 'cors';

// app instance
const app = express();

// middleware
app.use(express.json());
app.use(cors());

export { app };