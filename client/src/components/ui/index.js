// Toast Components
export { default as Toast } from './Toast';
export { default as ToastContainer } from './ToastContainer';

// Loader Components
export { default as Loader } from './Loader';

// Modal Components
export { default as Modal } from './Modal';
export { default as ConfirmationModal } from './ConfirmationModal';
export { default as EmailVerificationModal } from './EmailVerificationModal';

// Utility functions for easy usage
export const showToast = (message, type = 'info', duration = 5000, position = 'top-right') => {
  if (window.showToast) {
    return window.showToast(message, type, duration, position);
  }
  console.warn('Toast system not initialized');
};

export const showSuccessToast = (message, duration = 5000) => {
  return showToast(message, 'success', duration);
};

export const showErrorToast = (message, duration = 5000) => {
  return showToast(message, 'error', duration);
};

export const showWarningToast = (message, duration = 5000) => {
  return showToast(message, 'warning', duration);
};

export const showInfoToast = (message, duration = 5000) => {
  return showToast(message, 'info', duration);
}; 