import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import fileController from './FileController';

async function isDataValid(data) {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
  });
  return schema.isValid(data);
}
async function deliveryManExists(email) {
  const currentDeliveryMan = await Deliveryman.findOne({
    where: {
      email,
    },
  });
  return currentDeliveryMan;
}

class DeliveryManController {
  async store(req, res) {
    if (req.file) {
      const { name, email } = req.query;

      if (!(await isDataValid({ name, email })))
        return res.status(400).json({ error: 'Validation fails' });

      if (await deliveryManExists(email))
        return res.status(400).json({ error: 'Email already used' });
      const { id } = await fileController.store(req, res);
      const deliveryMan = await Deliveryman.create({
        name,
        email,
        avatar_id: id,
      });
      return res.status(200).json(deliveryMan);
    }
    return req.status(400).json({ error: 'An image is required' });
  }

  async index(req, res) {
    const couriers = await Deliveryman.findAll({});
    return res.status(200).json(couriers);
  }

  async update(req, res) {
    if (!(await isDataValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const courier = await Deliveryman.findByPk(req.params.id);
    if (!courier)
      return res.status(400).json({ error: 'DeliveryMan does not exists' });
    const updatedDerliveryMan = await courier.update(req.body);
    return res.status(200).json(updatedDerliveryMan);
  }

  async delete(req, res) {
    const courier = Deliveryman.findByPk(req.params.id);
    let rows_deleted = {};
    if (courier) {
      rows_deleted = await Deliveryman.destroy({
        where: { id: req.params.id },
      });
    }
    return res.status(200).json(rows_deleted);
  }
}

export default new DeliveryManController();
