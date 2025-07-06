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

router.post('/file', 
  authenticate, 
  uploadService.getUploadMiddleware('file', 'file'),
  uploadFile
);

router.post('/video', 
  authenticate, 
  uploadService.getUploadMiddleware('video', 'video'),
  uploadVideo
);


router.post('/image', 
  authenticate, 
  uploadService.getUploadMiddleware('image', 'image'),
  uploadImage
);


router.post('/thumbnail', 
  authenticate, 
  uploadService.getUploadMiddleware('thumbnail', 'thumbnail'),
  uploadThumbnail
);


router.post('/generate-thumbnail', 
  authenticate, 
  generateThumbnail
);


router.get('/info/:filePath(*)', 
  authenticate, 
  getFileInfo
);


router.delete('/:filePath(*)', 
  authenticate, 
  deleteFile
);


router.get('/config/:fileType?', 
  authenticate, 
  getUploadConfig
);


router.get('/config', 
  authenticate, 
  getUploadConfig
);

export default router; 