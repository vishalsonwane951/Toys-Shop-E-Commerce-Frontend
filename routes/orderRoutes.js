import express from "express";
import { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getStats } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/stats', protect, adminOnly, getStats);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;