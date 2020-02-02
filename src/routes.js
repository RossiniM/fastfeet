import { Router } from 'express';
import User from './app/models/User';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello' });
});

routes.post('/user', async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  return res.status(200).json({ user });
});

export default routes;
