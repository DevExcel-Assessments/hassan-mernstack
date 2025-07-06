import api from './api';

class ReviewService {
  // ========================================
  // REVIEW OPERATIONS
  // ========================================

  async getCourseReviews(courseId, params = {}) {
    try {
      const response = await api.get(`/reviews/course/${courseId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch reviews'
      };
    }
  }

  async createReview(courseId, reviewData) {
    try {
      const response = await api.post(`/reviews/course/${courseId}`, reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create review'
      };
    }
  }

  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update review'
      };
    }
  }

  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete review'
      };
    }
  }

  async toggleHelpful(reviewId, helpful) {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`, { helpful });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update helpful status'
      };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  formatRating(rating) {
    return rating ? rating.toFixed(1) : '0.0';
  }

  getRatingText(rating) {
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating] || 'Unknown';
  }

  getRatingColor(rating) {
    const colors = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-blue-500',
      5: 'text-green-500'
    };
    return colors[rating] || 'text-gray-500';
  }

  calculateRatingPercentage(rating, total) {
    if (total === 0) return 0;
    return Math.round((rating / total) * 100);
  }

  validateReviewData(rating, review) {
    const errors = [];

    if (!rating || rating < 1 || rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (!review || review.trim().length < 10) {
      errors.push('Review must be at least 10 characters long');
    }

    if (review && review.trim().length > 1000) {
      errors.push('Review must be less than 1000 characters');
    }

    return errors;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
}

export default new ReviewService(); 