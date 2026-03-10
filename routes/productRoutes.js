import express from "express";
import { getProducts, getFeaturedProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview } from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addReview);

export default router;