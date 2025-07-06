import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createOrder,
  confirmPayment,
  getMyOrders,
  getEnrolledCourses
} from '../controllers/orders/index.js';
import manualConfirmPayment from '../controllers/orders/manualConfirm.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.post('/confirm-payment', authenticate, confirmPayment);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/enrolled-courses', authenticate, getEnrolledCourses);

router.get('/manual-confirm/:sessionId', manualConfirmPayment);

export default router;