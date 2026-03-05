const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User, Config } = require('../models');
const appConfig = require('../config/config');

async function seedDefaultData() {
  try {
    // Seed default admin user
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(appConfig.DEFAULT_ADMIN.password, 10);
      await User.create({
        id: uuidv4(),
        username: appConfig.DEFAULT_ADMIN.username,
        password: hashedPassword,
        role: appConfig.DEFAULT_ADMIN.role,
        name: appConfig.DEFAULT_ADMIN.name,
        name_en: appConfig.DEFAULT_ADMIN.name_en,
        active: true
      });
      console.log('Default admin user created.');
    }

    // Seed default staff user
    const staffExists = await User.findOne({ where: { username: 'staff' } });
    if (!staffExists) {
      const hashedPassword = await bcrypt.hash(appConfig.DEFAULT_STAFF.password, 10);
      await User.create({
        id: uuidv4(),
        username: appConfig.DEFAULT_STAFF.username,
        password: hashedPassword,
        role: appConfig.DEFAULT_STAFF.role,
        name: appConfig.DEFAULT_STAFF.name,
        name_en: appConfig.DEFAULT_STAFF.name_en,
        active: true
      });
      console.log('Default staff user created.');
    }

    // Seed default config
    const configExists = await Config.findOne({ where: { key_name: 'system' } });
    if (!configExists) {
      await Config.create({
        id: uuidv4(),
        key_name: 'system',
        value: JSON.stringify({
          app_name: 'ระบบจัดการบุคลากร',
          app_name_en: 'Personnel Management System',
          logo_url: '',
          school_name: 'โรงเรียนตัวอย่าง',
          school_name_en: 'Sample School',
          address: '',
          subdistrict: '',
          district: '',
          province: '',
          postal_code: '',
          phone: '',
          email: '',
          positions: ['ครู', 'ครูผู้ช่วย', 'พนักงานราชการ', 'ลูกจ้างประจำ', 'ลูกจ้างชั่วคราว'],
          positions_en: ['Teacher', 'Assistant Teacher', 'Government Employee', 'Permanent Employee', 'Temporary Employee'],
          grade_levels: ['ปฐมวัย', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'],
          grade_levels_en: ['Kindergarten', 'G.1', 'G.2', 'G.3', 'G.4', 'G.5', 'G.6', 'G.7', 'G.8', 'G.9', 'G.10', 'G.11', 'G.12'],
          academic_years: ['2567', '2568', '2569', '2570'],
          current_academic_year: '2567',
          language: 'th'
        })
      });
      console.log('Default config created.');
    }
  } catch (error) {
    console.error('Seeder error:', error.message);
  }
}

module.exports = { seedDefaultData };
