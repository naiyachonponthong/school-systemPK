const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'กรุณาเข้าสู่ระบบ' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.active) {
      return res.status(401).json({ status: 'error', message: 'บัญชีถูกระงับหรือไม่พบผู้ใช้' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'error', message: 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
    }
    return res.status(401).json({ status: 'error', message: 'Token ไม่ถูกต้อง' });
  }
};

module.exports = auth;
