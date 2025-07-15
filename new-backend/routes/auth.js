const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resendVerification, verifyByCode } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/verify-by-code', verifyByCode);

module.exports = router;
