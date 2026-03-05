const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkHistory = sequelize.define('WorkHistory', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  academic_year: {
    type: DataTypes.STRING(10),
    defaultValue: ''
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'work_history',
  timestamps: true,
  underscored: true
});

module.exports = WorkHistory;
