import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliveryManController {
  async store(req, res) {
    if (!(await isDataValid(req)))
      return res.status(400).json({ error: 'Validation fails' });

    if (await deliveryManExists(req))
      return res.status(400).json({ error: 'Email already used' });

    const courier = Deliveryman.create(req.body);
    return res.status(200).json({ courier });
  }

  async index(req, res) {
    const couriers = await Deliveryman.findAll({});
    return res.status(200).json(couriers);
  }

  async update(req, res) {
    if (!(await isDataValid(req)))
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

async function isDataValid(req) {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    avatar_id: Yup.number(),
    email: Yup.string()
      .email()
      .required(),
  });
  return schema.isValid(req.body);
}
async function deliveryManExists(req) {
  const { email } = req.body;
  const currentDeliveryMan = await Deliveryman.findOne({
    where: {
      email,
    },
  });
  return currentDeliveryMan;
}
