import { Router } from 'express';

// Routes import
import { registerUser, verifyEmail, loginUser } from '../controllers/auth.js';

const authRouter = Router();

// Routes maping
authRouter.post('/register', registerUser);
authRouter.post('/verify', verifyEmail);
authRouter.post('/login', loginUser);

export { authRouter };