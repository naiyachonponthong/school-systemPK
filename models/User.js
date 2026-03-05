const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff', 'executive', 'user'),
    defaultValue: 'user'
  },
  name: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  name_en: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  phone: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  position: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  grade_level: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  profile_image: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;
