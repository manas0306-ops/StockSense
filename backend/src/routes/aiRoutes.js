const express = require('express');
const router = express.Router();
const AiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');

router.post('/query', authenticate, AiController.query);

module.exports = router;
