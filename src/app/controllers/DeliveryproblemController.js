import * as Yup from 'yup';
import { Op } from 'sequelize';
import DeliveryProblem from '../models/Deliveryproblem';
import Order from '../models/Order';

async function hasPermission(deliveryManID, delivery_id) {
  const order = await Order.findByPk(delivery_id);
  console.log('asassa');
  console.log(order.deliveryman_id);
  console.log(deliveryManID);
  return order.deliveryman_id == deliveryManID;
}

async function isDataValid(req) {
  const schema = Yup.object().shape({
    description: Yup.string().required(),
    delivery_id: Yup.number(),
  });
  return schema.isValid(req.body);
}

const DeliveryproblemController = {
  async store(req, res) {
    const { id } = req.params;
    const { delivery_id, description } = req.body;
    console.log(delivery_id);
    console.log(description);
    if (!(await hasPermission(id, delivery_id)))
      return res
        .status(401)
        .json({ error: 'This order is not assigned to you' });
    if (!(await isDataValid(req)))
      return res.status(400).json({ error: 'Validation fails' });
    console.log('here');
    const problem = await DeliveryProblem.create({ delivery_id, description });
    return res.status(200).json({ problem });
  },
  async index(req, res) {
    const orders = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.id,
      },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product', 'start_date', 'created_at'],
        },
      ],
    });
    return res.status(200).json(orders);
  },
};

export default DeliveryproblemController;
