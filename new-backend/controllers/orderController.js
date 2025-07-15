const orderModel = require('../models/orderModel');
const sendEmail = require('../utils/sendEmail');
const userModel = require('../models/userModel');

async function placeOrder(req, res) {
  try {
    const { service, details, phone } = req.body;
    if (!service) return res.status(400).json({ message: 'Service is required' });
    console.log({ userId: req.user.id, service, details, phone });
    const orderId = await orderModel.createOrder({ userId: req.user.id, service, details, phone });
    console.log("After response");
    res.status(201).json({ message: 'Order placed', orderId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await orderModel.getAllOrdersWithUser();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
}

async function approveOrder(req, res) {
  try {
    const { id } = req.params;
    const updated = await orderModel.updateOrderStatus(id, 'approved');
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    
    // Fetch order and user info for email
    const orders = await orderModel.getAllOrdersWithUser();
    const order = orders.find(o => o.id == id);
    if (order) {
      try {
        await sendEmail({
          to: order.userEmail,
          subject: 'Вашата поръчка е одобрена',
          html: `<p>Здравейте,</p><p>Вашата поръчка за "${order.service}" беше одобрена. Ще се свържем с вас на телефон ${order.phone}.</p>`
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the approval if email fails
      }
    }
    res.json({ message: 'Order approved' });
  } catch (err) {
    console.error('Approve order error:', err);
    res.status(500).json({ message: 'Failed to approve order', error: err.message });
  }
}

async function rejectOrder(req, res) {
  try {
    const { id } = req.params;
    const updated = await orderModel.updateOrderStatus(id, 'rejected');
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order rejected' });
  } catch (err) {
    console.error('Reject order error:', err);
    res.status(500).json({ message: 'Failed to reject order', error: err.message });
  }
}

module.exports = { placeOrder, getAllOrders, approveOrder, rejectOrder };
