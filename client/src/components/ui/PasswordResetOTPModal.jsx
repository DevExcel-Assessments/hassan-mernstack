import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import Modal from './Modal';
import { showSuccessToast, showErrorToast } from './index';

const PasswordResetOTPModal = ({
  isOpen,
  onClose,
  email,
  onResendCode,
  onVerifyCode,
  verifying = false,
  resendLoading = false,
  devResetCode = null
}) => {
  const [resetCode, setResetCode] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerify = () => {
    if (!resetCode.trim()) {
      setError('Please enter the reset code');
      showErrorToast('Please enter the reset code');
      return;
    }
    
    if (resetCode.length !== 6) {
      setError('Reset code must be 6 digits');
      showErrorToast('Reset code must be 6 digits');
      return;
    }

    setError('');
    onVerifyCode(resetCode);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setError('');
    setCanResend(false);
    setResendTimer(120); // 2 minutes = 120 seconds
    onResendCode();
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setResetCode(value);
    if (error) setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      closeOnBackdrop={false}
      closeOnEscape={false}
    >
      <div className="flex flex-col items-center text-center p-6">
        
        <div className="mb-6">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>

        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Reset Your Password
        </h3>

        
        <p className="text-gray-600 mb-2">
          We've sent a 6-digit reset code to:
        </p>
        <p className="text-lg font-semibold text-gray-900 mb-8 bg-gray-50 px-4 py-2 rounded-lg">
          {email}
        </p>

        
        <div className="w-full mb-6">
          <label htmlFor="resetCode" className="block text-sm font-semibold text-gray-700 mb-3">
            Enter Reset Code
          </label>
          <input
            type="text"
            id="resetCode"
            value={resetCode}
            onChange={handleCodeChange}
            placeholder="000000"
            className="w-full px-6 py-4 text-center text-xl font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
            maxLength={6}
            disabled={verifying}
          />
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        
        <button
          onClick={handleVerify}
          disabled={verifying || resetCode.length !== 6}
          className="w-full mb-6 bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {verifying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Verify Code</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        
        <div className="w-full mb-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-3">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resendLoading || !canResend}
            className="text-gray-900 hover:text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto transition-colors duration-200"
          >
            {resendLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : !canResend ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend in {formatTimer(resendTimer)}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend Code
              </>
            )}
          </button>
        </div>

        
        {verifying && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center text-green-800">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Code verified successfully!</span>
            </div>
          </div>
        )}

        {devResetCode && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Development Mode</p>
                <p className="text-xs text-yellow-700 mb-2">Reset code for testing:</p>
                <div className="bg-yellow-200 px-3 py-2 rounded font-mono text-lg text-center font-bold">
                  {devResetCode}
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  This will be hidden in production
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PasswordResetOTPModal; 