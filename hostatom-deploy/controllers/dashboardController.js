const { Op } = require('sequelize');
const { User, PersonalInfo, Education, ScoutQualification, WorkHistory, Meeting, MeetingAttendee, DutySchedule, DutyCheckin } = require('../models');

exports.getStats = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const role = req.user.role;
    const today = new Date().toISOString().split('T')[0];

    let stats;

    if (['admin', 'staff', 'executive'].includes(role)) {
      const [totalUsers, totalPersonalInfo, totalEducation, totalScoutQualification, totalWorkHistory, totalMeetings, activeMeetings, totalDutySchedules] = await Promise.all([
        User.count(),
        PersonalInfo.count(),
        Education.count(),
        ScoutQualification.count(),
        WorkHistory.count(),
        Meeting.count(),
        Meeting.count({ where: { status: 'in_progress' } }),
        DutySchedule.count({ where: { start_date: { [Op.lte]: today }, end_date: { [Op.gte]: today } } })
      ]);

      stats = {
        totalUsers, totalPersonalInfo, totalEducation, totalScoutQualification, totalWorkHistory,
        totalMeetings, activeMeetings, todayDutySchedules: totalDutySchedules
      };
    } else {
      const [totalPersonalInfo, totalEducation, totalScoutQualification, totalWorkHistory, myMeetings, myDutyCheckins] = await Promise.all([
        PersonalInfo.count({ where: { user_id: userId } }),
        Education.count({ where: { user_id: userId } }),
        ScoutQualification.count({ where: { user_id: userId } }),
        WorkHistory.count({ where: { user_id: userId } }),
        MeetingAttendee.count({ where: { user_id: userId } }),
        DutyCheckin.count({ where: { user_id: userId } })
      ]);

      stats = {
        totalUsers: 0, totalPersonalInfo, totalEducation, totalScoutQualification, totalWorkHistory,
        myMeetings, myDutyCheckins
      };
    }

    res.json({ status: 'success', data: stats });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
