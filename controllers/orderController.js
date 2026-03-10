import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }
    // Decrease stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({
      user: req.user._id, orderItems, shippingAddress, paymentMethod,
      itemsPrice, shippingPrice, taxPrice, totalPrice
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const recentOrders = await Order.find().populate('user', 'name').sort('-createdAt').limit(5);
    // const Product = require('../models/Product');
    // const User = require('../models/User');
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const monthlySales = await Order.aggregate([
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    res.json({
      success: true,
      stats: {
        totalOrders, totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders, totalProducts, totalUsers, recentOrders, monthlySales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
