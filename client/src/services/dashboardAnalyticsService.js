import api from './api';

class DashboardAnalyticsService {
  // ========================================
  // REVENUE ANALYTICS
  // ========================================

  async getRevenueData(timeframe = '6months') {
    try {
      const response = await api.get(`/dashboard/analytics/revenue?timeframe=${timeframe}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch revenue data'
      };
    }
  }

  async getRevenueChartData(timeframe = '6months') {
    try {
      const response = await api.get(`/dashboard/analytics/revenue-chart?timeframe=${timeframe}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch revenue chart data'
      };
    }
  }

  // ========================================
  // COURSE PERFORMANCE ANALYTICS
  // ========================================

  async getCoursePerformanceData() {
    try {
      const response = await api.get('/dashboard/analytics/course-performance');
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching course performance data:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch course performance data'
      };
    }
  }

  async getTopPerformingCourses(limit = 5) {
    try {
      const response = await api.get(`/dashboard/analytics/top-courses?limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch top courses'
      };
    }
  }

  // ========================================
  // ENROLLMENT ANALYTICS
  // ========================================

  async getEnrollmentTrends(timeframe = '6weeks') {
    try {
      const response = await api.get(`/dashboard/analytics/enrollment-trends?timeframe=${timeframe}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching enrollment trends:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch enrollment trends'
      };
    }
  }

  async getEnrollmentByCategory() {
    try {
      const response = await api.get('/dashboard/analytics/enrollment-by-category');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch enrollment by category'
      };
    }
  }

  // ========================================
  // STUDENT ENGAGEMENT ANALYTICS
  // ========================================

  async getStudentEngagementData() {
    try {
      const response = await api.get('/dashboard/analytics/student-engagement');
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching student engagement data:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch student engagement data'
      };
    }
  }

  async getStudentRetentionRate() {
    try {
      const response = await api.get('/dashboard/analytics/student-retention');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch retention rate'
      };
    }
  }

  // ========================================
  // GEOGRAPHIC ANALYTICS
  // ========================================

  async getGeographicData() {
    try {
      const response = await api.get('/dashboard/analytics/geographic');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch geographic data'
      };
    }
  }

  // ========================================
  // TIME-BASED ANALYTICS
  // ========================================

  async getHourlyEngagement() {
    try {
      const response = await api.get('/dashboard/analytics/hourly-engagement');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch hourly engagement'
      };
    }
  }

  async getDailyActivity() {
    try {
      const response = await api.get('/dashboard/analytics/daily-activity');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch daily activity'
      };
    }
  }

  // ========================================
  // COMPARATIVE ANALYTICS
  // ========================================

  async getComparativeData(timeframe = 'month') {
    try {
      const response = await api.get(`/dashboard/analytics/comparative?timeframe=${timeframe}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch comparative data'
      };
    }
  }

  async getGrowthMetrics() {
    try {
      const response = await api.get('/dashboard/analytics/growth-metrics');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch growth metrics'
      };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  formatPercentage(value, total) {
    return ((value / total) * 100).toFixed(1);
  }

  calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  }

  getTimeframeOptions() {
    return [
      { value: '7days', label: 'Last 7 Days' },
      { value: '30days', label: 'Last 30 Days' },
      { value: '3months', label: 'Last 3 Months' },
      { value: '6months', label: 'Last 6 Months' },
      { value: '1year', label: 'Last Year' },
    ];
  }

  getChartColors() {
    return {
      primary: 'rgb(59, 130, 246)',
      success: 'rgb(34, 197, 94)',
      warning: 'rgb(245, 158, 11)',
      danger: 'rgb(239, 68, 68)',
      purple: 'rgb(99, 102, 241)',
      pink: 'rgb(236, 72, 153)',
    };
  }

  generateMockData(type, count = 6) {
    const mockData = {
      revenue: Array.from({ length: count }, () => Math.floor(Math.random() * 5000) + 1000),
      enrollments: Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 10),
      ratings: Array.from({ length: count }, () => (Math.random() * 2 + 3).toFixed(1)),
    };

    return mockData[type] || [];
  }
}

export default new DashboardAnalyticsService(); 