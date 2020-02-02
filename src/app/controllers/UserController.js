import User from '../models/User';

class UserController {
  async store(user) {
    const { name, email, password } = user;
    const { id, updateAt, createdAt } = await User.create({
      name,
      email,
      password,
    });

    return {
      id,
      name,
      email,
      updateAt,
      createdAt,
    };
  }
}

export default new UserController();
