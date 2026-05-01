import { Router } from 'express';

// Routes import
import { registerUser, verifyOTP } from '../controllers/auth.js';

const authRouter = Router();

// Routes mapping
authRouter.post('/register', registerUser);
authRouter.post('/verify', verifyOTP);

export { authRouter };
