const router = require('express').Router();
const configController = require('../controllers/configController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Config is public for GET (needed by login page)
router.get('/', configController.getConfig);
router.put('/', auth, authorize('admin'), configController.saveConfig);

module.exports = router;
