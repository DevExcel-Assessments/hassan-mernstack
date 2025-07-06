import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
  toggleHelpful
} from '../controllers/reviews/index.js';

const router = express.Router();


router.get('/course/:courseId', getCourseReviews);


router.post('/course/:courseId', authenticate, createReview);


router.put('/:reviewId', authenticate, updateReview);


router.delete('/:reviewId', authenticate, deleteReview);


router.post('/:reviewId/helpful', authenticate, toggleHelpful);

export default router; 