const express = require('express');
const { landing, loginPage, signupPage, profile, play } = require('../controllers/pageController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', landing);
router.get('/login', loginPage);
router.get('/signup', signupPage);
router.get('/profile', requireAuth(process.env.JWT_SECRET || 'change-me'), profile);
router.get('/play', play);

module.exports = router;
