import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  streamVideo,
  getVideoInfo
} from '../controllers/videos/index.js';

const router = express.Router();


router.get('/:courseId/stream', authenticate, streamVideo);
router.get('/:courseId/info', authenticate, getVideoInfo);

export default router;