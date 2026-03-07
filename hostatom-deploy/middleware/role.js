const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'กรุณาเข้าสู่ระบบ' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'ไม่มีสิทธิ์เข้าถึง' });
    }
    next();
  };
};

module.exports = authorize;
