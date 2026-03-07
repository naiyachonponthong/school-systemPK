const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { Meeting, MeetingAttendee, MeetingCheckin, User } = require('../models');
const { logAudit } = require('../utils/auditLogger');

exports.getMeetings = async (req, res) => {
  try {
    const { status, academicYear, page = 1 } = req.query;
    const limit = 20;
    const offset = (parseInt(page) - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (academicYear) where.academic_year = academicYear;

    const { count, rows } = await Meeting.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'name_en'] },
        { model: MeetingAttendee, as: 'attendees', attributes: ['id', 'user_id', 'status'] }
      ],
      order: [['meeting_date', 'DESC']],
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

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'name_en'] },
        {
          model: MeetingAttendee, as: 'attendees',
          include: [{ model: User, attributes: ['id', 'name', 'name_en', 'position', 'profile_image'] }]
        },
        {
          model: MeetingCheckin, as: 'checkins',
          include: [{ model: User, attributes: ['id', 'name', 'name_en'] }]
        }
      ]
    });

    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบการประชุม' });
    }

    res.json({ status: 'success', data: meeting });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createMeeting = async (req, res) => {
  try {
    const body = req.body;
    const meetingId = uuidv4();

    const meeting = await Meeting.create({
      id: meetingId,
      title: body.title,
      title_en: body.title_en || '',
      description: body.description || '',
      meeting_date: body.meeting_date,
      start_time: body.start_time || '',
      end_time: body.end_time || '',
      location: body.location || '',
      location_lat: body.location_lat || null,
      location_lng: body.location_lng || null,
      location_radius: body.location_radius || 100,
      require_location: body.require_location !== false,
      require_qr: body.require_qr !== false,
      allow_late_checkin: body.allow_late_checkin || 15,
      status: 'scheduled',
      select_all_users: body.select_all_users || false,
      academic_year: body.academic_year || '',
      created_by: req.user.id
    });

    // Add attendees
    if (body.attendees && Array.isArray(body.attendees)) {
      const attendeeRecords = body.attendees.map(userId => ({
        id: uuidv4(),
        meeting_id: meetingId,
        user_id: userId,
        status: 'pending'
      }));
      await MeetingAttendee.bulkCreate(attendeeRecords);
    }

    await logAudit(req.user.id, 'create', 'Meetings', meetingId, 'สร้างการประชุม: ' + body.title);

    res.json({ status: 'success', message: 'สร้างการประชุมสำเร็จ', data: meeting });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบการประชุม' });
    }

    const body = req.body;
    const fields = ['title', 'title_en', 'description', 'meeting_date', 'start_time', 'end_time',
      'location', 'location_lat', 'location_lng', 'location_radius', 'require_location',
      'require_qr', 'allow_late_checkin', 'academic_year', 'select_all_users'];

    fields.forEach(f => {
      if (body[f] !== undefined) meeting[f] = body[f];
    });
    await meeting.save();

    // Update attendees if provided
    if (body.attendees && Array.isArray(body.attendees)) {
      await MeetingAttendee.destroy({ where: { meeting_id: meeting.id } });
      const attendeeRecords = body.attendees.map(userId => ({
        id: uuidv4(),
        meeting_id: meeting.id,
        user_id: userId,
        status: 'pending'
      }));
      await MeetingAttendee.bulkCreate(attendeeRecords);
    }

    await logAudit(req.user.id, 'update', 'Meetings', meeting.id, 'แก้ไขการประชุม: ' + meeting.title);

    res.json({ status: 'success', message: 'อัพเดทการประชุมสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบการประชุม' });
    }

    await MeetingCheckin.destroy({ where: { meeting_id: meeting.id } });
    await MeetingAttendee.destroy({ where: { meeting_id: meeting.id } });
    await meeting.destroy();

    await logAudit(req.user.id, 'delete', 'Meetings', req.params.id, 'ลบการประชุม');

    res.json({ status: 'success', message: 'ลบการประชุมสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateMeetingStatus = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบการประชุม' });
    }

    meeting.status = req.body.status;
    await meeting.save();

    await logAudit(req.user.id, 'update', 'Meetings', meeting.id,
      'เปลี่ยนสถานะการประชุม: ' + req.body.status);

    res.json({ status: 'success', message: 'อัพเดทสถานะสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAttendees = async (req, res) => {
  try {
    const attendees = await MeetingAttendee.findAll({
      where: { meeting_id: req.params.id },
      include: [{ model: User, attributes: ['id', 'name', 'name_en', 'position', 'profile_image'] }]
    });

    // Get checkins for this meeting
    const checkins = await MeetingCheckin.findAll({
      where: { meeting_id: req.params.id }
    });

    const checkinMap = {};
    checkins.forEach(c => { checkinMap[c.user_id] = c; });

    const result = attendees.map(a => {
      const json = a.toJSON();
      json.checkin = checkinMap[a.user_id] || null;
      return json;
    });

    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.checkin = async (req, res) => {
  try {
    const { meeting_id } = req.params;
    const userId = req.user.id;
    const { lat, lng, device_info } = req.body;

    // Check if already checked in
    let checkin = await MeetingCheckin.findOne({
      where: { meeting_id, user_id: userId }
    });

    if (checkin && checkin.checkin_time) {
      return res.status(400).json({ status: 'error', message: 'เช็คอินแล้ว' });
    }

    if (!checkin) {
      checkin = await MeetingCheckin.create({
        id: uuidv4(),
        meeting_id,
        user_id: userId,
        checkin_time: new Date(),
        checkin_lat: lat || null,
        checkin_lng: lng || null,
        device_info: device_info || null
      });
    } else {
      checkin.checkin_time = new Date();
      checkin.checkin_lat = lat || null;
      checkin.checkin_lng = lng || null;
      await checkin.save();
    }

    // Update attendee status
    await MeetingAttendee.update(
      { status: 'checked_in' },
      { where: { meeting_id, user_id: userId } }
    );

    await logAudit(userId, 'checkin', 'MeetingCheckins', checkin.id, 'เช็คอินการประชุม');

    res.json({ status: 'success', message: 'เช็คอินสำเร็จ', data: checkin });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { meeting_id } = req.params;
    const userId = req.user.id;
    const { lat, lng } = req.body;

    const checkin = await MeetingCheckin.findOne({
      where: { meeting_id, user_id: userId }
    });

    if (!checkin) {
      return res.status(404).json({ status: 'error', message: 'ยังไม่ได้เช็คอิน' });
    }

    checkin.checkout_time = new Date();
    checkin.checkout_lat = lat || null;
    checkin.checkout_lng = lng || null;
    await checkin.save();

    // Update attendee status
    await MeetingAttendee.update(
      { status: 'checked_out' },
      { where: { meeting_id, user_id: userId } }
    );

    res.json({ status: 'success', message: 'เช็คเอาท์สำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserMeetings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { academicYear } = req.query;

    const where = { user_id: userId };
    const attendees = await MeetingAttendee.findAll({
      where,
      include: [{
        model: Meeting,
        where: academicYear ? { academic_year: academicYear } : {},
        include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'name_en'] }]
      }],
      order: [[Meeting, 'meeting_date', 'DESC']]
    });

    const meetings = attendees.map(a => {
      const json = a.toJSON();
      return { ...json.Meeting, attendee_status: json.status };
    });

    res.json({ status: 'success', data: meetings });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMeetingReport = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id, {
      include: [
        {
          model: MeetingAttendee, as: 'attendees',
          include: [{ model: User, attributes: ['id', 'name', 'name_en', 'position'] }]
        },
        { model: MeetingCheckin, as: 'checkins' }
      ]
    });

    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบการประชุม' });
    }

    const totalAttendees = meeting.attendees.length;
    const checkedIn = meeting.attendees.filter(a => ['checked_in', 'checked_out'].includes(a.status)).length;
    const attendanceRate = totalAttendees > 0 ? Math.round((checkedIn / totalAttendees) * 100) : 0;

    res.json({
      status: 'success',
      data: {
        meeting: meeting.toJSON(),
        stats: { totalAttendees, checkedIn, attendanceRate }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
