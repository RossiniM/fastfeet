import User from '../models/User';

class UserController {
  async store(req, res) {
    const { name, email, password } = req.body;
    const { id, updateAt, createdAt } = await User.create({
      name,
      email,
      password,
    });

    return res.status(200).json({
      id,
      name,
      email,
      updateAt,
      createdAt,
    });
  }
}

export default new UserController();
