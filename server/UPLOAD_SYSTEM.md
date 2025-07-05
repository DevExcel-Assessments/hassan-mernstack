# Upload System Documentation

## Overview

The upload system is a dynamic, configurable file upload service that handles video and image uploads for the course platform. It stores files on disk (not cloud storage) and provides automatic thumbnail generation, file validation, and error handling.

## Features

- ✅ **Dynamic File Type Support**: Configurable for videos, images, and generic files
- ✅ **Automatic Thumbnail Generation**: Creates thumbnails from video files at specified timestamps
- ✅ **File Validation**: Size limits, format validation, and duration checks
- ✅ **Error Handling**: Comprehensive error handling with cleanup
- ✅ **Progress Tracking**: Upload progress monitoring
- ✅ **Disk Storage**: Files stored locally with organized directory structure

## Architecture

### Core Components

1. **Upload Service** (`src/lib/utils/uploadService.js`)
   - Main upload processing logic
   - File validation and processing
   - Thumbnail generation
   - Error handling and cleanup

2. **Upload Controller** (`src/controllers/upload/uploadController.js`)
   - Handles upload requests
   - Processes different file types
   - Returns upload results

3. **Upload Routes** (`src/routes/upload.js`)
   - API endpoints for file uploads
   - Authentication and authorization

4. **Course Integration** (`src/controllers/courses/createCourse.js`)
   - Integrates upload system with course creation
   - Handles video uploads for courses

## Configuration

### File Type Configuration

The system supports multiple file types with specific configurations:

```javascript
const fileTypeConfigs = {
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
    generateThumbnail: true,
    thumbnailTimestamp: '10', // 10 seconds
    thumbnailSize: '640x360',
    maxDuration: 5 * 60 // 5 minutes
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    generateThumbnail: false
  },
  file: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: ['*/*'], // All types
    generateThumbnail: false
  }
};
```

### Directory Structure

```
uploads/
├── videos/
│   ├── course-videos/
│   └── thumbnails/
├── images/
│   ├── profile-pictures/
│   └── course-images/
└── files/
    └── documents/
```

## API Endpoints

### 1. Upload File
```
POST /api/upload/:fileType
```

**Parameters:**
- `fileType`: Type of file (video, image, file)
- `file`: File to upload (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "originalPath": "/uploads/videos/course-videos/filename.mp4",
    "thumbnailPath": "/uploads/videos/thumbnails/filename.jpg",
    "size": 1048576,
    "duration": 120,
    "mimeType": "video/mp4"
  }
}
```

### 2. Course Creation with Video Upload
```
POST /api/courses
```

**Request Body:**
- `title`: Course title
- `description`: Course description
- `category`: Course category
- `price`: Course price
- `level`: Course level (beginner, intermediate, advanced)
- `tags`: Comma-separated tags
- `requirements`: Comma-separated requirements
- `whatYouWillLearn`: Comma-separated learning outcomes
- `video`: Video file (multipart/form-data)

**Response:**
```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "course_id",
    "title": "Course Title",
    "videoUrl": "/uploads/videos/course-videos/filename.mp4",
    "thumbnail": "/uploads/videos/thumbnails/filename.jpg",
    "duration": 120
  },
  "uploadInfo": {
    "videoSize": "1.0 MB",
    "duration": 120,
    "thumbnailGenerated": true
  }
}
```

### 3. Video Streaming
```
GET /api/videos/stream/:courseId
```

**Headers:**
- `Authorization`: Bearer token
- `Range`: Byte range for partial content

**Response:**
- Video stream with proper headers for range requests

### 4. Thumbnail Access
```
GET /api/videos/thumbnail/:courseId
```

**Response:**
- Thumbnail image file

## Usage Examples

### Frontend Course Creation

```javascript
import axios from 'axios';

