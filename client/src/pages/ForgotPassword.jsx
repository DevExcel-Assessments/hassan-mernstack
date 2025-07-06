import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showSuccessToast, showErrorToast } from '../components/ui';
import PasswordResetOTPModal from '../components/ui/PasswordResetOTPModal';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devResetCode, setDevResetCode] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      if (result.resetCode) {
        setDevResetCode(result.resetCode);
      } else {
      }
      setOtpModalOpen(true);
      showSuccessToast('Reset code sent to your email!');
    } else {
      setError(result.error);
      showErrorToast(result.error);
    }
  };

  const handleVerifyCode = async (code) => {
    setVerifying(true);
    const result = await verifyResetCode(email, code);
    setVerifying(false);

    if (result.success) {
      setOtpModalOpen(false);
      setStep(3);
      showSuccessToast('Code verified! Set your new password.');
    } else {
      showErrorToast(result.error || 'Verification failed');
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    const result = await requestPasswordReset(email);
    setResendLoading(false);
    
    if (result.success) {
      if (result.resetCode) {
        setDevResetCode(result.resetCode);
      } else {
        console.log('No reset code in response');
        }
      showSuccessToast('Reset code resent! Check your email.');
    } else {
      showErrorToast(result.error || 'Failed to resend code');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      showErrorToast('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      showErrorToast('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await resetPassword(email, devResetCode, newPassword);
    setLoading(false);

    if (result.success) {
      showSuccessToast('Password reset successful! You can now sign in.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      setError(result.error);
      showErrorToast(result.error);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-lg">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 3 && 'Create your new password'}
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-gray-900' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={handleInputChange(setNewPassword)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange(setConfirmPassword)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link 
              to="/login"
              className="text-gray-600 cursor-pointer hover:text-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        <PasswordResetOTPModal
          isOpen={otpModalOpen}
          onClose={() => setOtpModalOpen(false)}
          email={email}
          onVerifyCode={handleVerifyCode}
          onResendCode={handleResendCode}
          verifying={verifying}
          resendLoading={resendLoading}
          devResetCode={devResetCode}
        />

        {otpModalOpen && !devResetCode && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Development Mode</p>
                <p className="text-xs text-yellow-700 mb-2">Reset code not available</p>
                <div className="bg-yellow-200 px-3 py-2 rounded font-mono text-lg text-center font-bold">
                  Check console
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  Backend may not be returning reset code
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 