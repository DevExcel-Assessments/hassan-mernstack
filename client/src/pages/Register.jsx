import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showSuccessToast, showErrorToast } from '../components/ui';
import EmailVerificationModal from '../components/ui/EmailVerificationModal';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { register, verifyEmail, resendVerificationCode } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validatePassword = (password) => {
    return {
      minLength: password.length >= 6
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

   
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      showErrorToast('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const validation = validatePassword(formData.password);
    if (!validation.minLength) {
      setError('Password must be at least 6 characters long');
      showErrorToast('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Remove confirmPassword from the data sent to backend
    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    setLoading(false);
    if (result.success) {
      setRegisteredEmail(result.email);
      setVerificationCode(result?.verificationCode);
      setVerificationOpen(true);
      showSuccessToast('Registration successful! Please check your email for verification code.');
      
     
    } else {
      setError(result.error);
      showErrorToast(result.error);
    }
  };

  const handleVerifyCode = async (code) => {
    setVerifying(true);
    const result = await verifyEmail(registeredEmail, code);
    setVerifying(false);
    if (result.success) {
      setVerificationOpen(false);
      showSuccessToast('Email verified! Welcome to DevCourse.');
      navigate('/dashboard');
    } else {
      showErrorToast(result.error || 'Verification failed');
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    const result = await resendVerificationCode(registeredEmail);
    setResendLoading(false);
    if (result.success) {
      showSuccessToast('Verification code resent! Check your email.');
    } else {
      showErrorToast(result.error || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
       
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join DevCourse
          </h1>
          <p className="text-gray-600 text-lg">
            Start your learning journey today
          </p>
        </div>

       
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
           
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            
           
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
           
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                I want to
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white appearance-none"
                  required
                >
                  <option value="learner">Learn from courses</option>
                  <option value="mentor">Teach and create courses</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
           
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Create a password"
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
              
             
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-medium">Password requirements:</p>
                  <div className="space-y-1">
                    {(() => {
                      const validation = validatePassword(formData.password);
                      return [
                        { label: 'At least 6 characters', valid: validation.minLength }
                      ].map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <div className={`w-2 h-2 rounded-full mr-2 ${req.valid ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className={req.valid ? 'text-green-600' : 'text-gray-500'}>{req.label}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
            
           
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Confirm your password"
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
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

         
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

              
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="text-gray-900 cursor-pointer font-semibold hover:text-gray-700 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

       
        <EmailVerificationModal
          isOpen={verificationOpen}
          onClose={() => setVerificationOpen(false)}
          email={registeredEmail}
          onVerifyCode={handleVerifyCode}
          onResendCode={handleResendCode}
          verifying={verifying}
          resendLoading={resendLoading}
          devVerificationCode={verificationCode}
        />

              
        {verificationOpen && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Development Mode</p>
                <p className="text-xs text-yellow-700 mb-2">Verification code for testing:</p>
                <div className="bg-yellow-200 px-3 py-2 rounded font-mono text-lg text-center font-bold">
                  {verificationCode || 'Check console'}
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  This will be hidden in production
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;