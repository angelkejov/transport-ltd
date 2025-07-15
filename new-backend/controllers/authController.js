const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await userModel.findUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = await userModel.createUser({ name, email, password: hashed, verificationToken });
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your email',
        html: `<p>Your verification code is: <b>${verificationToken}</b></p>`
      });
    } catch (emailErr) {
      // Delete the user if email sending fails
      await userModel.deleteUserById(userId);
      console.error('Email sending failed, user deleted:', emailErr);
      return res.status(500).json({ message: 'Registration failed: could not send verification email', error: emailErr.message });
    }
    res.status(201).json({ message: 'Registered. Please check your email to verify.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'No token provided' });
    const verified = await userModel.verifyUser(token);
    if (!verified) return res.status(400).json({ message: 'Invalid or expired token' });
    res.json({ message: 'Email verified. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
}

async function resendVerification(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.updateVerificationTokenByEmail(email, verificationToken);
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Your verification code is: <b>${verificationToken}</b></p>`
    });
    res.json({ message: 'Verification email resent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to resend verification email', error: err.message });
  }
}

async function verifyByCode(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code required' });
    const verified = await userModel.verifyUserByEmailAndToken(email, code);
    if (!verified) return res.status(400).json({ message: 'Invalid code or email' });
    res.json({ message: 'Email verified. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
}

module.exports = { register, login, verifyEmail, resendVerification, verifyByCode };
