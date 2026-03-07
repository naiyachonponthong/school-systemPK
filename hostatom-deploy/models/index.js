const sequelize = require('../config/database');

const User = require('./User');
const Config = require('./Config');
const PersonalInfo = require('./PersonalInfo');
const Education = require('./Education');
const ScoutQualification = require('./ScoutQualification');
const WorkHistory = require('./WorkHistory');
const Award = require('./Award');
const PositionDuty = require('./PositionDuty');
const TeachingSummary = require('./TeachingSummary');
const ProjectActivity = require('./ProjectActivity');
const StudentActivity = require('./StudentActivity');
const MediaProduction = require('./MediaProduction');
const MediaUsage = require('./MediaUsage');
const FieldTrip = require('./FieldTrip');
const Competition = require('./Competition');
const Meeting = require('./Meeting');
const MeetingAttendee = require('./MeetingAttendee');
const MeetingCheckin = require('./MeetingCheckin');
const DutyLocation = require('./DutyLocation');
const DutySchedule = require('./DutySchedule');
const DutyCheckin = require('./DutyCheckin');
const AuditLog = require('./AuditLog');

// Associations
// Portfolio tables belong to User
const portfolioModels = [
  PersonalInfo, Education, ScoutQualification, WorkHistory, Award,
  PositionDuty, TeachingSummary, ProjectActivity, StudentActivity,
  MediaProduction, MediaUsage, FieldTrip, Competition
];

portfolioModels.forEach(model => {
  User.hasMany(model, { foreignKey: 'user_id' });
  model.belongsTo(User, { foreignKey: 'user_id' });
});

// Meeting associations
User.hasMany(Meeting, { foreignKey: 'created_by', as: 'createdMeetings' });
Meeting.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Meeting.hasMany(MeetingAttendee, { foreignKey: 'meeting_id', as: 'attendees' });
MeetingAttendee.belongsTo(Meeting, { foreignKey: 'meeting_id' });
MeetingAttendee.belongsTo(User, { foreignKey: 'user_id' });

Meeting.hasMany(MeetingCheckin, { foreignKey: 'meeting_id', as: 'checkins' });
MeetingCheckin.belongsTo(Meeting, { foreignKey: 'meeting_id' });
MeetingCheckin.belongsTo(User, { foreignKey: 'user_id' });

// Duty associations
DutyLocation.hasMany(DutySchedule, { foreignKey: 'location_id', as: 'schedules' });
DutySchedule.belongsTo(DutyLocation, { foreignKey: 'location_id', as: 'locationInfo' });

DutySchedule.hasMany(DutyCheckin, { foreignKey: 'schedule_id', as: 'checkins' });
DutyCheckin.belongsTo(DutySchedule, { foreignKey: 'schedule_id' });
DutyCheckin.belongsTo(User, { foreignKey: 'user_id' });

// Audit log
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

// Portfolio section name to model mapping
const portfolioModelMap = {
  'personal-info': PersonalInfo,
  'education': Education,
  'scout-qualification': ScoutQualification,
  'work-history': WorkHistory,
  'awards': Award,
  'position-duty': PositionDuty,
  'teaching-summary': TeachingSummary,
  'project-activity': ProjectActivity,
  'student-activity': StudentActivity,
  'media-production': MediaProduction,
  'media-usage': MediaUsage,
  'field-trip': FieldTrip,
  'competition': Competition
};

module.exports = {
  sequelize,
  User,
  Config,
  PersonalInfo,
  Education,
  ScoutQualification,
  WorkHistory,
  Award,
  PositionDuty,
  TeachingSummary,
  ProjectActivity,
  StudentActivity,
  MediaProduction,
  MediaUsage,
  FieldTrip,
  Competition,
  Meeting,
  MeetingAttendee,
  MeetingCheckin,
  DutyLocation,
  DutySchedule,
  DutyCheckin,
  AuditLog,
  portfolioModelMap
};
