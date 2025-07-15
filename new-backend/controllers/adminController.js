const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const galleryModel = require('../models/galleryModel');

async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users', error: err.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await orderModel.getAllOrdersWithUser();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
}

async function getAllGallery(req, res) {
  try {
    const images = await galleryModel.getAllImages();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get gallery', error: err.message });
  }
}

module.exports = { getAllUsers, getAllOrders, getAllGallery };
