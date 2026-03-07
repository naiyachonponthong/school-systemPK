const { AuditLog } = require('../models');
const { generateId } = require('./helpers');

async function logAudit(userId, action, entityType, entityId, description, beforeData, afterData) {
  try {
    await AuditLog.create({
      id: generateId(),
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      description: description || '',
      before_data: beforeData ? JSON.stringify(beforeData) : null,
      after_data: afterData ? JSON.stringify(afterData) : null
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
}

module.exports = { logAudit };
