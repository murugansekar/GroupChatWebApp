const Sequelize = require('sequelize');
const db = require('../util/database');
const Message = db.define('message', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Message;