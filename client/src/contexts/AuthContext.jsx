import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { showErrorToast } from '../components/ui';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

     
      if (authService.isAuthenticated()) {
      
        const result = await authService.getProfile();
        if (result.success) {
          setUser(result.user);
        } else {
         
          authService.clearAuth();
          setUser(null);
          showErrorToast('Session expired. Please login again.');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.clearAuth();
      setUser(null);
      showErrorToast('Authentication error. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const result = await authService.register(userData);
      
      if (result.success) {
        return { success: true, email: result.email, message: result.message ,verificationCode:result.verificationCode};
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during registration';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      setError(null);
      const result = await authService.verifyEmail(email, code);
      
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during email verification';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      setError(null);
      const result = await authService.resendVerificationCode(email);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while resending verification code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      const result = await authService.requestPasswordReset(email);
      if (result.success) {
        return { success: true, resetCode: result.resetCode };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while requesting password reset';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      setError(null);
      const result = await authService.verifyResetCode(email, code);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while verifying reset code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      setError(null);
      const result = await authService.resetPassword(email, code, newPassword);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while resetting password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while changing password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while updating profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
     
      authService.clearAuth();
      setUser(null);
      setError(null);
    }
  };

  const refreshUser = async () => {
    try {
      const result = await authService.getProfile();
      if (result.success) {
        setUser(result.user); 
      } else {
        
        await logout();
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      await logout();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    changePassword,
    updateProfile,
    logout,
    refreshUser,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};