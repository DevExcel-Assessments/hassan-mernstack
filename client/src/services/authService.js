import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return { success: true, user, token, refreshToken };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
     
      return { 
        success: true, 
        email: response.data.email, 
        message: response.data.message,
        verificationSent: response.data.verificationSent,
        verificationCode: response.data.verificationCode
      };
    } catch (error) {
   
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  async verifyEmail(email, code) {
    try {
      const response = await api.post('/auth/verify-email', { email, verificationCode:code });
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return { success: true, user, token, refreshToken };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Verification failed'
      };
    }
  }

  async resendVerificationCode(email) {
    try {
      await api.post('/auth/resend-verification', { email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to resend code'
      };
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/request-password-reset', { email });
      return { success: true, resetCode: response.data.resetCode };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  }

  async verifyResetCode(email, code) {
    try {
      await api.post('/auth/verify-reset-code', { email, resetCode: code });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid reset code'
      };
    }
  }


  async resetPassword(email, code, newPassword) {
    try {
      await api.post('/auth/reset-password', { email, resetCode: code, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }


  async changePassword(currentPassword, newPassword) {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password'
      };
    }
  }


  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return { success: true, user: response.data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get profile'
      };
    }
  }


  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return { success: true, user: response.data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  }


  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      return { success: true, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed'
      };
    }
  }


  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }


  isAuthenticated() {
    return !!localStorage.getItem('token');
  }


  getToken() {
    return localStorage.getItem('token');
  }


  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }


  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}

export default new AuthService(); 