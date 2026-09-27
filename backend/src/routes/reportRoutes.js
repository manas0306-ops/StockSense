const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

router.post('/generate', authenticate, ReportController.generate);

module.exports = router;
