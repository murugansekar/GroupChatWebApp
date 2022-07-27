const Sequelize = require('sequelize');
const db = require('../util/database');
const UserGroup = db.define('userGroup', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  isAdmin: {
    type: Sequelize.BOOLEAN
  }
});
module.exports = UserGroup;