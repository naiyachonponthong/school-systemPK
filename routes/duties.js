const router = require('express').Router();
const dutyController = require('../controllers/dutyController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Locations
router.get('/locations', auth, dutyController.getLocations);
router.get('/locations/:id', auth, dutyController.getLocationById);
router.post('/locations', auth, authorize('admin', 'staff', 'executive'), dutyController.saveLocation);
router.put('/locations/:id', auth, authorize('admin', 'staff', 'executive'), dutyController.saveLocation);
router.delete('/locations/:id', auth, authorize('admin', 'staff', 'executive'), dutyController.deleteLocation);
router.post('/locations/reset-default', auth, authorize('admin', 'staff'), dutyController.resetDefaultLocations);

// Schedules
router.get('/schedules', auth, dutyController.getSchedules);
router.get('/schedules/weekly', auth, dutyController.getWeeklySchedule);
router.get('/schedules/today', auth, dutyController.getTodaySchedules);
router.post('/schedules', auth, authorize('admin', 'staff', 'executive'), dutyController.createSchedule);
router.put('/schedules/weekly', auth, authorize('admin', 'staff', 'executive'), dutyController.saveWeeklySchedule);
router.post('/schedules/bulk', auth, authorize('admin', 'staff', 'executive'), dutyController.createBulkSchedule);
router.put('/schedules/:id', auth, authorize('admin', 'staff', 'executive'), dutyController.updateSchedule);
router.delete('/schedules/:id', auth, authorize('admin', 'staff', 'executive'), dutyController.deleteSchedule);
router.post('/schedules/cell', auth, authorize('admin', 'staff', 'executive'), dutyController.saveDutyCell);

// User duty
router.get('/user/status', auth, dutyController.getUserDutyStatus);

// Checkins
router.post('/checkin', auth, dutyController.dutyCheckin);
router.put('/checkout', auth, dutyController.dutyCheckout);
router.get('/checkin/stats', auth, dutyController.getCheckinStats);

module.exports = router;
