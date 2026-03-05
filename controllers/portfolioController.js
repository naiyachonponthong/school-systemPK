const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { portfolioModelMap } = require('../models');
const { logAudit } = require('../utils/auditLogger');
const config = require('../config/config');

// Map type names from frontend (e.g. "Education") to section keys (e.g. "education")
const typeToSectionMap = {
  'PersonalInfo': 'personal-info',
  'Education': 'education',
  'ScoutQualification': 'scout-qualification',
  'WorkHistory': 'work-history',
  'Awards': 'awards',
  'PositionDuty': 'position-duty',
  'TeachingSummary': 'teaching-summary',
  'ProjectActivity': 'project-activity',
  'StudentActivity': 'student-activity',
  'MediaProduction': 'media-production',
  'MediaUsage': 'media-usage',
  'FieldTrip': 'field-trip',
  'Competition': 'competition'
};

function getModel(section) {
  const model = portfolioModelMap[section];
  if (!model) return null;
  return model;
}

function getModelByType(type) {
  const section = typeToSectionMap[type];
  if (!section) return null;
  return portfolioModelMap[section];
}

exports.getAll = async (req, res) => {
  try {
    const Model = getModel(req.params.section);
    if (!Model) {
      return res.status(400).json({ status: 'error', message: 'ส่วนข้อมูลไม่ถูกต้อง' });
    }

    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const userId = req.query.userId || req.user.id;
    const academicYear = req.query.academicYear || '';
    const limit = config.ITEMS_PER_PAGE;
    const offset = (page - 1) * limit;

    const where = { user_id: userId };
    if (academicYear) {
      where.academic_year = academicYear;
    }

    const { count, rows } = await Model.findAndCountAll({
      where,
      order: [['academic_year', 'DESC'], ['created_at', 'DESC']],
      limit,
      offset
    });

    // Flatten data: merge the JSON `data` field into the top-level object
    const flattenedRows = rows.map(row => {
      const json = row.toJSON();
      const dataFields = json.data || {};
      delete json.data;
      return { ...json, ...dataFields };
    });

    res.json({
      status: 'success',
      data: flattenedRows,
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

exports.getById = async (req, res) => {
  try {
    const Model = getModel(req.params.section);
    if (!Model) {
      return res.status(400).json({ status: 'error', message: 'ส่วนข้อมูลไม่ถูกต้อง' });
    }

    const record = await Model.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบข้อมูล' });
    }

    const json = record.toJSON();
    const dataFields = json.data || {};
    delete json.data;
    const flattened = { ...json, ...dataFields };

    res.json({ status: 'success', data: flattened });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ตรวจสอบว่ามีข้อมูลในปีที่ระบุแล้วหรือไม่
exports.checkYearData = async (req, res) => {
  try {
    const { userId, type, year } = req.query;
    const Model = getModelByType(type);
    if (!Model) {
      return res.json({ exists: false });
    }

    const record = await Model.findOne({
      where: { user_id: userId || req.user.id, academic_year: year || '' }
    });

    if (record) {
      const json = record.toJSON();
      const dataFields = json.data || {};
      delete json.data;
      const flattened = { ...json, ...dataFields };
      res.json({ exists: true, data: flattened });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
};

// ดึงข้อมูลปีล่าสุด (สำหรับคัดลอก)
exports.latestYearData = async (req, res) => {
  try {
    const { userId, type } = req.query;
    const Model = getModelByType(type);
    if (!Model) {
      return res.json({ status: 'error', message: 'Invalid type' });
    }

    const record = await Model.findOne({
      where: { user_id: userId || req.user.id },
      order: [['academic_year', 'DESC'], ['created_at', 'DESC']]
    });

    if (record) {
      const json = record.toJSON();
      const dataFields = json.data || {};
      delete json.data;
      const flattened = { ...json, ...dataFields };
      res.json({ status: 'success', data: flattened, year: record.academic_year });
    } else {
      res.json({ status: 'error', message: 'No data found' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const Model = getModel(req.params.section);
    if (!Model) {
      return res.status(400).json({ status: 'error', message: 'ส่วนข้อมูลไม่ถูกต้อง' });
    }

    const body = req.body;
    const id = uuidv4();
    const userId = body.user_id || req.user.id;
    const academicYear = body.academic_year || '';

    // Separate core fields from section-specific data
    const { id: _id, user_id, academic_year, created_at, updated_at, ...sectionData } = body;

    const record = await Model.create({
      id,
      user_id: userId,
      academic_year: academicYear,
      data: sectionData
    });

    const result = record.toJSON();
    const dataFields = result.data || {};
    delete result.data;
    const flattened = { ...result, ...dataFields };

    await logAudit(req.user.id, 'create', req.params.section, id,
      'เพิ่มข้อมูล ' + req.params.section, null, flattened);

    res.json({ status: 'success', message: 'บันทึกข้อมูลสำเร็จ', data: flattened });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const Model = getModel(req.params.section);
    if (!Model) {
      return res.status(400).json({ status: 'error', message: 'ส่วนข้อมูลไม่ถูกต้อง' });
    }

    const record = await Model.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบข้อมูล' });
    }

    const oldJson = record.toJSON();
    const body = req.body;

    if (body.academic_year !== undefined) {
      record.academic_year = body.academic_year;
    }
    if (body.user_id !== undefined) {
      record.user_id = body.user_id;
    }

    // Update section-specific data
    const { id, user_id, academic_year, created_at, updated_at, ...sectionData } = body;
    record.data = sectionData;
    record.changed('data', true);
    await record.save();

    const result = record.toJSON();
    const dataFields = result.data || {};
    delete result.data;
    const flattened = { ...result, ...dataFields };

    await logAudit(req.user.id, 'update', req.params.section, req.params.id,
      'แก้ไขข้อมูล ' + req.params.section, oldJson, flattened);

    res.json({ status: 'success', message: 'อัพเดทข้อมูลสำเร็จ', data: flattened });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const Model = getModel(req.params.section);
    if (!Model) {
      return res.status(400).json({ status: 'error', message: 'ส่วนข้อมูลไม่ถูกต้อง' });
    }

    const record = await Model.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบข้อมูล' });
    }

    await logAudit(req.user.id, 'delete', req.params.section, req.params.id,
      'ลบข้อมูล ' + req.params.section, record.toJSON(), null);

    await record.destroy();

    res.json({ status: 'success', message: 'ลบข้อมูลสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
