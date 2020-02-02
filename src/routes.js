import { Router } from 'express';
import userController from './app/controllers/UserController';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ health: 'ok' });
});

routes.post('/user', async (req, res) => {
  const user = await userController.store(req.body);
  return res.status(200).json(user);
});

export default routes;
