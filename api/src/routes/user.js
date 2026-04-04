import { Router } from 'express';

import { userControler } from '../controllers/user.js';

const userRouter = Router();

userRouter.get('/me', userControler);

export { userRouter };