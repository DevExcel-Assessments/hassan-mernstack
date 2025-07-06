import api from './api';

class OrderService {
  // ========================================
  // ORDER CRUD OPERATIONS
  // ========================================

  async createOrder(courseId) {
    try {
      const response = await api.post('/orders', { courseId });
      return { 
        success: true, 
        sessionUrl: response.data.sessionUrl,
        orderId: response.data.orderId 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create order'
      };
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return { success: true, order: response.data.order };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order'
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

  async cancelOrder(orderId) {
    try {
      await api.delete(`/orders/${orderId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel order'
      };
    }
  }

  // ========================================
  // PAYMENT OPERATIONS
  // ========================================

  async confirmPayment(sessionId) {
    try {
      const response = await api.post('/orders/confirm-payment', { sessionId });
      return { success: true, order: response.data.order };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to confirm payment'
      };
    }
  }

  async getPaymentMethods() {
    try {
      const response = await api.get('/orders/payment-methods');
      return { success: true, paymentMethods: response.data.paymentMethods };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch payment methods'
      };
    }
  }

  async savePaymentMethod(paymentMethodData) {
    try {
      const response = await api.post('/orders/payment-methods', paymentMethodData);
      return { success: true, paymentMethod: response.data.paymentMethod };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save payment method'
      };
    }
  }

  async deletePaymentMethod(paymentMethodId) {
    try {
      await api.delete(`/orders/payment-methods/${paymentMethodId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete payment method'
      };
    }
  }

  // ========================================
  // ENROLLMENT OPERATIONS
  // ========================================

  async getEnrolledCourses() {
    try {
      const response = await api.get('/orders/enrolled-courses');
      return { success: true, courses: response.data.courses };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch enrolled courses'
      };
    }
  }

  async isEnrolled(courseId) {
    try {
      const response = await api.get(`/orders/enrolled/${courseId}`);
      return { success: true, isEnrolled: response.data.isEnrolled };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check enrollment'
      };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatOrderStatus(status) {
    const statusMap = {
      'pending': 'Pending',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'failed': 'Failed'
    };
    return statusMap[status] || status;
  }

  getOrderStatusColor(status) {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'failed': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  calculateOrderTotal(order) {
    if (!order || !order.course) return 0;
    return order.course.price || 0;
  }

  getOrderDate(order) {
    if (!order || !order.createdAt) return 'Unknown';
    return new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  validateOrderData(orderData) {
    const errors = {};

    if (!orderData.courseId) {
      errors.courseId = 'Course ID is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default new OrderService(); 