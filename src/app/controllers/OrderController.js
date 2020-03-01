import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({});
    return res.status(200).json({ orders });
  }

  async store(req, res) {
    if (!(await Order.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });
    const { recipient_id, deliveryman_id } = req.body;
    if (!(await validateDeliveryAndRecipient(recipient_id, deliveryman_id))) {
      return res
        .status(400)
        .json({ error: 'Deliveryman or Recipient not found' });
    }
    const order = await Order.create(req.body);
    return res.status(200).json(order);
  }

  async delete(req, res) {
    const { id } = req.params;
    const order = Order.findByPk(id);
    if (order) {
      await Order.destroy({ where: { id } });
      res.status(200).json(order);
    }
    return res.status(404).json({ error: 'Order  not found' });
  }

  async update(req, res) {
    return res.status(200).json({});
  }
}

export default new OrderController();

async function validateDeliveryAndRecipient(recipient_id, deliveryman_id) {
  const recipient = await Recipient.findByPk(recipient_id);
  const deliveryman = await Deliveryman.findByPk(deliveryman_id);
  return recipient != null && deliveryman != null;
}
