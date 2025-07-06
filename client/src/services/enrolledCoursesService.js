import api from './api';

class EnrolledCoursesService {
  // ========================================
  // ENROLLED COURSES OPERATIONS
  // ========================================

  async getEnrolledCourses() {
    try {
    
      
      const response = await api.get('/orders/enrolled-courses');
      return { success: true, courses: response.data };
    } catch (error) {
      console.error(' EnrolledCoursesService: Request failed:', error);
    
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch enrolled courses'
      };
    }
  }

  async getEnrolledCourseById(courseId) {
    try {
      const response = await api.get(`/orders/enrolled-courses/${courseId}`);
      return { success: true, course: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch enrolled course'
      };
    }
  }

  async isEnrolledInCourse(courseId) {
    try {
      const response = await api.get('/orders/enrolled-courses');
      const enrolledCourses = response.data;
      const isEnrolled = enrolledCourses.some(course => course._id === courseId);
      return { success: true, isEnrolled };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check enrollment status'
      };
    }
  }

  // ========================================
  // COURSE PROGRESS OPERATIONS
  // ========================================

  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/orders/enrolled-courses/${courseId}/progress`);
      return { success: true, progress: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch course progress'
      };
    }
  }

  async updateCourseProgress(courseId, progressData) {
    try {
      const response = await api.post(`/orders/enrolled-courses/${courseId}/progress`, progressData);
      return { success: true, progress: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update course progress'
      };
    }
  }

  async markLessonComplete(courseId, lessonId) {
    try {
      const response = await api.post(`/orders/enrolled-courses/${courseId}/lessons/${lessonId}/complete`);
      return { success: true, result: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark lesson complete'
      };
    }
  }

  // ========================================
  // COURSE ANALYTICS
  // ========================================

  async getLearningStats() {
    try {
      const response = await api.get('/orders/enrolled-courses/stats');
      return { success: true, stats: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch learning stats'
      };
    }
  }

  async getRecentActivity() {
    try {
      const response = await api.get('/orders/enrolled-courses/recent-activity');
      return { success: true, activity: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent activity'
      };
    }
  }

  // ========================================
  // COURSE MANAGEMENT
  // ========================================

  async getCourseNotes(courseId) {
    try {
      const response = await api.get(`/orders/enrolled-courses/${courseId}/notes`);
      return { success: true, notes: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch course notes'
      };
    }
  }

  async saveCourseNote(courseId, noteData) {
    try {
      const response = await api.post(`/orders/enrolled-courses/${courseId}/notes`, noteData);
      return { success: true, note: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save course note'
      };
    }
  }

  async getCourseBookmarks(courseId) {
    try {
      const response = await api.get(`/orders/enrolled-courses/${courseId}/bookmarks`);
      return { success: true, bookmarks: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch course bookmarks'
      };
    }
  }

  async addCourseBookmark(courseId, bookmarkData) {
    try {
      const response = await api.post(`/orders/enrolled-courses/${courseId}/bookmarks`, bookmarkData);
      return { success: true, bookmark: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add course bookmark'
      };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  calculateProgress(completedLessons, totalLessons) {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  }

  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  getEnrollmentDate(orderDate) {
    return new Date(orderDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getLastAccessed(lastAccessed) {
    if (!lastAccessed) return 'Never';
    
    const now = new Date();
    const last = new Date(lastAccessed);
    const diffInDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  getEnrollmentError(error) {
    if (error.response?.status === 401) {
      return 'Please log in to view your enrolled courses.';
    } else if (error.response?.status === 403) {
      return 'You do not have permission to view enrolled courses.';
    } else if (error.response?.status === 404) {
      return 'No enrolled courses found.';
    } else {
      return error.response?.data?.message || 'Failed to load enrolled courses.';
    }
  }
}

export default new EnrolledCoursesService(); 