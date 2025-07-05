# CourseService Documentation

## Overview

The `CourseService` is a comprehensive service class that centralizes all course-related API calls, validation, and utility functions. It provides a clean, maintainable interface for interacting with the course platform backend.

## Features

- ✅ **Centralized API Calls**: All course-related API endpoints
- ✅ **File Upload Handling**: Video uploads with progress tracking
- ✅ **Data Validation**: Client-side validation for forms and files
- ✅ **Utility Functions**: Formatting, calculations, and helper methods
- ✅ **Error Handling**: Consistent error handling across all operations
- ✅ **Authentication**: Automatic token management
- ✅ **Type Safety**: Well-documented methods with clear parameters

## Installation & Usage

```javascript
import CourseService from '../services/courseService.js';
```

## API Methods

### Course CRUD Operations

#### `getAllCourses(params = {})`
Get all available courses (public endpoint).

```javascript
const courses = await CourseService.getAllCourses();
// With filters
const webDevCourses = await CourseService.getAllCourses({ category: 'Web Development' });
```

#### `getCourseById(courseId)`
Get a specific course by ID.

```javascript
const course = await CourseService.getCourseById('course_id_here');
```

#### `getMentorCourses()`
Get courses created by the authenticated mentor.

```javascript
const myCourses = await CourseService.getMentorCourses();
```

#### `createCourse(courseData, onUploadProgress = null)`
Create a new course with video upload.

```javascript
const courseData = {
  title: 'My Course',
  description: 'Course description',
  category: 'Web Development',
  price: 29.99,
  level: 'beginner',
  tags: 'react, javascript',
  requirements: 'Basic HTML',
  whatYouWillLearn: 'Build web apps',
  video: videoFile // File object
};

const result = await CourseService.createCourse(courseData, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

#### `updateCourse(courseId, courseData)`
Update an existing course.

```javascript
const updatedCourse = await CourseService.updateCourse('course_id', {
  title: 'Updated Title',
  price: 39.99
});
```

#### `deleteCourse(courseId)`
Delete a course.

```javascript
await CourseService.deleteCourse('course_id');
```

### Video Operations

#### `getVideoInfo(courseId)`
Get video information for a course.

```javascript
const videoInfo = await CourseService.getVideoInfo('course_id');
// Returns: { duration, thumbnail, title, canAccess }
```

#### `getVideoStreamUrl(courseId)`
Get the video streaming URL.

```javascript
const videoUrl = CourseService.getVideoStreamUrl('course_id');
// Returns: '/api/videos/course_id/stream'
```

#### `getThumbnailUrl(courseId)`
Get the thumbnail URL.

```javascript
const thumbnailUrl = CourseService.getThumbnailUrl('course_id');
// Returns: '/api/videos/course_id/thumbnail'
```

### Course Enrollment

#### `enrollInCourse(courseId)`
Enroll in a course.

```javascript
const enrollment = await CourseService.enrollInCourse('course_id');
```

#### `getEnrolledCourses()`
Get courses the user is enrolled in.

```javascript
const enrolledCourses = await CourseService.getEnrolledCourses();
```

### Search and Filtering

#### `searchCourses(query, filters = {})`
Search courses with filters.

```javascript
const results = await CourseService.searchCourses('react', {
  category: 'Web Development',
  level: 'beginner'
});
```

#### `getCoursesByCategory(category)`
Get courses by category.

```javascript
const webDevCourses = await CourseService.getCoursesByCategory('Web Development');
```

#### `getCoursesByLevel(level)`
Get courses by difficulty level.

```javascript
const beginnerCourses = await CourseService.getCoursesByLevel('beginner');
```

## Validation Methods

### `validateCourseData(courseData)`
Validate course form data.

```javascript
const courseData = {
  title: 'My Course',
  description: 'Description',
  category: 'Web Development',
  price: 29.99,
  video: videoFile
};

const validation = CourseService.validateCourseData(courseData);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

### `validateVideoFile(file)`
Validate video file upload.

```javascript
const validation = CourseService.validateVideoFile(videoFile);
if (!validation.isValid) {
  console.log('File validation errors:', validation.errors);
}
```

## Utility Methods

### `formatDuration(minutes)`
Format duration in a human-readable format.

```javascript
CourseService.formatDuration(90); // "1h 30m"
CourseService.formatDuration(45); // "45 min"
```

### `formatPrice(price)`
Format price with currency.

```javascript
CourseService.formatPrice(29.99); // "$29.99"
CourseService.formatPrice(0); // "$0.00"
```

### `getLevelBadgeColor(level)`
Get CSS classes for level badges.

```javascript
CourseService.getLevelBadgeColor('beginner'); // "bg-green-100 text-green-800"
CourseService.getLevelBadgeColor('advanced'); // "bg-red-100 text-red-800"
```

