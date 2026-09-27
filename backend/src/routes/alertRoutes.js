const express = require('express');
const router = express.Router();
const AlertController = require('../controllers/alertController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, AlertController.getAll);
router.put('/:id/read', authenticate, AlertController.markRead);
router.put('/:id/resolve', authenticate, AlertController.resolve);
router.post('/resolve-all', authenticate, AlertController.resolveAll);

module.exports = router;
