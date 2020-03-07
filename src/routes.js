import { Router } from 'express';
import multer from 'multer';

import userController from './app/controllers/UserController';
import recipientsController from './app/controllers/RecipientsController';
import deliveryManController from './app/controllers/DeliverymanController';
import orderController from './app/controllers/OrderController';
import trackingController from './app/controllers/TrackingController';
import multerConfig from './config/multer';

import userSession from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  return res.status(200).json({ health: 'ok' });
});

routes.post('/session', userSession.store);

routes.get('/deliveryman/:id/delivered', trackingController.deliveredOrders);
routes.get('/deliveryman/:id/assigned', trackingController.assignedOrder);
routes.put('/files/order', upload.single('file'), trackingController.update);

routes.use(authMiddleware);

routes.post('/user', userController.store);
routes.post('/recipient', recipientsController.store);
routes.get('/deliveryman', deliveryManController.index);
routes.post('/deliveryman', deliveryManController.store);
routes.put('/deliveryman/:id', deliveryManController.update);
routes.delete('/deliveryman/:id', deliveryManController.delete);

routes.get('/order', orderController.index);
routes.post('/order', orderController.store);

routes.delete('/order/:id', authMiddleware, orderController.delete);

export default routes;
