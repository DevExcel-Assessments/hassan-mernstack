import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import uploadService from '../lib/utils/uploadService.js';
import {
  getAllCourses,
  getCourseById,
  getMentorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse
} from '../controllers/courses/index.js';

const router = express.Router();

// Get all courses (public)
router.get('/', getAllCourses);


router.get('/my', authenticate, authorize('mentor'), getMentorCourses);


router.get('/mentor/my-courses', authenticate, authorize('mentor'), getMentorCourses);


router.post('/', 
  authenticate, 
  authorize('mentor'), 
  uploadService.getUploadMiddleware('video', 'video'), 
  createCourse
);


router.get('/:id', getCourseById);


router.put('/:id', authenticate, authorize('mentor'), updateCourse);


router.patch('/:id/publish', authenticate, authorize('mentor'), publishCourse);


router.patch('/:id/unpublish', authenticate, authorize('mentor'), unpublishCourse);


router.delete('/:id', authenticate, authorize('mentor'), deleteCourse);

export default router;