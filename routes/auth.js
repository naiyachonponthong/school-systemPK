const router = require('express').Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', auth, authController.logout);
router.get('/session', auth, authController.validateSession);

module.exports = router;
