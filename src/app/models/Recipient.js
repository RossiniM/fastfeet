import Sequelize, { Model } from 'sequelize';
import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  street: Yup.string().required(),
  number: Yup.number().required(),
  additional_info: Yup.string(),
  state: Yup.string().required(),
  zipcode: Yup.string().required(),
});

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        additional_info: Sequelize.STRING,
        state: Sequelize.STRING,
        zipcode: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static isValid(recipient) {
    return schema.isValid(recipient).catch(error => console.log('error'));
  }
}

export default Recipient;
