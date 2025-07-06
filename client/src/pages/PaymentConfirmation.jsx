import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    
    if (!authLoading) {
      handlePaymentConfirmation();
    }
  }, [authLoading]);

  const handlePaymentConfirmation = async () => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

   

    if (!user) {
      setStatus('error');
      setMessage('You must be logged in to confirm payment. Please login and try again.');
      return;
    }

    if (canceled === 'true') {
      setStatus('error');
      setMessage('Payment was canceled.');
      return;
    }

    if (success === 'true' && sessionId) {
      try {
        
        const response = await api.post('/orders/confirm-payment', { sessionId });
        
        
        setStatus('success');
        setMessage('Payment confirmed successfully! You are now enrolled in the course.');
        setOrder(response.data.order);
        
        
        setTimeout(() => {
          if (response.data.order?.course) {
            navigate(`/course/${response.data.order.course}`);
          } else {
            navigate('/courses');
          }
        }, 3000);
        
      } catch (error) {
        console.error('❌ Error confirming payment:', error);
        console.error('Error details:', error.response?.data);
        
        setStatus('error');
        setMessage(error.response?.data?.message || 'Payment confirmation failed. Please contact support.');
      }
    } else {
      setStatus('error');
      setMessage('Invalid payment confirmation request.');
    }
  };

  const renderContent = () => {
      
    if (authLoading) {
      return (
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading</h2>
          <p className="text-gray-600">Please wait while we verify your session...</p>
        </div>
      );
    }

    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            
            {order && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-green-800 mb-2">Order Details</h3>
                <div className="text-sm text-green-700">
                  <p>Order ID: {order._id}</p>
                  <p>Amount: ${order.amount}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <span>Redirecting to course...</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            
            <div className="space-y-2">
              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => {
                  setStatus('processing');
                  setMessage('');
                  handlePaymentConfirmation();
                }}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Retry Payment Confirmation
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Courses
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation; 