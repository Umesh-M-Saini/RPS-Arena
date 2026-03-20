const express = require('express');
const { completeMatch } = require('../controllers/gameController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/match/complete', requireAuth(process.env.JWT_SECRET || 'change-me'), completeMatch);

module.exports = router;
