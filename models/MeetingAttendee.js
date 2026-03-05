const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingAttendee = sequelize.define('MeetingAttendee', {
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
  status: {
    type: DataTypes.ENUM('pending', 'checked_in', 'checked_out', 'absent'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'meeting_attendees',
  timestamps: true,
  underscored: true
});

module.exports = MeetingAttendee;
