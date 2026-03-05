const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PersonalInfo = sequelize.define('PersonalInfo', {
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
    allowNull: true,
    comment: 'Stores all personal info fields as JSON'
  }
}, {
  tableName: 'personal_info',
  timestamps: true,
  underscored: true
});

module.exports = PersonalInfo;
