import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllCourses,
  getCourseById,
  getMentorCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses/index.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/videos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  }
});


router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/mentor/my-courses', authenticate, authorize('mentor'), getMentorCourses);
router.post('/', authenticate, authorize('mentor'), upload.single('video'), createCourse);
router.put('/:id', authenticate, authorize('mentor'), updateCourse);
router.delete('/:id', authenticate, authorize('mentor'), deleteCourse);

export default router;