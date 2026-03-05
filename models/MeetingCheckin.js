const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingCheckin = sequelize.define('MeetingCheckin', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  meeting_id: {
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
  checkin_lat: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  checkin_lng: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  checkout_lat: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  checkout_lng: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  device_info: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'meeting_checkins',
  timestamps: true,
  underscored: true
});

module.exports = MeetingCheckin;
