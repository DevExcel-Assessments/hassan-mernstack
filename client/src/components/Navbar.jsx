import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, BookOpen, Plus, PlayCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DevCourse</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">
              Courses
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                
                {user.role === 'mentor' && (
                  <>
                    <Link to="/create-course" className="flex items-center space-x-1 btn btn-primary">
                      <Plus className="h-4 w-4" />
                      <span>Create Course</span>
                    </Link>
                    <Link to="/my-courses" className="text-gray-700 hover:text-blue-600 transition-colors">
                      My Courses
                    </Link>
                  </>
                )}
                
                {user.role === 'learner' && (
                  <Link to="/enrolled-courses" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <PlayCircle className="h-4 w-4" />
                    <span>My Learning</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;