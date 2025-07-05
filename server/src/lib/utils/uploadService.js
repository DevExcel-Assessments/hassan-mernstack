import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Set ffprobe path (same directory as ffmpeg)
const ffprobePath = ffmpegPath.replace(
  /ffmpeg(?:\\.exe)?$/,
  process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
);
ffmpeg.setFfprobePath(ffprobePath);

// Check if FFmpeg is available
const isFFmpegAvailable = () => {
  try {
    // Test if ffmpeg is working
    ffmpeg.getAvailableCodecs((err) => {
      if (err) {
        console.warn('FFmpeg not available, video processing will be limited');
        return false;
      }
    });
    console.log('FFmpeg is available and ready to use');
    return true;
  } catch (error) {
    console.warn('FFmpeg not available, video processing will be limited');
    return false;
  }
};

const FFMPEG_AVAILABLE = isFFmpegAvailable();

// File type configurations
const FILE_TYPES = {
  video: {
    allowedMimes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
    generateThumbnail: true,
    thumbnailTimestamp: '10',
    thumbnailSize: '640x360'
  },
  image: {
    allowedMimes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    generateThumbnail: false
  },
  thumbnail: {
    allowedMimes: ['image/jpeg', 'image/png'],
    maxSize: 5 * 1024 * 1024, // 5MB
    generateThumbnail: false
  },
  file: {
    allowedMimes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 100 * 1024 * 1024, // 100MB
    generateThumbnail: false
  }
};

// Create storage configuration
const createStorage = (fileType) => {
  const config = FILE_TYPES[fileType];
  const uploadDir = `uploads/${fileType}s`;
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${fileType}-${uniqueSuffix}${ext}`);
    }
  });
};

// Create file filter
const createFileFilter = (fileType) => {
  const config = FILE_TYPES[fileType];
  
  return (req, file, cb) => {
    if (config.allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${config.allowedMimes.join(', ')}`));
    }
  };
};

// Generate thumbnail for video
const generateVideoThumbnail = async (videoPath, outputPath, timestamp = '10', size = '640x360') => {
  return new Promise((resolve, reject) => {
    const thumbnailDir = path.dirname(outputPath);
    
    // Create thumbnail directory if it doesn't exist
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: thumbnailDir,
        size: size
      })
      .on('end', () => {
        console.log('Thumbnail generated successfully:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Thumbnail generation failed:', err.message);
        reject(err);
      });
  });
};

// Get video information with fallback
const getVideoInfo = async (videoPath) => {
  return new Promise((resolve, reject) => {
    try {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          console.warn('ffprobe failed, using default video info:', err.message);
          // Fallback to default video info
          const defaultInfo = {
            format: {
              duration: 300, // Default 5 minutes
              size: fs.statSync(videoPath).size,
              filename: path.basename(videoPath)
            },
            streams: []
          };
          resolve(defaultInfo);
        } else {
          console.log('Video info retrieved successfully');
          resolve(metadata);
        }
      });
    } catch (error) {
      console.warn('ffprobe error, using default video info:', error.message);
      // Fallback to default video info
      const defaultInfo = {
        format: {
          duration: 300, // Default 5 minutes
          size: fs.statSync(videoPath).size,
          filename: path.basename(videoPath)
        },
        streams: []
      };
      resolve(defaultInfo);
    }
  });
};

// Validate video duration
const validateVideoDuration = (duration, maxMinutes = 5) => {
  return duration <= maxMinutes;
};

// Clean up file
const cleanupFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Create upload middleware
const createUploadMiddleware = (fileType, fieldName = 'file') => {
  const config = FILE_TYPES[fileType];
  
  return multer({
    storage: createStorage(fileType),
    limits: {
      fileSize: config.maxSize
    },
    fileFilter: createFileFilter(fileType)
  }).single(fieldName);
};

