import React, { useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 5000, position = 'top-right') => {
    return addToast({ message, type, duration, position });
  }, [addToast]);


  React.useEffect(() => {
    window.showToast = showToast;
    window.addToast = addToast;
    window.removeToast = removeToast;
  }, [showToast, addToast, removeToast]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">

      <div className="absolute top-4 right-4 space-y-2">
        {toasts
          .filter(toast => toast.position === 'top-right')
          .map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              position={toast.position}
            />
          ))}
      </div>


      <div className="absolute top-4 left-4 space-y-2">
        {toasts
          .filter(toast => toast.position === 'top-left')
          .map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              position={toast.position}
            />
          ))}
      </div>


      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 space-y-2">
        {toasts
          .filter(toast => toast.position === 'top-center')
          .map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              position={toast.position}
            />
          ))}
      </div>


      <div className="absolute bottom-4 right-4 space-y-2">
        {toasts
          .filter(toast => toast.position === 'bottom-right')
          .map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              position={toast.position}
            />
          ))}
      </div>


      <div className="absolute bottom-4 left-4 space-y-2">
        {toasts
          .filter(toast => toast.position === 'bottom-left')
          .map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              position={toast.position}
            />
          ))}
      </div>

            
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-y-2">
        {toasts
          .filter(toast => toast.position === 'bottom-center')
          .map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              position={toast.position}
            />
          ))}
      </div>
    </div>
  );
};

export default ToastContainer; 