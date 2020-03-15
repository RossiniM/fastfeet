import { Router } from 'express';
import multer from 'multer';

import userController from './app/controllers/UserController';
import recipientsController from './app/controllers/RecipientsController';
import deliveryManController from './app/controllers/DeliverymanController';
import deliveryProblemController from './app/controllers/DeliveryproblemController';
import orderController from './app/controllers/OrderController';
import trackingController from './app/controllers/TrackingController';
<<<<<<< HEAD
=======
import fileController from './app/controllers/FileController';
>>>>>>> d744b6a9c642fd6602d65d2c7d6070a578bbe46f
import multerConfig from './config/multer';

import userSession from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  return res.status(200).json({ health: 'ok' });
});

routes.post('/session', userSession.store);

<<<<<<< HEAD
=======
routes.post('/user', authMiddleware, userController.store);

routes.post('/recipient', authMiddleware, recipientsController.store);

routes.post('/files', upload.single('file'), fileController.store);

routes.get('/deliveryman', authMiddleware, deliveryManController.index);
routes.post('/deliveryman', authMiddleware, deliveryManController.store);
>>>>>>> d744b6a9c642fd6602d65d2c7d6070a578bbe46f
routes.get('/deliveryman/:id/delivered', trackingController.deliveredOrders);
routes.get('/deliveryman/:id/assigned', trackingController.assignedOrder);

routes.put('/files/order', upload.single('file'), trackingController.update);

routes.post(
  '/delivery/deliveryman/:id/problems',
  deliveryProblemController.store
);
routes.get('/delivery/:id/problems', deliveryProblemController.index);

routes.use(authMiddleware);

routes.post('/user', userController.store);
routes.post('/recipient', recipientsController.store);
routes.get('/deliveryman', deliveryManController.index);
// eslint-disable-next-line prettier/prettier
routes.post('/files/deliveryman', upload.single('file'), deliveryManController.store);
routes.put('/deliveryman/:id', deliveryManController.update);
routes.delete('/deliveryman/:id', deliveryManController.delete);

routes.get('/order', orderController.index);
routes.post('/order', orderController.store);
routes.put('/cancel/order/:id', orderController.cancel);

routes.delete('/order/:id', authMiddleware, orderController.delete);

export default routes;
