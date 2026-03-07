const { Config } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.getConfig = async (req, res) => {
  try {
    const configRow = await Config.findOne({ where: { key_name: 'system' } });
    if (!configRow) {
      return res.status(404).json({ status: 'error', message: 'ไม่พบข้อมูลการตั้งค่า' });
    }
    const data = JSON.parse(configRow.value);
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.saveConfig = async (req, res) => {
  try {
    const configData = req.body;
    let configRow = await Config.findOne({ where: { key_name: 'system' } });

    if (configRow) {
      configRow.value = JSON.stringify(configData);
      await configRow.save();
    } else {
      await Config.create({
        id: uuidv4(),
        key_name: 'system',
        value: JSON.stringify(configData)
      });
    }

    res.json({ status: 'success', message: 'บันทึกการตั้งค่าสำเร็จ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
