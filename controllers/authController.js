const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, PersonalInfo } = require('../models');
const config = require('../config/config');
const { logAudit } = require('../utils/auditLogger');

exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // Role check
    if (role === 'admin') {
      if (!['admin', 'executive', 'staff'].includes(user.role)) {
        return res.status(403).json({ status: 'error', message: 'ไม่มีสิทธิ์เข้าใช้งานส่วนนี้' });
      }
    } else if (role === 'user') {
      if (user.role !== 'user') {
        return res.status(403).json({ status: 'error', message: 'กรุณาเข้าสู่ระบบในส่วนของผู้ดูแลระบบ' });
      }
    }

    if (!user.active) {
      return res.status(403).json({ status: 'error', message: 'บัญชีถูกระงับการใช้งาน' });
    }

    // Update last_login
    user.last_login = new Date();
    await user.save();

    // Get latest photo from PersonalInfo
    const latestPersonal = await PersonalInfo.findOne({
      where: { user_id: user.id },
      order: [['academic_year', 'DESC']]
    });
    let profileImage = user.profile_image;
    if (latestPersonal && latestPersonal.data && latestPersonal.data.photo_url) {
      profileImage = latestPersonal.data.photo_url;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    await logAudit(user.id, 'login', 'Users', null, user.name + ' เข้าสู่ระบบ');

    res.json({
      status: 'success',
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        name_en: user.name_en,
        role: user.role,
        email: user.email,
        phone: user.phone,
        position: user.position,
        grade_level: user.grade_level,
        profile_image: profileImage,
        sessionToken: token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, name, name_en, email, phone, position, grade_level } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      id: uuidv4(),
      username,
      password: hashedPassword,
      role: 'user',
      name: name || '',
      name_en: name_en || '',
      email: email || '',
      phone: phone || '',
      position: position || '',
      grade_level: grade_level || '',
      active: true
    });

    await logAudit(newUser.id, 'create', 'Users', null, 'สมัครสมาชิกใหม่ ' + newUser.name);

    res.json({ status: 'success', message: 'สมัครสมาชิกสำเร็จ' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await logAudit(req.user.id, 'logout', 'Users', null, 'ออกจากระบบ');
    }
    res.json({ status: 'success', message: 'ออกจากระบบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.validateSession = async (req, res) => {
  try {
    // If auth middleware passed, session is valid
    const user = req.user;
    res.json({
      valid: true,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        name_en: user.name_en,
        role: user.role,
        email: user.email,
        phone: user.phone,
        position: user.position,
        grade_level: user.grade_level,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    res.json({ valid: false });
  }
};
