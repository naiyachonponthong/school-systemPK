const router = require('express').Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/image', auth, upload.single('image'), uploadController.uploadImage);

module.exports = router;
