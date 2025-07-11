import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CourseService from '../services/courseService.js';
import { Clock, User, Star, Play, Eye } from 'lucide-react';

const CourseCard = ({ course, onPreviewClick }) => {
  const { _id, title, description, thumbnail, price, mentor, duration, rating, enrolledCount } = course;
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePreviewClick = () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: '/courses',
          message: 'Please log in to preview this course video.'
        }
      });
      return;
    }
    
    // User is logged in, proceed with preview
    onPreviewClick(course);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          {thumbnail ? (
            <img 
              src={CourseService.getThumbnailUrl(thumbnail)} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Play className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
          {CourseService.formatPrice(price)}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">{mentor?.name || 'Unknown Mentor'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 font-medium">
              {rating ? `${rating.toFixed(1)}` : 'New'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{CourseService.formatDuration(duration)}</span>
          </div>
          <span className="text-sm text-gray-600">{enrolledCount || 0} enrolled</span>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handlePreviewClick}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{user ? 'Preview' : 'Login to Preview'}</span>
          </button>
          <Link 
            to={`/courses/${_id}`}
            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center block"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;