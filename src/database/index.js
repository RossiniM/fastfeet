import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Deliveryman from '../app/models/Deliveryman';
import Order from '../app/models/Order';
import File from '../app/models/File';
<<<<<<< HEAD
import Deliveryproblem from '../app/models/Deliveryproblem';

const models = [User, Recipient, Deliveryman, Order, File, Deliveryproblem];
=======

const models = [User, Recipient, Deliveryman, Order, File];
>>>>>>> d744b6a9c642fd6602d65d2c7d6070a578bbe46f

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
