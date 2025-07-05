# Dynamic Upload System

This directory contains the dynamic upload service that handles file uploads for videos, images, and thumbnails with configurable storage paths and validation.

## Features

- **Multiple File Types**: Support for videos, images, and thumbnails
- **Configurable Storage**: Dynamic directory creation and file naming
- **File Validation**: MIME type and size validation
- **Video Processing**: Automatic thumbnail generation and duration validation
- **Error Handling**: Graceful error handling with file cleanup
- **Flexible Configuration**: Easy to extend and customize

## File Types

### Video Files
- **Allowed Formats**: MP4, AVI, MOV, WMV, WebM
- **Max Size**: 100MB
- **Storage**: `uploads/videos/`
- **Features**: 
  - Automatic thumbnail generation
  - Duration validation (max 5 minutes)
  - Video metadata extraction

### Image Files
- **Allowed Formats**: JPEG, JPG, PNG, WebP, GIF
- **Max Size**: 5MB
- **Storage**: `uploads/images/`
- **Features**: Basic image processing

### Thumbnail Files
- **Allowed Formats**: JPEG, JPG, PNG, WebP
- **Max Size**: 2MB
- **Storage**: `uploads/thumbnails/`
- **Features**: Optimized for thumbnails

## Usage

### Basic Upload

```javascript
import uploadService from '../lib/utils/uploadService.js';

// Get upload middleware for videos
const videoUpload = uploadService.getUploadMiddleware('video', 'video');

// Process uploaded file
const result = await uploadService.processFile(req.file, 'video', {
  maxDuration: 5,
  thumbnailTimestamp: '10',
  thumbnailSize: '640x360'
});
```

### API Endpoints

#### Upload Video
```http
POST /api/upload/video
Content-Type: multipart/form-data

video: [video file]
maxDuration: 5 (optional)
thumbnailTimestamp: 10 (optional)
thumbnailSize: 640x360 (optional)
```

#### Upload Image
```http
POST /api/upload/image
Content-Type: multipart/form-data

image: [image file]
```

#### Upload Thumbnail
```http
POST /api/upload/thumbnail
Content-Type: multipart/form-data

thumbnail: [image file]
```

#### Generate Thumbnail from Video
```http
POST /api/upload/generate-thumbnail
Content-Type: application/json

{
  "videoPath": "uploads/videos/video-123.mp4",
  "timestamp": "10",
  "size": "640x360"
}
```

#### Get File Information
```http
GET /api/upload/info/uploads/videos/video-123.mp4
```

#### Delete File
```http
DELETE /api/upload/uploads/videos/video-123.mp4
```

#### Get Upload Configuration
```http
GET /api/upload/config/video
GET /api/upload/config
```

## Configuration

### File Type Configuration

```javascript
const FILE_TYPES = {
  video: {
    allowedMimes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
    directory: 'uploads/videos',
    generateThumbnail: true,
    thumbnailSize: '640x360',
    thumbnailTimestamp: '10'
  },
  image: {
    allowedMimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 5 * 1024 * 1024, // 5MB
    directory: 'uploads/images',
    generateThumbnail: false
  },
  thumbnail: {
    allowedMimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024, // 2MB
    directory: 'uploads/thumbnails',
    generateThumbnail: false
  }
};
```

### Adding New File Types

1. Add configuration to `FILE_TYPES` object
2. Create corresponding upload middleware
3. Add validation rules
4. Update API routes if needed

## Error Handling

The upload service includes comprehensive error handling:

- **File Type Validation**: Invalid file types are rejected
- **Size Validation**: Files exceeding size limits are rejected
- **Video Duration**: Videos exceeding duration limits are rejected
- **File Cleanup**: Failed uploads are automatically cleaned up
- **Detailed Error Messages**: Clear error messages for debugging

## Dependencies

- `multer`: File upload handling
- `fluent-ffmpeg`: Video processing and thumbnail generation
- `ffmpeg-static`: FFmpeg binaries
- `fs`: File system operations
- `path`: Path manipulation

## Security Features

- **File Type Validation**: Only allowed MIME types are accepted
- **Size Limits**: Prevents large file uploads
- **Directory Traversal Protection**: Secure file paths
- **Authentication Required**: All upload endpoints require authentication
- **File Cleanup**: Automatic cleanup of failed uploads

## Performance Considerations

- **Streaming Uploads**: Large files are streamed to disk
- **Thumbnail Generation**: Asynchronous thumbnail generation
- **File Size Limits**: Prevents memory issues with large files
- **Directory Creation**: Lazy directory creation

## Troubleshooting

### Common Issues

1. **FFmpeg Not Found**: Ensure `ffmpeg-static` is installed
2. **Permission Errors**: Check directory permissions
3. **File Size Limits**: Verify file size configuration
4. **Thumbnail Generation Fails**: Check video format compatibility

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` to get detailed error messages. 