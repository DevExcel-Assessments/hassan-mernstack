import api from './api';

class VideoService {
  // ========================================
  // VIDEO ACCESS OPERATIONS
  // ========================================

  async getVideoInfo(courseId) {
    try {
      const response = await api.get(`/videos/${courseId}/info`);
      return { success: true, videoInfo: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch video info'
      };
    }
  }

  async checkVideoAccess(courseId) {
    try {
      const response = await api.get(`/videos/${courseId}/access`);
      return { success: true, canAccess: response.data.canAccess };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check video access'
      };
    }
  }

  // ========================================
  // VIDEO STREAMING
  // ========================================

  getVideoStreamUrl(courseId, quality = 'medium') {
    const timestamp = Date.now();
    const token = localStorage.getItem('token');
    return `http://localhost:4000/api/videos/${courseId}/stream-compressed?quality=${quality}&t=${timestamp}&token=${token}`;
  }

  getOriginalVideoStreamUrl(courseId) {
    const timestamp = Date.now();
    const token = localStorage.getItem('token');
    return `http://localhost:4000/api/videos/${courseId}/stream?t=${timestamp}&token=${token}`;
  }

  getVideoUrl(courseId, isPreview = false) {
    const timestamp = Date.now();
    const token = localStorage.getItem('token');
    const previewParam = isPreview ? '&preview=true' : '';
    return `http://localhost:4000/api/videos/${courseId}/stream?t=${timestamp}&token=${token}${previewParam}`;
  }

  async getVideoStream(courseId, quality = 'medium') {
    try {
      const timestamp = Date.now();
      const response = await api.get(`/videos/${courseId}/stream-compressed?quality=${quality}&t=${timestamp}`, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'video/mp4',
        },
      });
      return { success: true, blob: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch video stream'
      };
    }
  }

  async getOriginalVideoStream(courseId) {
    try {
      const timestamp = Date.now();
      const response = await api.get(`/videos/${courseId}/stream?t=${timestamp}`, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'video/mp4',
        },
      });
      return { success: true, blob: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch original video stream'
      };
    }
  }

  getVideoThumbnailUrl(courseId) {
    return `http://localhost:4000/api/videos/${courseId}/thumbnail`;
  }

  // ========================================
  // COURSE ENROLLMENT CHECK
  // ========================================

  async isEnrolledInCourse(courseId) {
    try {
      const response = await api.get('/orders/enrolled-courses');
      const enrolledCourses = response.data;
      return { 
        success: true, 
        isEnrolled: enrolledCourses.some(course => course._id === courseId) 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check enrollment'
      };
    }
  }

  // ========================================
  // VIDEO PROGRESS TRACKING
  // ========================================

  async getVideoProgress(courseId) {
    try {
      const response = await api.get(`/videos/${courseId}/progress`);
      return { success: true, progress: response.data.progress };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch video progress'
      };
    }
  }

  async updateVideoProgress(courseId, progress) {
    try {
      const response = await api.post(`/videos/${courseId}/progress`, { progress });
      return { success: true, progress: response.data.progress };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update video progress'
      };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

  validateVideoUrl(url) {
    if (!url) return false;
    
    // Check if it's a valid video URL
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const hasValidExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));
    
    return hasValidExtension || url.startsWith('/api/videos/');
  }

  getVideoError(error) {
    if (error.response?.status === 401) {
      return 'You must be enrolled in this course to watch the video.';
    } else if (error.response?.status === 403) {
      return 'You do not have permission to access this video.';
    } else if (error.response?.status === 404) {
      return 'Video not found.';
    } else {
      return error.response?.data?.message || 'Failed to load video.';
    }
  }
}

export default new VideoService(); 