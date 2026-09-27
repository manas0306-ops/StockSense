const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, AnalyticsController.getAnalytics);

module.exports = router;
