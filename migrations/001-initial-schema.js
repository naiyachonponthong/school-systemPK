'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ==================== USERS ====================
    await queryInterface.createTable('users', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'staff', 'executive', 'user'), defaultValue: 'user' },
      name: { type: Sequelize.STRING(255), defaultValue: '' },
      name_en: { type: Sequelize.STRING(255), defaultValue: '' },
      email: { type: Sequelize.STRING(255), defaultValue: '' },
      phone: { type: Sequelize.STRING(50), defaultValue: '' },
      position: { type: Sequelize.STRING(255), defaultValue: '' },
      grade_level: { type: Sequelize.STRING(100), defaultValue: '' },
      profile_image: { type: Sequelize.STRING(500), defaultValue: '' },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      last_login: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // ==================== CONFIG ====================
    await queryInterface.createTable('config', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      key_name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      value: { type: Sequelize.TEXT('long'), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // ==================== PORTFOLIO TABLES ====================
    const portfolioTables = [
      'personal_info', 'education', 'scout_qualifications', 'work_history',
      'awards', 'position_duties', 'teaching_summaries', 'project_activities',
      'student_activities', 'media_productions', 'media_usages', 'field_trips', 'competitions'
    ];

    for (const tableName of portfolioTables) {
      await queryInterface.createTable(tableName, {
        id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
        user_id: { type: Sequelize.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        academic_year: { type: Sequelize.STRING(10), defaultValue: '' },
        data: { type: Sequelize.JSON, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
      });

      await queryInterface.addIndex(tableName, ['user_id']);
      await queryInterface.addIndex(tableName, ['academic_year']);
    }

    // ==================== MEETINGS ====================
    await queryInterface.createTable('meetings', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      title: { type: Sequelize.STRING(500), allowNull: false },
      title_en: { type: Sequelize.STRING(500), defaultValue: '' },
      description: { type: Sequelize.TEXT, allowNull: true },
      meeting_date: { type: Sequelize.DATEONLY, allowNull: false },
      start_time: { type: Sequelize.STRING(10), allowNull: true },
      end_time: { type: Sequelize.STRING(10), allowNull: true },
      location: { type: Sequelize.STRING(500), defaultValue: '' },
      location_lat: { type: Sequelize.DOUBLE, allowNull: true },
      location_lng: { type: Sequelize.DOUBLE, allowNull: true },
      location_radius: { type: Sequelize.INTEGER, defaultValue: 100 },
      require_location: { type: Sequelize.BOOLEAN, defaultValue: true },
      require_qr: { type: Sequelize.BOOLEAN, defaultValue: true },
      allow_late_checkin: { type: Sequelize.INTEGER, defaultValue: 15 },
      status: { type: Sequelize.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'), defaultValue: 'scheduled' },
      select_all_users: { type: Sequelize.BOOLEAN, defaultValue: false },
      academic_year: { type: Sequelize.STRING(10), defaultValue: '' },
      created_by: { type: Sequelize.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('meeting_attendees', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      meeting_id: { type: Sequelize.CHAR(36), allowNull: false, references: { model: 'meetings', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      user_id: { type: Sequelize.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      status: { type: Sequelize.ENUM('pending', 'checked_in', 'checked_out', 'absent'), defaultValue: 'pending' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('meeting_attendees', ['meeting_id']);
    await queryInterface.addIndex('meeting_attendees', ['user_id']);

    await queryInterface.createTable('meeting_checkins', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      meeting_id: { type: Sequelize.CHAR(36), allowNull: false, references: { model: 'meetings', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      user_id: { type: Sequelize.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      checkin_time: { type: Sequelize.DATE, allowNull: true },
      checkout_time: { type: Sequelize.DATE, allowNull: true },
      checkin_lat: { type: Sequelize.DOUBLE, allowNull: true },
      checkin_lng: { type: Sequelize.DOUBLE, allowNull: true },
      checkout_lat: { type: Sequelize.DOUBLE, allowNull: true },
      checkout_lng: { type: Sequelize.DOUBLE, allowNull: true },
      device_info: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('meeting_checkins', ['meeting_id']);
    await queryInterface.addIndex('meeting_checkins', ['user_id']);

    // ==================== DUTY ====================
    await queryInterface.createTable('duty_locations', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      name: { type: Sequelize.STRING(255), allowNull: false },
      category: { type: Sequelize.STRING(100), defaultValue: '' },
      period: { type: Sequelize.STRING(50), defaultValue: '' },
      description: { type: Sequelize.TEXT, allowNull: true },
      latitude: { type: Sequelize.DOUBLE, allowNull: true },
      longitude: { type: Sequelize.DOUBLE, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      academic_year: { type: Sequelize.STRING(10), defaultValue: '' },
      created_by: { type: Sequelize.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('duty_schedules', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      start_date: { type: Sequelize.DATEONLY, allowNull: true },
      end_date: { type: Sequelize.DATEONLY, allowNull: true },
      period: { type: Sequelize.INTEGER, allowNull: true },
      location_id: { type: Sequelize.CHAR(36), allowNull: true, references: { model: 'duty_locations', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      location_data: { type: Sequelize.JSON, allowNull: true },
      assigned_users: { type: Sequelize.JSON, allowNull: true },
      status: { type: Sequelize.ENUM('scheduled', 'in_progress', 'completed'), defaultValue: 'scheduled' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      academic_year: { type: Sequelize.STRING(10), defaultValue: '' },
      created_by: { type: Sequelize.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('duty_schedules', ['start_date', 'end_date']);
    await queryInterface.addIndex('duty_schedules', ['location_id']);

    await queryInterface.createTable('duty_checkins', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      schedule_id: { type: Sequelize.CHAR(36), allowNull: false, references: { model: 'duty_schedules', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      user_id: { type: Sequelize.CHAR(36), allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      checkin_time: { type: Sequelize.DATE, allowNull: true },
      checkout_time: { type: Sequelize.DATE, allowNull: true },
      latitude: { type: Sequelize.DOUBLE, allowNull: true },
      longitude: { type: Sequelize.DOUBLE, allowNull: true },
      checkin_method: { type: Sequelize.STRING(20), defaultValue: 'manual' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('checked_in', 'checked_out'), defaultValue: 'checked_in' },
      date: { type: Sequelize.DATEONLY, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('duty_checkins', ['schedule_id']);
    await queryInterface.addIndex('duty_checkins', ['user_id']);
    await queryInterface.addIndex('duty_checkins', ['date']);

    // ==================== AUDIT LOG ====================
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      user_id: { type: Sequelize.CHAR(36), allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      action: { type: Sequelize.STRING(50), allowNull: false },
      entity_type: { type: Sequelize.STRING(100), allowNull: true },
      entity_id: { type: Sequelize.STRING(36), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      before_data: { type: Sequelize.JSON, allowNull: true },
      after_data: { type: Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['entity_type']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
  },

  async down(queryInterface) {
    const tables = [
      'audit_logs', 'duty_checkins', 'duty_schedules', 'duty_locations',
      'meeting_checkins', 'meeting_attendees', 'meetings',
      'competitions', 'field_trips', 'media_usages', 'media_productions',
      'student_activities', 'project_activities', 'teaching_summaries',
      'position_duties', 'awards', 'work_history', 'scout_qualifications',
      'education', 'personal_info', 'config', 'users'
    ];
    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  }
};
