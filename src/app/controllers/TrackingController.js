import { Op } from 'sequelize';
import {
  startOfHour,
  parseISO,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
  format,
  subHougetrs,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import fileController from './FileController';

const isAllowedTime = (openHours, closedHours) => {
  console.log('open', openHours, 'closed', closedHours);
  console.log(new Date());
  return isAfter(new Date(), openHours) && isBefore(new Date(), closedHours);
};

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

  async update(req, res) {
    const { deliveryman_id, order_id } = req.query;

    if (req.file) {
      try {
        const { fileId } = await fileController.store(req, res);
        const order = await Order.update(
          {
            end_date: new Date(),
            signature_id: fileId,
          },
          {
            where: {
              id: order_id,
            },
          }
        );
        return res.status(200).json({ order });
      } catch (error) {
        console.log(error);
      }
    }
    const openHours = setHours(setMinutes(setSeconds(new Date(), 0), 0), 0);
    const closedHours = setHours(setMinutes(setSeconds(new Date(), 0), 0), 18);

    if (!isAllowedTime(openHours, closedHours))
      return res
        .status(400)
        .json({ error: 'It is not alllowed to retrieve order at this time' });

    const numberRetrieve = await Order.findAndCountAll({
      where: {
        deliveryman_id,
        end_date: {
          [Op.between]: [openHours, closedHours],
        },
      },
    });
    if (numberRetrieve > 5)
      return res.status(400).json({
        error: 'It is not alllowed to retrieve more than 5 orders at day',
      });
    const order = await Order.update(
      {
        start_date: new Date(),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    return res.status(200).json({ order });
  }
}

export default new TrackingController();
