const Sequelize = require('sequelize');
const db = require('../util/database');
const Group = db.define('group', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  gname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBY: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
module.exports = Group;