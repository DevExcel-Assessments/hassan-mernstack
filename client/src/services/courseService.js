import api from './api';

class CourseService {

  async getAllCourses(params = {}) {
    try {
      const response = await api.get('/courses', { params });
      return { success: true, courses: response.data.courses, total: response.data.total };
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
      const response = await api.get('/courses/mentor');
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch mentor courses'
      };
    }
  }


  async createCourse(courseData) {
    try {
      const response = await api.post('/courses', courseData);
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


  async uploadThumbnail(courseId, file) {
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      const response = await api.post(`/courses/${courseId}/thumbnail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, thumbnailUrl: response.data.thumbnailUrl };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload thumbnail'
      };
    }
  }


  async uploadVideo(courseId, file, onProgress) {
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await api.post(`/courses/${courseId}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return { success: true, video: response.data.video };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload video'
      };
    }
  }


  async getVideoInfo(videoId) {
    try {
      const response = await api.get(`/videos/${videoId}/info`);
      return { success: true, video: response.data.video };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get video info'
      };
    }
  }


  getVideoStreamUrl(videoId) {
    return `${api.defaults.baseURL}/videos/${videoId}/stream`;
  }
}

export default new CourseService(); 