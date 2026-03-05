const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DutySchedule = sequelize.define('DutySchedule', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  period: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '1=morning, 2=evening'
  },
  location_id: {
    type: DataTypes.CHAR(36),
    allowNull: true
  },
  location_data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Cached location info {id, name}'
  },
  assigned_users: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of assigned user objects'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'duty_schedules',
  timestamps: true,
  underscored: true
});

module.exports = DutySchedule;
