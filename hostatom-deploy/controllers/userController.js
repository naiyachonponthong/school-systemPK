const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { User } = require('../models');
const { logAudit } = require('../utils/auditLogger');
const config = require('../config/config');

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const limit = config.ITEMS_PER_PAGE;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      status: 'success',
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    }
    res.json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, name, name_en, email, phone, role, position, grade_level, active } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      id: uuidv4(),
      username,
      password: hashedPassword,
      name: name || '',
      name_en: name_en || '',
      email: email || '',
      phone: phone || '',
      role: role || 'user',
      position: position || '',
      grade_level: grade_level || '',
      active: active !== false
    });

    await logAudit(req.user.id, 'create', 'Users', newUser.id, 'สร้างผู้ใช้ใหม่ ' + newUser.name, null, newUser.toJSON());

    res.json({ status: 'success', message: 'สร้างผู้ใช้สำเร็จ', data: { id: newUser.id } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    }

    const oldData = user.toJSON();
    const { name, name_en, email, phone, role, position, grade_level, active, password } = req.body;

    if (name !== undefined) user.name = name;
    if (name_en !== undefined) user.name_en = name_en;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (position !== undefined) user.position = position;
    if (grade_level !== undefined) user.grade_level = grade_level;
    if (active !== undefined) user.active = active;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    await logAudit(req.user.id, 'update', 'Users', user.id, 'อัพเดทผู้ใช้ ' + user.name, oldData, user.toJSON());

    res.json({ status: 'success', message: 'อัพเดทข้อมูลสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    }

    await logAudit(req.user.id, 'delete', 'Users', user.id, 'ลบผู้ใช้ ' + user.name, user.toJSON(), null);
    await user.destroy();

    res.json({ status: 'success', message: 'ลบผู้ใช้สำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    }

    user.profile_image = req.body.profile_image || '';
    await user.save();

    res.json({ status: 'success', message: 'อัพเดทรูปโปรไฟล์สำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await logAudit(req.user.id, 'update', 'Users', user.id, 'เปลี่ยนรหัสผ่าน ' + user.name);

    res.json({ status: 'success', message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getLatestPhoto = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['profile_image'] });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    }
    res.json(user.profile_image || '');
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
