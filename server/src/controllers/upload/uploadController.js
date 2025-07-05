import uploadService from '../../lib/utils/uploadService.js';
import path from 'path';
import fs from 'fs';

// Generic upload handler
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Detect file type from MIME type
    const detectedFileType = uploadService.getFileTypeFromMime(req.file.mimetype);
    
    // Process the uploaded file based on detected type
    const result = await uploadService.processFile(req.file, detectedFileType, {
      maxDuration: req.body.maxDuration || 5,
      thumbnailTimestamp: req.body.thumbnailTimestamp || '10',
      thumbnailSize: req.body.thumbnailSize || '640x360'
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: result.filename,
        originalPath: result.originalPath,
        thumbnailPath: result.thumbnailPath,
        size: result.size,
        sizeInMB: uploadService.getFileSizeInMB(result.size),
        mimetype: result.mimetype,
        duration: result.duration,
        metadata: result.metadata,
        detectedFileType: detectedFileType
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
};

// Video upload handler
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No video file uploaded' 
      });
    }

    // Process video with specific options
    const result = await uploadService.processFile(req.file, 'video', {
      maxDuration: parseInt(req.body.maxDuration) || 5,
      thumbnailTimestamp: req.body.thumbnailTimestamp || '10',
      thumbnailSize: req.body.thumbnailSize || '640x360'
    });

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        filename: result.filename,
        videoPath: result.originalPath,
        thumbnailPath: result.thumbnailPath,
        size: result.size,
        sizeInMB: uploadService.getFileSizeInMB(result.size),
        duration: result.duration,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Video upload failed'
    });
  }
};

// Image upload handler
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file uploaded' 
      });
    }

    // Process image
    const result = await uploadService.processFile(req.file, 'image');

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: result.filename,
        imagePath: result.originalPath,
        size: result.size,
        sizeInMB: uploadService.getFileSizeInMB(result.size),
        mimetype: result.mimetype,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Image upload failed'
    });
  }
};

// Thumbnail upload handler
const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No thumbnail file uploaded' 
      });
    }

    // Process thumbnail
    const result = await uploadService.processFile(req.file, 'thumbnail');

    res.json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        filename: result.filename,
        thumbnailPath: result.originalPath,
        size: result.size,
        sizeInMB: uploadService.getFileSizeInMB(result.size),
        mimetype: result.mimetype,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Thumbnail upload failed'
    });
  }
};

// Generate thumbnail from existing video
const generateThumbnail = async (req, res) => {
  try {
    const { videoPath, timestamp = '10', size = '640x360' } = req.body;

    if (!videoPath) {
      return res.status(400).json({
        success: false,
        message: 'Video path is required'
      });
    }

    const thumbnailPath = path.join(
      'uploads/thumbnails',
      `thumbnail-${Date.now()}.jpg`
    );

    await uploadService.generateThumbnail(videoPath, thumbnailPath, timestamp, size);

    res.json({
      success: true,
      message: 'Thumbnail generated successfully',
      data: {
        thumbnailPath: thumbnailPath
      }
    });
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Thumbnail generation failed'
    });
  }
};

// Get file information
const getFileInfo = async (req, res) => {
  try {
    const { filePath } = req.params;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    const stats = fs.statSync(filePath);
    const fileInfo = {
      path: filePath,
      size: stats.size,
      sizeInMB: uploadService.getFileSizeInMB(stats.size),
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };

    // If it's a video file, get additional info
    if (filePath.match(/\.(mp4|avi|mov|wmv|webm)$/i)) {
      try {
        const videoInfo = await uploadService.getVideoInfo(filePath);
        fileInfo.videoInfo = {
          duration: Math.floor(videoInfo.format.duration / 60),
          format: videoInfo.format.format_name,
          bitrate: videoInfo.format.bit_rate
        };
      } catch (error) {
        console.error('Error getting video info:', error);
      }
    }

    res.json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    console.error('File info error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get file information'
    });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { filePath } = req.params;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    uploadService.cleanupFile(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete file'
    });
  }
};

// Get upload configuration
const getUploadConfig = async (req, res) => {
  try {
    const { fileType } = req.params;
    
    if (fileType) {
      const config = uploadService.getFileTypeConfig(fileType);
      if (!config) {
        return res.status(404).json({
          success: false,
          message: `File type '${fileType}' not found`
        });
      }
      
      res.json({
        success: true,
        data: {
          fileType,
          config
        }
      });
    } else {
      // Return all configurations
      res.json({
        success: true,
        data: {
          fileTypes: uploadService.fileTypes
        }
      });
    }
  } catch (error) {
    console.error('Config error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get upload configuration'
    });
  }
};

export {
  uploadFile,
  uploadVideo,
  uploadImage,
  uploadThumbnail,
  generateThumbnail,
  getFileInfo,
  deleteFile,
  getUploadConfig
}; 