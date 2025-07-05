import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import uploadService from '../lib/utils/uploadService.js';
import {
  uploadFile,
  uploadVideo,
  uploadImage,
  uploadThumbnail,
  generateThumbnail,
  getFileInfo,
  deleteFile,
  getUploadConfig
} from '../controllers/upload/uploadController.js';

const router = express.Router();

// Generic upload route for any file type
router.post('/file', 
  authenticate, 
  uploadService.getUploadMiddleware('file', 'file'),
  uploadFile
);

// Video upload route
router.post('/video', 
  authenticate, 
  uploadService.getUploadMiddleware('video', 'video'),
  uploadVideo
);

// Image upload route
router.post('/image', 
  authenticate, 
  uploadService.getUploadMiddleware('image', 'image'),
  uploadImage
);

// Thumbnail upload route
router.post('/thumbnail', 
  authenticate, 
  uploadService.getUploadMiddleware('thumbnail', 'thumbnail'),
  uploadThumbnail
);

// Generate thumbnail from existing video
router.post('/generate-thumbnail', 
  authenticate, 
  generateThumbnail
);

// Get file information
router.get('/info/:filePath(*)', 
  authenticate, 
  getFileInfo
);

// Delete file
router.delete('/:filePath(*)', 
  authenticate, 
  deleteFile
);

// Get upload configuration
router.get('/config/:fileType?', 
  authenticate, 
  getUploadConfig
);

// Get all upload configurations
router.get('/config', 
  authenticate, 
  getUploadConfig
);

export default router; 