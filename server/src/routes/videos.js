import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  streamVideo,
  getVideoInfo,
  getThumbnail
} from '../controllers/videos/index.js';

const router = express.Router();

// Video streaming endpoint
router.get('/:courseId/stream', authenticate, streamVideo);

// Video info endpoint
router.get('/:courseId/info', authenticate, getVideoInfo);

// Thumbnail endpoint
router.get('/:courseId/thumbnail', authenticate, getThumbnail);

export default router;