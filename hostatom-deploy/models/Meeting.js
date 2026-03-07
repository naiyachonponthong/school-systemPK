const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  title_en: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  meeting_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  end_time: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  location_lat: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  location_lng: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  location_radius: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  require_location: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  require_qr: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allow_late_checkin: {
    type: DataTypes.INTEGER,
    defaultValue: 15
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  select_all_users: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  academic_year: {
    type: DataTypes.STRING(10),
    defaultValue: ''
  },
  created_by: {
    type: DataTypes.CHAR(36),
    allowNull: true
  }
}, {
  tableName: 'meetings',
  timestamps: true,
  underscored: true
});

module.exports = Meeting;
