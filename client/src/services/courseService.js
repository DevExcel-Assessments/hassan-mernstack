import api from './api';

class CourseService {
  // ========================================
  // COURSE CRUD OPERATIONS
  // ======================================== 
  
  async getAllCourses(params = {}) {
    try {
      const response = await api.get('/courses', { params });
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch courses'
      };
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return { success: true, course: response.data.course };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch course'
      };
    }
  }

  async getMentorCourses() {
    try {
      const response = await api.get('/courses/my');
      return { success: true, courses: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch mentor courses'
      };
    }
  }

  async createCourse(courseData, onUploadProgress = null) {
    try {
      const formData = new FormData();
      
      // Add all course data except video
      Object.keys(courseData).forEach(key => {
        if (key !== 'video') {
          formData.append(key, courseData[key]);
        }
      });
      
      // Add video if present
      if (courseData.video) {
        formData.append('video', courseData.video);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Add upload progress callback if provided
      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.post('/courses', formData, config);
      return { success: true, course: response.data.course };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create course'
      };
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      return { success: true, course: response.data.course };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update course'
      };
    }
  }

  async deleteCourse(courseId) {
    try {
      await api.delete(`/courses/${courseId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete course'
      };
    }
  }

  // ========================================
  // VIDEO OPERATIONS
  // ========================================

  async getVideoInfo(courseId) {
    try {
      const response = await api.get(`/videos/${courseId}/info`);
      return { success: true, videoInfo: response.data.videoInfo };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch video info'
      };
    }
  }

  getVideoStreamUrl(courseId) {
    return `/api/videos/${courseId}/stream`;
  }

  getThumbnailUrl(thumbnailPath) {
    // Use the actual thumbnail path from the database
    if (!thumbnailPath) {
      return null; // No thumbnail available
    }
    // Convert relative path to full URL
    return `http://localhost:4000/${thumbnailPath.replace(/\\/g, '/')}`;
  }

  // ========================================
  // COURSE ENROLLMENT
  // ========================================

  async enrollInCourse(courseId) {
    try {
      const response = await api.post('/orders', { course: courseId });
      return { success: true, order: response.data.order };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to enroll in course'
      };
    }
  }

  async getEnrolledCourses() {
    try {
      const response = await api.get('/orders/enrolled');
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch enrolled courses'
      };
    }
  }

  async getMyOrders() {
    try {
      const response = await api.get('/orders/my-orders');
      return { success: true, orders: response.data.orders };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  }

  // ========================================
  // COURSE SEARCH AND FILTERING
  // ========================================

  async searchCourses(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const response = await api.get('/courses/search', { params });
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search courses'
      };
    }
  }

  async getCoursesByCategory(category) {
    try {
      const response = await api.get('/courses', { params: { category } });
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch courses by category'
      };
    }
  }

  async getCoursesByLevel(level) {
    try {
      const response = await api.get('/courses', { params: { level } });
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch courses by level'
      };
    }
  }

  // ========================================
  // COURSE VALIDATION
  // ========================================

  validateCourseData(courseData) {
    const errors = {};

    // Required fields
    if (!courseData.title?.trim()) {
      errors.title = 'Course title is required';
    }

    if (!courseData.description?.trim()) {
      errors.description = 'Course description is required';
    }

    if (!courseData.category) {
      errors.category = 'Course category is required';
    }

    if (!courseData.price || courseData.price < 0) {
      errors.price = 'Valid course price is required';
    }

    if (!courseData.video) {
      errors.video = 'Course video is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  validateVideoFile(file) {
    const errors = {};

    if (!file) {
      errors.file = 'Video file is required';
      return { isValid: false, errors };
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      errors.type = 'Please select a valid video file (MP4, AVI, MOV, WMV, WebM)';
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      errors.size = 'Video file must be less than 100MB';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  formatDuration(minutes) {
    if (!minutes) return '0 min';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  }

  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getLevelBadgeColor(level) {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level] || colors.beginner;
  }

  getStatusBadgeColor(isPublished) {
    return isPublished 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  }

  calculateCourseStats(courses) {
    if (!courses || courses.length === 0) {
      return {
        totalCourses: 0,
        publishedCourses: 0,
        totalStudents: 0,
        totalRevenue: 0
      };
    }

    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.isPublished).length,
      totalStudents: courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0),
      totalRevenue: courses.reduce((sum, c) => sum + (c.price * (c.enrolledStudents?.length || 0)), 0)
    };
  }

  canAccessCourse(course, userId) {
    // Mentor can always access their own courses
    if (course.mentor?._id === userId || course.mentor === userId) {
      return true;
    }
    
    // Check if user is enrolled
    return course.enrolledStudents?.some(student => 
      student._id === userId || student === userId
    );
  }
}

export default new CourseService(); 