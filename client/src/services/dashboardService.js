import api from './api';

class DashboardService {
  // ========================================
  // MENTOR DASHBOARD DATA
  // ========================================

  async getMentorStats() {
    try {
      const response = await api.get('/dashboard/mentor/stats');
      return { success: true, stats: response.data.stats };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch mentor stats',
        stats: this.getDefaultMentorStats()
      };
    }
  }

  async getMentorRecentCourses() {
    try {
      const response = await api.get('/dashboard/mentor/recent-courses');
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent courses',
        courses: []
      };
    }
  }

  async getMentorRevenue() {
    try {
      const response = await api.get('/dashboard/mentor/revenue');
      return { success: true, revenue: response.data.revenue };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch revenue data',
        revenue: this.getDefaultRevenueData()
      };
    }
  }

  // ========================================
  // LEARNER DASHBOARD DATA
  // ========================================

  async getLearnerStats() {
    try {
      const response = await api.get('/dashboard/learner/stats');
      return { success: true, stats: response.data.stats };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch learner stats',
        stats: this.getDefaultLearnerStats()
      };
    }
  }

  async getLearnerEnrolledCourses() {
    try {
      const response = await api.get('/dashboard/learner/enrolled-courses');
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch enrolled courses',
        courses: []
      };
    }
  }

  async getRecommendedCourses() {
    try {
      const response = await api.get('/dashboard/learner/recommended-courses');
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recommended courses',
        courses: []
      };
    }
  }

  // ========================================
  // DASHBOARD UTILITIES
  // ========================================

  getDefaultMentorStats() {
    return {
      totalCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
      thisMonthRevenue: 0,
      publishedCourses: 0,
      draftCourses: 0,
      recentEnrollments: 0,
      monthlyGrowth: 0
    };
  }

  getDefaultLearnerStats() {
    return {
      enrolledCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalHoursWatched: 0,
      averageProgress: 0,
      recentEnrollments: 0
    };
  }

  getDefaultRevenueData() {
    return {
      total: 0,
      thisMonth: 0,
      thisWeek: 0,
      monthlyGrowth: 0,
      weeklyGrowth: 0
    };
  }

  // ========================================
  // FORMATTING UTILITIES
  // ========================================

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  formatPercentage(value) {
    return `${Math.round(value * 100) / 100}%`;
  }

  formatDuration(minutes) {
    if (!minutes) return '0 min';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  }

  // ========================================
  // CALCULATION UTILITIES
  // ========================================

  calculateProgress(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  // ========================================
  // TIME UTILITIES
  // ========================================

  getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  }

  getRelativeTime(date) {
    const now = new Date();
    const target = new Date(date);
    const diffInDays = Math.floor((now - target) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  // ========================================
  // VALIDATION UTILITIES
  // ========================================

  validateDashboardData(data) {
    const errors = {};

    if (!data) {
      errors.data = 'Dashboard data is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // ========================================
  // CHART DATA UTILITIES
  // ========================================

  prepareChartData(data, type = 'line') {
    if (!data || !Array.isArray(data)) return [];

    switch (type) {
      case 'line':
        return data.map(item => ({
          x: item.date || item.label,
          y: item.value || item.count
        }));
      case 'bar':
        return data.map(item => ({
          label: item.label || item.name,
          value: item.value || item.count
        }));
      case 'pie':
        return data.map(item => ({
          name: item.name || item.label,
          value: item.value || item.count
        }));
      default:
        return data;
    }
  }

  getChartColors(count = 5) {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#06B6D4', // cyan
      '#F97316', // orange
      '#84CC16', // lime
      '#EC4899', // pink
      '#6B7280'  // gray
    ];
    return colors.slice(0, count);
  }
}

export default new DashboardService(); 