import { Router } from 'express';
import userController from './app/controllers/UserController';
import RecipientsController from './app/controllers/RecipientsController';
import userSession from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ health: 'ok' });
});

routes.post('/session', userSession.store);

routes.post('/user', authMiddleware, userController.store);

routes.post('/recipient', authMiddleware, RecipientsController.store);

export default routes;
