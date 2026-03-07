const router = require('express').Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

router.get('/check-year-data', auth, portfolioController.checkYearData);
router.get('/latest-year-data', auth, portfolioController.latestYearData);
router.get('/:section', auth, portfolioController.getAll);
router.get('/:section/:id', auth, portfolioController.getById);
router.post('/:section', auth, portfolioController.create);
router.put('/:section/:id', auth, portfolioController.update);
router.delete('/:section/:id', auth, portfolioController.delete);

module.exports = router;
