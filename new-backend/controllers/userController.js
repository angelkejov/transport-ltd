const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

async function getProfile(req, res) {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    delete user.password;
    delete user.verificationToken;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile', error: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const updated = await userModel.updateProfileById(req.user.id, { name });
    if (!updated) return res.status(400).json({ message: 'Update failed' });
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
}

async function getOrderHistory(req, res) {
  try {
    const orders = await orderModel.getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get order history', error: err.message });
  }
}

module.exports = { getProfile, updateProfile, getOrderHistory };