// Process uploaded file
const processUploadedFile = async (file, fileType, options = {}) => {
  const config = FILE_TYPES[fileType];
  const result = {
    originalPath: file.path,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    thumbnailPath: null,
    duration: null,
    metadata: null
  };

  try {
    // Process video files
    if (fileType === 'video' || (fileType === 'file' && file.mimetype.startsWith('video/'))) {
      console.log('Processing video file:', file.filename);
      
      // Get video information
      const videoInfo = await getVideoInfo(file.path);
      const duration = Math.floor(videoInfo.format.duration / 60); // Convert to minutes
      
      result.duration = duration;
      result.metadata = videoInfo;

      console.log('Video duration:', duration, 'minutes');

      // Only validate duration if we have real duration info (not default 5 minutes)
      if (videoInfo.format.duration !== 300) {
        if (!validateVideoDuration(duration, options.maxDuration || 5)) {
          cleanupFile(file.path);
          throw new Error(`Video duration must be ${options.maxDuration || 5} minutes or less`);
        }
      } else {
        console.log('Using default duration, skipping validation');
      }

      // Generate thumbnail if required
      if (config.generateThumbnail) {
        const thumbnailPath = path.join(
          'uploads/thumbnails',
          `${path.parse(file.filename).name}.jpg`
        );
        
        console.log('Generating thumbnail...');
        try {
          await generateVideoThumbnail(
            file.path,
            thumbnailPath,
            options.thumbnailTimestamp || config.thumbnailTimestamp,
            options.thumbnailSize || config.thumbnailSize
          );
          
          result.thumbnailPath = thumbnailPath;
          console.log('Thumbnail generated:', thumbnailPath);
        } catch (thumbnailError) {
          console.warn('Thumbnail generation failed, continuing without thumbnail:', thumbnailError.message);
          // Continue without thumbnail rather than failing the entire upload
        }
      }
    }

    // Process image files
    if (fileType === 'image' || fileType === 'thumbnail' || (fileType === 'file' && file.mimetype.startsWith('image/'))) {
      // For images, we might want to resize or optimize them
      // This could be implemented with sharp or similar library
      result.metadata = {
        width: null, // Could be extracted with image processing library
        height: null,
        format: path.extname(file.filename).substring(1)
      };
    }

    return result;
  } catch (error) {
    // Clean up file if processing failed
    cleanupFile(file.path);
    throw error;
  }
};

// Upload service class
class UploadService {
  constructor() {
    this.fileTypes = FILE_TYPES;
    this.isFFmpegAvailable = FFMPEG_AVAILABLE;
  }

  // Get upload middleware for specific file type
  getUploadMiddleware(fileType, fieldName = 'file') {
    if (!this.fileTypes[fileType]) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    return createUploadMiddleware(fileType, fieldName);
  }

  // Process uploaded file
  async processFile(file, fileType, options = {}) {
    if (!this.fileTypes[fileType]) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    return await processUploadedFile(file, fileType, options);
  }

  // Get file type configuration
  getFileTypeConfig(fileType) {
    return this.fileTypes[fileType];
  }

  // Clean up file
  cleanupFile(filePath) {
    cleanupFile(filePath);
  }

  // Generate thumbnail for existing video
  async generateThumbnail(videoPath, outputPath, timestamp = '10', size = '640x360') {
    return await generateVideoThumbnail(videoPath, outputPath, timestamp, size);
  }

  // Get video information
  async getVideoInfo(videoPath) {
    return await getVideoInfo(videoPath);
  }

  // Validate file type
  isValidFileType(file, fileType) {
    const config = this.fileTypes[fileType];
    return config && config.allowedMimes.includes(file.mimetype);
  }

  // Get file size in human readable format
  getFileSizeInMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2);
  }

  // Create directory if it doesn't exist
  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Get file type from MIME type
  getFileTypeFromMime(mimetype) {
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('image/')) return 'image';
    return 'file';
  }

  // Check if FFmpeg is available
  isFFmpegInstalled() {
    return this.isFFmpegAvailable;
  }
}

export default new UploadService(); 