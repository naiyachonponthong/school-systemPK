const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, authorize('admin', 'staff'), userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);
router.put('/:id/profile-image', auth, userController.updateProfileImage);
router.put('/:id/change-password', auth, userController.changePassword);
router.get('/:id/latest-photo', auth, userController.getLatestPhoto);

module.exports = router;
