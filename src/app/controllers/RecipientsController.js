import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    if (!(await Recipient.isValid(req.body)))
      return res.status(400).json({ error: 'validation failed' });

    const {
      name,
      email,
      street,
      number,
      state,
      additionalInfo,
      zipcode,
    } = req.body;

    const { id, updateAt, createdAt } = await Recipient.create({
      name,
      email,
      street,
      number,
      state,
      additionalInfo,
      zipcode,
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

export default new RecipientController();
