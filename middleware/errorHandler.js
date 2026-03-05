const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.errors.map(e => e.message).join(', ')
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      status: 'error',
      message: 'ข้อมูลซ้ำ กรุณาตรวจสอบ'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)'
    });
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'เกิดข้อผิดพลาดภายในระบบ'
  });
};

module.exports = { errorHandler };
