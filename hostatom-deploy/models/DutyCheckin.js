const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DutyCheckin = sequelize.define('DutyCheckin', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  schedule_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  checkin_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checkout_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  checkin_method: {
    type: DataTypes.STRING(20),
    defaultValue: 'manual'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('checked_in', 'checked_out'),
    defaultValue: 'checked_in'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'duty_checkins',
  timestamps: true,
  underscored: true
});

module.exports = DutyCheckin;
