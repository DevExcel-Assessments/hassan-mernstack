import api from './api';

class OrderService {

  async createOrder(courseId) {
    try {
      const response = await api.post('/orders', { courseId });
      return { success: true, order: response.data.order };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create order'
      };
    }
  }


  async confirmPayment(orderId, paymentData) {
    try {
      const response = await api.post(`/orders/${orderId}/confirm-payment`, paymentData);
      return { success: true, order: response.data.order };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to confirm payment'
      };
    }
  }


  async getMyOrders() {
    try {
      const response = await api.get('/orders');
      return { success: true, orders: response.data.orders };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  }


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
}

export default new OrderService(); 