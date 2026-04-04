import { Router } from 'express';
import { tunnelConnected, tunnelDisconnected } from '../controllers/internal.js';

const internalRouter = Router();

internalRouter.post('/tunnel/connected', tunnelConnected);
internalRouter.post('/tunnel/disconnected', tunnelDisconnected);

export { internalRouter };