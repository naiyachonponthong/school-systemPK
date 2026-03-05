const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DutyLocation = sequelize.define('DutyLocation', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  period: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
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
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'duty_locations',
  timestamps: true,
  underscored: true
});

module.exports = DutyLocation;
