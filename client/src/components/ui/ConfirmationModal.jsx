import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import Modal from './Modal';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = 'red',
  size = 'md',
  showCancelButton = true,
  loading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <X className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getConfirmButtonClasses = () => {
    switch (confirmButtonColor) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'yellow':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500';
      default:
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      showCloseButton={false}
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
    >
      <div className="flex flex-col items-center text-center">
       
        <div className="mb-4">
          {getIcon()}
        </div>

       
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
        )}

       
        {message && (
          <p className="text-sm text-gray-600 mb-6">
            {message}
          </p>
        )}

        
        <div className="flex space-x-3 w-full">
          {showCancelButton && (
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          )}
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonClasses()} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal; 