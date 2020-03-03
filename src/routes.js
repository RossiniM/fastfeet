import { Router } from 'express';
import userController from './app/controllers/UserController';
import recipientsController from './app/controllers/RecipientsController';
import deliveryManController from './app/controllers/DeliverymanController';
import orderController from './app/controllers/OrderController';
import trackingController from './app/controllers/TrackingController';

import userSession from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ health: 'ok' });
});

routes.post('/session', userSession.store);

routes.post('/user', authMiddleware, userController.store);

routes.post('/recipient', authMiddleware, recipientsController.store);

routes.get('/deliveryman', authMiddleware, deliveryManController.index);
routes.post('/deliveryman', authMiddleware, deliveryManController.store);
routes.get('/deliveryman/:id/delivered', trackingController.deliveredOrders);
routes.get('/deliveryman/:id/assigned', trackingController.assignedOrder);

routes.put('/deliveryman/:id', authMiddleware, deliveryManController.update);
routes.delete('/deliveryman/:id', authMiddleware, deliveryManController.delete);

routes.get('/order', authMiddleware, orderController.index);
routes.post('/order', authMiddleware, orderController.store);
routes.put('/order/:id', authMiddleware, orderController.update);
routes.delete('/order/:id', authMiddleware, orderController.delete);

export default routes;