### `getStatusBadgeColor(isPublished)`
Get CSS classes for status badges.

```javascript
CourseService.getStatusBadgeColor(true); // "bg-green-100 text-green-800"
CourseService.getStatusBadgeColor(false); // "bg-yellow-100 text-yellow-800"
```

### `calculateCourseStats(courses)`
Calculate course statistics.

```javascript
const stats = CourseService.calculateCourseStats(courses);
// Returns: { totalCourses, publishedCourses, totalStudents, totalRevenue }
```

### `canAccessCourse(course, userId)`
Check if user can access a course.

```javascript
const canAccess = CourseService.canAccessCourse(course, userId);
```

## Error Handling

The service includes comprehensive error handling:

```javascript
try {
  const courses = await CourseService.getAllCourses();
} catch (error) {
  console.error('Error:', error.message);
  // Error message is user-friendly and localized
}
```

### Error Types

- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: Invalid or expired tokens
- **Validation Errors**: Invalid data format
- **Permission Errors**: Insufficient access rights
- **Server Errors**: Backend processing issues

## Configuration

### Timeout Settings

```javascript
// Default timeout for uploads (30 seconds)
const courseAPI = axios.create({
  timeout: 30000
});
```

### Authentication

The service automatically handles authentication:

```javascript
// Automatically adds Bearer token to requests
courseAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Usage Examples

### Complete Course Creation Flow

```javascript
import CourseService from '../services/courseService.js';

const createCourse = async (formData, videoFile) => {
  try {
    // Validate course data
    const courseData = { ...formData, video: videoFile };
    const validation = CourseService.validateCourseData(courseData);
    
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors)[0]);
    }
    
    // Create course with progress tracking
    const result = await CourseService.createCourse(courseData, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
    
    console.log('Course created:', result);
    return result;
    
  } catch (error) {
    console.error('Failed to create course:', error.message);
    throw error;
  }
};
```

### Course Management Dashboard

```javascript
const loadDashboard = async () => {
  try {
    // Load mentor's courses
    const courses = await CourseService.getMentorCourses();
    
    // Calculate statistics
    const stats = CourseService.calculateCourseStats(courses);
    
    // Format data for display
    const formattedCourses = courses.map(course => ({
      ...course,
      formattedPrice: CourseService.formatPrice(course.price),
      formattedDuration: CourseService.formatDuration(course.duration),
      statusColor: CourseService.getStatusBadgeColor(course.isPublished)
    }));
    
    return { courses: formattedCourses, stats };
    
  } catch (error) {
    console.error('Failed to load dashboard:', error.message);
    throw error;
  }
};
```

### Course Search with Filters

```javascript
const searchCourses = async (query, filters) => {
  try {
    const results = await CourseService.searchCourses(query, filters);
    
    // Format results for display
    const formattedResults = results.map(course => ({
      ...course,
      formattedPrice: CourseService.formatPrice(course.price),
      formattedDuration: CourseService.formatDuration(course.duration),
      thumbnailUrl: CourseService.getThumbnailUrl(course._id)
    }));
    
    return formattedResults;
    
  } catch (error) {
    console.error('Search failed:', error.message);
    throw error;
  }
};
```

## Best Practices

### 1. Always Handle Errors

```javascript
try {
  const result = await CourseService.createCourse(courseData);
  // Handle success
} catch (error) {
  // Handle error appropriately
  showErrorMessage(error.message);
}
```

### 2. Use Validation Before API Calls

```javascript
const validation = CourseService.validateCourseData(courseData);
if (!validation.isValid) {
  // Show validation errors to user
  return;
}
// Proceed with API call
```

### 3. Implement Progress Tracking for Uploads

```javascript
const handleUpload = async (file) => {
  const onProgress = (progress) => {
    setUploadProgress(progress);
  };
  
  await CourseService.createCourse({ video: file }, onProgress);
};
```

### 4. Use Utility Functions for Consistency

```javascript
// Instead of manual formatting
const price = `$${course.price}`;

// Use service utility
const price = CourseService.formatPrice(course.price);
```

## Dependencies

- **axios**: HTTP client for API calls
- **localStorage**: Token storage
- **FormData**: File upload handling

## Browser Support

- Modern browsers with ES6+ support
- File API support for uploads
- LocalStorage support for token management

## Performance Considerations

- **Caching**: Consider implementing response caching for frequently accessed data
- **Pagination**: Use pagination for large course lists
- **Lazy Loading**: Load course details on demand
- **Image Optimization**: Use appropriate image sizes for thumbnails

## Security

- **Token Management**: Automatic token refresh and cleanup
- **Input Validation**: Client-side validation before API calls
- **Error Sanitization**: User-friendly error messages without sensitive data
- **CORS Handling**: Proper CORS configuration for cross-origin requests 