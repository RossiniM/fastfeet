import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'validation failed' });

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ error: 'User not found' });

    if (!(await user.checkPassword(password)))
      return res.json.status(401).json({ error: 'Password does not match' });

    const { id, name } = user;
    const token = jwt.sign({ id, name }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res
      .cookie('token', token, {
        expires: new Date(Date.now() + 600000),
        secure: false,
        httpOnly: true,
      })
      .json({
        user: {
          id,
          name,
          email,
        },
        token,
      });
  }
}

export default new SessionController();
