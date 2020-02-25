import { Router } from 'express';
import userController from './app/controllers/UserController';
import recipientsController from './app/controllers/RecipientsController';
import courierController from './app/controllers/CourierController';
import userSession from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ health: 'ok' });
});

routes.post('/session', userSession.store);

routes.post('/user', authMiddleware, userController.store);

routes.post('/recipient', authMiddleware, recipientsController.store);

routes.get('/courier', authMiddleware, courierController.index);
routes.post('/courier', authMiddleware, courierController.store);
routes.put('/courier/:id', authMiddleware, courierController.update);
routes.delete('/courier/:id', authMiddleware, courierController.delete);

export default routes;
