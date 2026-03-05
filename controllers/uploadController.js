exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'ไม่พบไฟล์' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    res.json({ status: 'success', message: 'อัพโหลดสำเร็จ', data: { url: imageUrl } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
