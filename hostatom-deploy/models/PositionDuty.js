const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PositionDuty = sequelize.define('PositionDuty', {
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
  tableName: 'position_duties',
  timestamps: true,
  underscored: true
});

module.exports = PositionDuty;
