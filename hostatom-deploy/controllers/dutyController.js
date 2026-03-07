const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { DutyLocation, DutySchedule, DutyCheckin, User } = require('../models');
const { logAudit } = require('../utils/auditLogger');

// ==================== LOCATIONS ====================
exports.getLocations = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const where = {};
    if (academicYear) where.academic_year = academicYear;

    const locations = await DutyLocation.findAll({ where, order: [['name', 'ASC']] });
    res.json({ status: 'success', data: locations });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await DutyLocation.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบจุดเวร' });
    }
    res.json({ status: 'success', data: location });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.saveLocation = async (req, res) => {
  try {
    const body = req.body;
    let location;

    if (body.id) {
      location = await DutyLocation.findByPk(body.id);
      if (location) {
        Object.assign(location, {
          name: body.name,
          category: body.category || '',
          period: body.period || '',
          description: body.description || '',
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          is_active: body.is_active !== false,
          academic_year: body.academic_year || ''
        });
        await location.save();
        await logAudit(req.user.id, 'update', 'DutyLocations', location.id, 'แก้ไขจุดเวร: ' + location.name);
        return res.json({ status: 'success', message: 'อัพเดทจุดเวรสำเร็จ', data: location });
      }
    }

    location = await DutyLocation.create({
      id: uuidv4(),
      name: body.name,
      category: body.category || '',
      period: body.period || '',
      description: body.description || '',
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      is_active: body.is_active !== false,
      academic_year: body.academic_year || '',
      created_by: req.user.id
    });

    await logAudit(req.user.id, 'create', 'DutyLocations', location.id, 'เพิ่มจุดเวร: ' + location.name);

    res.json({ status: 'success', message: 'บันทึกจุดเวรสำเร็จ', data: location });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await DutyLocation.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบจุดเวร' });
    }

    await logAudit(req.user.id, 'delete', 'DutyLocations', location.id, 'ลบจุดเวร: ' + location.name);
    await location.destroy();

    res.json({ status: 'success', message: 'ลบจุดเวรสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.resetDefaultLocations = async (req, res) => {
  try {
    // Delete all existing locations
    await DutyLocation.destroy({ where: {} });

    const defaults = [
      { name: 'หน้าอาคารอนุบาล', category: 'kindergarten', period: 'morning_afternoon' },
      { name: 'สนามเด็กเล่นอนุบาล', category: 'kindergarten', period: 'morning_afternoon' },
      { name: 'Foreigners Gate', category: 'foreigners', period: 'morning_afternoon' },
      { name: 'ห้องธุรการ', category: 'admin', period: 'morning_afternoon' },
      { name: 'หน้าห้องผู้อำนวยการ', category: 'head', period: 'morning_afternoon' },
      { name: 'ประตูหน้า', category: 'fix', period: 'morning_afternoon' },
      { name: 'ประตูหลัง', category: 'fix', period: 'morning_afternoon' },
      { name: 'โรงอาหาร', category: 'fix', period: 'lunch' },
      { name: 'อาคาร 1', category: 'primary', period: 'morning_afternoon' },
      { name: 'อาคาร 2', category: 'primary', period: 'morning_afternoon' },
      { name: 'อาคาร 3', category: 'primary', period: 'morning_afternoon' }
    ];

    const created = [];
    for (const loc of defaults) {
      const newLoc = await DutyLocation.create({
        id: uuidv4(),
        name: loc.name,
        category: loc.category,
        period: loc.period,
        is_active: true,
        created_by: req.user.id
      });
      created.push(newLoc);
    }

    await logAudit(req.user.id, 'create', 'DutyLocations', null, 'รีเซ็ตจุดเวรเป็นค่าเริ่มต้น');

    res.json({ status: 'success', message: 'รีเซ็ตจุดเวรสำเร็จ', data: created });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==================== SCHEDULES ====================
exports.getSchedules = async (req, res) => {
  try {
    const { academicYear, startDate, endDate, page = 1 } = req.query;
    const limit = 20;
    const offset = (parseInt(page) - 1) * limit;

    const where = {};
    if (academicYear) where.academic_year = academicYear;
    if (startDate && endDate) {
      where.start_date = { [Op.between]: [startDate, endDate] };
    }

    const { count, rows } = await DutySchedule.findAndCountAll({
      where,
      include: [{ model: DutyLocation, as: 'locationInfo' }],
      order: [['start_date', 'DESC']],
      limit,
      offset
    });

    res.json({
      status: 'success',
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getWeeklySchedule = async (req, res) => {
  try {
    const { startDate, endDate, academicYear } = req.query;
    const where = {};
    if (academicYear) where.academic_year = academicYear;
    if (startDate && endDate) {
      where[Op.or] = [
        { start_date: { [Op.between]: [startDate, endDate] } },
        { end_date: { [Op.between]: [startDate, endDate] } }
      ];
    }

    const schedules = await DutySchedule.findAll({
      where,
      include: [{ model: DutyLocation, as: 'locationInfo' }],
      order: [['start_date', 'ASC']]
    });

    res.json({ status: 'success', data: schedules });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const body = req.body;
    const schedule = await DutySchedule.create({
      id: uuidv4(),
      start_date: body.start_date,
      end_date: body.end_date,
      period: body.period,
      location_id: body.location_id || null,
      location_data: body.location || null,
      assigned_users: body.assigned_users || [],
      status: 'scheduled',
      notes: body.notes || '',
      academic_year: body.academic_year || '',
      created_by: req.user.id
    });

    await logAudit(req.user.id, 'create', 'DutySchedules', schedule.id, 'สร้างตารางเวร');

    res.json({ status: 'success', message: 'สร้างตารางเวรสำเร็จ', data: schedule });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.saveWeeklySchedule = async (req, res) => {
  try {
    const { schedules } = req.body;

    if (!Array.isArray(schedules)) {
      return res.status(400).json({ status: 'error', message: 'ข้อมูลไม่ถูกต้อง' });
    }

    for (const s of schedules) {
      if (s.id) {
        const existing = await DutySchedule.findByPk(s.id);
        if (existing) {
          existing.assigned_users = s.assigned_users || [];
          existing.location_id = s.location_id || existing.location_id;
          existing.location_data = s.location || existing.location_data;
          existing.period = s.period || existing.period;
          existing.notes = s.notes || existing.notes;
          existing.changed('assigned_users', true);
          await existing.save();
          continue;
        }
      }
      await DutySchedule.create({
        id: uuidv4(),
        start_date: s.start_date,
        end_date: s.end_date,
        period: s.period,
        location_id: s.location_id || null,
        location_data: s.location || null,
        assigned_users: s.assigned_users || [],
        status: 'scheduled',
        notes: s.notes || '',
        academic_year: s.academic_year || '',
        created_by: req.user.id
      });
    }

    await logAudit(req.user.id, 'update', 'DutySchedules', null, 'บันทึกตารางเวรรายสัปดาห์');

    res.json({ status: 'success', message: 'บันทึกตารางเวรสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createBulkSchedule = async (req, res) => {
  try {
    const { schedules } = req.body;
    const created = [];

    for (const s of schedules) {
      const schedule = await DutySchedule.create({
        id: uuidv4(),
        start_date: s.start_date,
        end_date: s.end_date,
        period: s.period,
        location_id: s.location_id || null,
        location_data: s.location || null,
        assigned_users: s.assigned_users || [],
        status: 'scheduled',
        notes: s.notes || '',
        academic_year: s.academic_year || '',
        created_by: req.user.id
      });
      created.push(schedule);
    }

    await logAudit(req.user.id, 'create', 'DutySchedules', null, `สร้างตารางเวร ${created.length} รายการ`);

    res.json({ status: 'success', message: `สร้างตารางเวร ${created.length} รายการสำเร็จ`, data: created });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getTodaySchedules = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const schedules = await DutySchedule.findAll({
      where: {
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today }
      },
      include: [{ model: DutyLocation, as: 'locationInfo' }]
    });

    res.json({ status: 'success', data: schedules });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserDutyStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Find today's schedules where user is assigned
    const schedules = await DutySchedule.findAll({
      where: {
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today }
      },
      include: [{ model: DutyLocation, as: 'locationInfo' }]
    });

    // Filter schedules where user is assigned
    const userSchedules = schedules.filter(s => {
      const users = s.assigned_users || [];
      return users.some(u => (typeof u === 'string' ? u : u.id) === userId);
    });

    // Get checkins for today
    const checkins = await DutyCheckin.findAll({
      where: { user_id: userId, date: today }
    });

    res.json({ status: 'success', data: { schedules: userSchedules, checkins } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await DutySchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบตารางเวร' });
    }

    const body = req.body;
    schedule.start_date = body.start_date || schedule.start_date;
    schedule.end_date = body.end_date || schedule.end_date;
    schedule.period = body.period || schedule.period;
    schedule.location_id = body.location_id || schedule.location_id;
    schedule.notes = body.notes !== undefined ? body.notes : schedule.notes;
    if (body.assigned_users) {
      schedule.assigned_users = body.assigned_users;
      schedule.changed('assigned_users', true);
    }
    await schedule.save();

    await logAudit(req.user.id, 'update', 'DutySchedules', schedule.id, 'แก้ไขตารางเวร');

    res.json({ status: 'success', message: 'อัพเดทตารางเวรสำเร็จ', data: schedule });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await DutySchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบตารางเวร' });
    }

    await logAudit(req.user.id, 'delete', 'DutySchedules', schedule.id, 'ลบตารางเวร');
    await schedule.destroy();

    res.json({ status: 'success', message: 'ลบตารางเวรสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.saveDutyCell = async (req, res) => {
  try {
    const { date, location_id, users } = req.body;
    const academicYear = req.body.academic_year || '';

    let schedule = await DutySchedule.findOne({
      where: { start_date: { [Op.lte]: date }, end_date: { [Op.gte]: date }, location_id }
    });

    if (schedule) {
      schedule.assigned_users = users;
      schedule.changed('assigned_users', true);
      await schedule.save();
    } else {
      schedule = await DutySchedule.create({
        id: uuidv4(),
        start_date: date,
        end_date: date,
        period: 'morning_afternoon',
        location_id,
        assigned_users: users,
        status: 'scheduled',
        academic_year: academicYear,
        created_by: req.user.id
      });
    }

    await logAudit(req.user.id, 'update', 'DutySchedules', schedule.id, 'บันทึกผู้รับผิดชอบเวร');

    res.json({ status: 'success', message: 'บันทึกสำเร็จ', data: schedule });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==================== CHECKINS ====================
exports.dutyCheckin = async (req, res) => {
  try {
    const { schedule_id, latitude, longitude, checkin_method, notes } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today for this schedule
    const existing = await DutyCheckin.findOne({
      where: { schedule_id, user_id: userId, date: today }
    });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'เช็คอินแล้ววันนี้' });
    }

    const checkin = await DutyCheckin.create({
      id: uuidv4(),
      schedule_id,
      user_id: userId,
      checkin_time: new Date(),
      latitude: latitude || null,
      longitude: longitude || null,
      checkin_method: checkin_method || 'manual',
      notes: notes || '',
      status: 'checked_in',
      date: today
    });

    await logAudit(userId, 'checkin', 'DutyCheckins', checkin.id, 'เช็คอินเวร');

    res.json({ status: 'success', message: 'เช็คอินสำเร็จ', data: checkin });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.dutyCheckout = async (req, res) => {
  try {
    const { schedule_id, latitude, longitude } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const checkin = await DutyCheckin.findOne({
      where: { schedule_id, user_id: userId, date: today, status: 'checked_in' }
    });

    if (!checkin) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบข้อมูลเช็คอิน' });
    }

    checkin.checkout_time = new Date();
    checkin.status = 'checked_out';
    if (latitude) checkin.latitude = latitude;
    if (longitude) checkin.longitude = longitude;
    await checkin.save();

    res.json({ status: 'success', message: 'เช็คเอาท์สำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getCheckinStats = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const where = {};
    if (userId) where.user_id = userId;
    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const checkins = await DutyCheckin.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'name_en'] }],
      order: [['date', 'DESC']]
    });

    res.json({ status: 'success', data: checkins });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
