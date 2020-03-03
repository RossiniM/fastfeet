import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class TrackingController {
  async deliveredOrders(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (deliveryman == null)
      return res.status(401).json({ error: 'Deliveryman not found.' });
    const orders = await Order.findAll({
      where: {
        deliveryman_id: deliveryman.id,
        end_date: {
          [Op.ne]: null,
        },
      },
    });
    return res.status(200).json({ orders });
  }

  async assignedOrder(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (deliveryman == null)
      return res.status(401).json({ error: 'Deliveryman not found.' });
    const orders = await Order.findAll({
      where: {
        deliveryman_id: deliveryman.id,
        end_date: null,
        canceled_at: null,
      },
    });
    return res.status(200).json({ orders });
  }
}
export default new TrackingController();
