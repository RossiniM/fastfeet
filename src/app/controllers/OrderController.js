import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';
import CancellationMail from '../jobs/CancellationMail';

async function getDeliveryAndRecipient(recipient_id, deliveryman_id) {
  const recipient = await Recipient.findByPk(recipient_id);
  const deliveryman = await Deliveryman.findByPk(deliveryman_id);
  return { recipient, deliveryman };
}

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({});
    return res.status(200).json({ orders });
  }

  async store(req, res) {
    if (!(await Order.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });
    const { recipient_id, deliveryman_id } = req.body;
    const { recipient, deliveryman } = await getDeliveryAndRecipient(
      recipient_id,
      deliveryman_id
    );
    if (recipient == null || deliveryman == null) {
      return res
        .status(400)
        .json({ error: 'Deliveryman or Recipient not found' });
    }
    const order = await Order.create(req.body);
    Queue.add(RegistrationMail.key, { deliveryman, recipient, order });

    return res.status(200).json(order);
  }

  async cancel(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    const { recipient, deliveryman } = await getDeliveryAndRecipient(
      order.recipient_id,
      order.deliveryman_id
    );
    const updateOrder = await Order.update(
      { canceled_at: new Date() },
      {
        where: {
          id: order.id,
        },
      }
    );
    Queue.add(CancellationMail.key, { deliveryman, recipient, order });
    return res.status(200).json(updateOrder);
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
