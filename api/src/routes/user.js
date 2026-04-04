import { Router } from 'express';

import { userControler, regenerateToken } from '../controllers/user.js';

const userRouter = Router();

userRouter.get('/me', userControler);
userRouter.post('/token/regenerate', regenerateToken);

export { userRouter };