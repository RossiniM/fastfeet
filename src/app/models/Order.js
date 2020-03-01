import Sequelize, { Model } from 'sequelize';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  recipient_id: Yup.number().required(),
  deliveryman_id: Yup.number().required(),
  signature_id: Yup.number(),
  product: Yup.string().required(),
  start_date: Yup.date(),
  end_date: Yup.date(),
});

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'delivery',
    });
  }

  static isValid(order) {
    return schema.isValid(order).catch(error => console.log('error'));
  }
}

export default Order;
