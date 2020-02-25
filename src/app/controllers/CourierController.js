import * as Yup from 'yup';
import Courier from '../models/Courier';

class CourierController {
  async store(req, res) {
    if (!(await isDataCreationValid(req)))
      return res.status(400).json({ error: 'Validation fails' });

    if (await courierExists(req))
      return res.status(400).json({ error: 'Email already used' });

    const courier = Courier.create(req.body);
    return res.status(200).json({ courier });
  }

  async index(req, res) {
    const couriers = await Courier.findAll({});
    return res.status(200).json(couriers);
  }

  async update(req, res) {
    if (!(await isDataCreationValid(req)))
      return res.status(400).json({ error: 'Validation fails' });

    const courier = await Courier.findByPk(req.params.id);
    if (!courier)
      return res.status(400).json({ error: 'Courier does not exists' });
    const updateCourier = await courier.update(req.body);
    return res.status(200).json(updateCourier);
  }

  async delete(req, res) {
    const courier = Courier.findByPk(req.params.id);
    let rows_deleted = {};
    if (courier) {
      rows_deleted = await Courier.destroy({
        where: { id: req.params.id },
      });
    }
    return res.status(200).json(rows_deleted);
  }
}

export default new CourierController();

async function isDataCreationValid(req) {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    avatar_id: Yup.number(),
    email: Yup.string()
      .email()
      .required(),
  });
  return schema.isValid(req.body);
}
async function courierExists(req) {
  const { name, email } = req.body;
  const courierExistent = await Courier.findOne({
    where: {
      email,
    },
  });
  return courierExistent;
}
