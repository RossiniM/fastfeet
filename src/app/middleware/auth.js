import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const token = req.cookies.token || '';
  if (!token) return res.status(401).json({ error: 'Token not provided' });

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.id = decoded.id;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'token is not valid' });
  }
};
