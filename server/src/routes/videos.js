import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  streamVideo,
  getVideoInfo,
  getThumbnail
} from '../controllers/videos/index.js';
import streamVideoCompressed from '../controllers/videos/streamVideoCompressed.js';

const router = express.Router();


router.get('/:courseId/stream', authenticate, streamVideo);
router.get('/:courseId/stream-compressed', authenticate, streamVideoCompressed);


router.get('/:courseId/info', authenticate, getVideoInfo);


router.get('/:courseId/thumbnail', authenticate, getThumbnail);

export default router;