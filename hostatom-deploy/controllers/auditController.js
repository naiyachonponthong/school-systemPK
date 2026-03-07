const { Op } = require('sequelize');
const { AuditLog, User } = require('../models');

exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, userId, action, entityType, startDate, endDate, search } = req.query;
    const limit = 20;
    const offset = (parseInt(page) - 1) * limit;

    const where = {};
    if (userId) where.user_id = userId;
    if (action) where.action = action;
    if (entityType) where.entity_type = entityType;
    if (startDate && endDate) {
      where.created_at = { [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59')] };
    }
    if (search) {
      where.description = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'name_en', 'username', 'role'] }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      status: 'success',
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserAuditLogs = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const offset = (parseInt(page) - 1) * limit;

    const { count, rows } = await AuditLog.findAndCountAll({
      where: { user_id: req.params.userId },
      include: [{ model: User, attributes: ['id', 'name', 'name_en', 'username', 'role'] }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      status: 'success',
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAuditStats = async (req, res) => {
  try {
    const totalLogs = await AuditLog.count();
    const createCount = await AuditLog.count({ where: { action: 'create' } });
    const updateCount = await AuditLog.count({ where: { action: 'update' } });
    const deleteCount = await AuditLog.count({ where: { action: 'delete' } });
    const loginCount = await AuditLog.count({ where: { action: 'login' } });

    res.json({
      status: 'success',
      data: { totalLogs, createCount, updateCount, deleteCount, loginCount }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
