require('dotenv').config();

module.exports = {
  APP_NAME: 'ระบบจัดการบุคลากร',
  APP_NAME_EN: 'Personnel Management System',
  VERSION: '1.0.0',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
  ITEMS_PER_PAGE: 20,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
  DEFAULT_ADMIN: {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'ผู้ดูแลระบบ',
    name_en: 'Administrator'
  },
  DEFAULT_STAFF: {
    username: 'staff',
    password: 'staff123',
    role: 'staff',
    name: 'เจ้าหน้าที่',
    name_en: 'Staff'
  }
};
