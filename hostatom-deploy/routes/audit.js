const router = require('express').Router();
const auditController = require('../controllers/auditController');
const auth = require('../middleware/auth');

router.get('/', auth, auditController.getAuditLogs);
router.get('/stats', auth, auditController.getAuditStats);
router.get('/user/:userId', auth, auditController.getUserAuditLogs);

module.exports = router;
