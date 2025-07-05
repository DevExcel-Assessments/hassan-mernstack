import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, BookOpen, Plus, PlayCircle, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">DevCourse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Courses
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                
                {user.role === 'mentor' && (
                  <>
                    <Link 
                      to="/create-course" 
                      className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Course</span>
                    </Link>
                    <Link 
                      to="/my-courses" 
                      className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                    >
                      My Courses
                    </Link>
                  </>
                )}
                
                {user.role === 'learner' && (
                  <Link 
                    to="/enrolled-courses" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>My Learning</span>
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/courses" 
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>

              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {user.role === 'mentor' && (
                    <>
                      <Link 
                        to="/create-course" 
                        className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium w-fit"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Create Course</span>
                      </Link>
                      <Link 
                        to="/my-courses" 
                        className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Courses
                      </Link>
                    </>
                  )}
                  
                  {user.role === 'learner' && (
                    <Link 
                      to="/enrolled-courses" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>My Learning</span>
                    </Link>
                  )}

                  {/* Mobile User Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{user.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors font-medium w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;