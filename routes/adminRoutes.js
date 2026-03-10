import express from 'express'
const router = express.Router();
import { getUsers, deleteUser, updateUserRole } from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/auth.js'

router.get('/users', protect, adminOnly, getUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

export default router;