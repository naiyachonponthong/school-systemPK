const router = require('express').Router();
const meetingController = require('../controllers/meetingController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// User meetings (must be before /:id routes)
router.get('/user/my-meetings', auth, meetingController.getUserMeetings);

router.get('/', auth, meetingController.getMeetings);
router.get('/:id', auth, meetingController.getMeetingById);
router.post('/', auth, authorize('admin', 'staff', 'executive'), meetingController.createMeeting);
router.put('/:id', auth, authorize('admin', 'staff', 'executive'), meetingController.updateMeeting);
router.delete('/:id', auth, authorize('admin', 'staff', 'executive'), meetingController.deleteMeeting);
router.put('/:id/status', auth, authorize('admin', 'staff', 'executive'), meetingController.updateMeetingStatus);
router.get('/:id/attendees', auth, meetingController.getAttendees);
router.post('/:meeting_id/checkin', auth, meetingController.checkin);
router.put('/:meeting_id/checkout', auth, meetingController.checkout);
router.get('/:id/report', auth, meetingController.getMeetingReport);

module.exports = router;
