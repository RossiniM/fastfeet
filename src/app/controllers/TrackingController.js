import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';

import { utcToZonedTime } from 'date-fns-tz';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import fileController from './FileController';

const isAllowedTime = (openHours, closedHours) => {
  console.log(new Date());
  console.log('open', openHours, isAfter(new Date(), openHours));
  console.log('closed', isBefore(new Date(), closedHours));
  console.log(
    'closed',
    isAfter(new Date(), openHours) && isBefore(new Date(), closedHours)
  );

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
    const timeZone = 'America/Sao_Paulo';
    const date = utcToZonedTime(new Date().getTime(), { timeZone });
    console.log('local', date);
    console.log(new Date());
    const openHours = setSeconds(setMinutes(setHours(date, '08'), '00'), 0);
    const closedHours = setHours(
      setMinutes(setSeconds(new Date().getTime(), 0), 0),
      19
    );

    if (!isAllowedTime(openHours, closedHours)) {
      return res
        .status(401)
        .json({ error: 'It is not alllowed to retrieve order at this time' });
    }
    const { count } = await Order.findAndCountAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(openHours), endOfDay(openHours)],
        },
      },
    });
    if (count > 5) {
      return res.status(400).json({
        error: 'It is not alllowed to retrieve more than five time  at day',
      });
    }
    const order = await Order.update(
      {
        start_date: new Date(),
      },
      {
        where: {
          id: order_id,
        },
      }
    );
    console.log('here');
    return res.status(200).json(order);
  }
}

export default new TrackingController();
