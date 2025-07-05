import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import uploadService from '../lib/utils/uploadService.js';
import {
  getAllCourses,
  getCourseById,
  getMentorCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses/index.js';

const router = express.Router();

// Get all courses (public)
router.get('/', getAllCourses);

// Get mentor's courses (mentor only) - README specified route
// This MUST come before /:id route to prevent "my" from being treated as an ID
router.get('/my', authenticate, authorize('mentor'), getMentorCourses);

// Get mentor's courses (mentor only) - alternative route
router.get('/mentor/my-courses', authenticate, authorize('mentor'), getMentorCourses);

// Create course (mentor only) - uses dynamic upload service
router.post('/', 
  authenticate, 
  authorize('mentor'), 
  uploadService.getUploadMiddleware('video', 'video'), 
  createCourse
);

// Get course by ID (public) - This must come AFTER specific routes
router.get('/:id', getCourseById);

// Update course (mentor only)
router.put('/:id', authenticate, authorize('mentor'), updateCourse);

// Delete course (mentor only)
router.delete('/:id', authenticate, authorize('mentor'), deleteCourse);

export default router;