const createCourse = async (formData) => {
  try {
    const response = await axios.post('/api/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Usage
const formData = new FormData();
formData.append('title', 'My Course');
formData.append('description', 'Course description');
formData.append('video', videoFile);

const result = await createCourse(formData);
```

### Backend File Upload

```javascript
import uploadService from '../lib/utils/uploadService.js';

// Process uploaded file
const uploadResult = await uploadService.processFile(req.file, 'video', {
  maxDuration: 5 * 60, // 5 minutes
  thumbnailTimestamp: '10', // 10 seconds
  thumbnailSize: '640x360'
});

console.log('Upload result:', uploadResult);
```

## Error Handling

The system provides comprehensive error handling:

### Common Errors

1. **File Size Exceeded**
   ```json
   {
     "success": false,
     "message": "File size exceeds maximum limit of 100MB"
   }
   ```

2. **Invalid File Type**
   ```json
   {
     "success": false,
     "message": "Invalid file type. Allowed types: video/mp4, video/avi, video/mov"
   }
   ```

3. **Video Duration Exceeded**
   ```json
   {
     "success": false,
     "message": "Video duration exceeds maximum limit of 5 minutes"
   }
   ```

4. **Thumbnail Generation Failed**
   ```json
   {
     "success": false,
     "message": "Failed to generate thumbnail"
   }
   ```

### Error Recovery

The system automatically cleans up uploaded files when errors occur:

```javascript
try {
  const result = await uploadService.processFile(file, 'video');
  // Process successful upload
} catch (error) {
  // File is automatically cleaned up
  console.error('Upload failed:', error.message);
}
```

## Testing

### Manual Testing

1. **Start the server:**
   ```bash
   cd server
   npm start
   ```

2. **Run the test script:**
   ```bash
   node test-upload.js
   ```

3. **Test with Postman:**
   - Import the Postman collection
   - Use the course creation endpoint
   - Upload a video file

### Test Script Features

The test script (`test-upload.js`) includes:
- Authentication testing
- File upload testing
- Video processing verification
- Thumbnail generation testing
- Video streaming testing
- Thumbnail access testing

## Security Considerations

1. **File Type Validation**: Strict MIME type checking
2. **Size Limits**: Configurable file size restrictions
3. **Authentication**: All upload endpoints require authentication
4. **Authorization**: Course creation requires mentor role
5. **Path Traversal Protection**: Secure file path handling
6. **Cleanup**: Automatic cleanup of failed uploads

## Performance Optimizations

1. **Streaming**: Video files are streamed for efficient delivery
2. **Range Requests**: Support for partial content requests
3. **Thumbnail Caching**: Thumbnails are generated once and cached
4. **Progress Tracking**: Real-time upload progress monitoring
5. **Error Recovery**: Automatic cleanup of failed uploads

## Troubleshooting

### Common Issues

1. **FFmpeg Not Found**
   - Install FFmpeg: `brew install ffmpeg` (macOS) or `apt-get install ffmpeg` (Ubuntu)
   - Ensure FFmpeg is in PATH

2. **Permission Errors**
   - Check upload directory permissions
   - Ensure write access to upload folders

3. **Large File Uploads**
   - Increase server timeout settings
   - Check client-side timeout configurations

4. **Thumbnail Generation Fails**
   - Verify FFmpeg installation
   - Check video file format compatibility
   - Review error logs for specific issues

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=upload:* npm start
```

## Future Enhancements

1. **Cloud Storage Integration**: Support for AWS S3, Google Cloud Storage
2. **Video Processing**: Advanced video editing capabilities
3. **Image Processing**: Automatic image optimization and resizing
4. **CDN Integration**: Content delivery network support
5. **Batch Upload**: Support for multiple file uploads
6. **Video Transcoding**: Multiple quality versions for different devices

## Dependencies

- **multer**: File upload middleware
- **ffmpeg-static**: FFmpeg binaries for video processing
- **fluent-ffmpeg**: FFmpeg wrapper for Node.js
- **fs-extra**: Enhanced file system operations
- **path**: Path manipulation utilities

## License

This upload system is part of the Developer Course Platform project. 