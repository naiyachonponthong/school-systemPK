const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MediaUsage = sequelize.define('MediaUsage', {
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
  tableName: 'media_usages',
  timestamps: true,
  underscored: true
});

module.exports = MediaUsage;
