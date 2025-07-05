import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Star, Play } from 'lucide-react';

const CourseCard = ({ course }) => {
  const { _id, title, description, thumbnail, price, mentor, duration, rating, enrolledCount } = course;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Play className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
          ${price}
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
            <span className="text-sm text-gray-600">{duration || 0} min</span>
          </div>
          <span className="text-sm text-gray-600">{enrolledCount || 0} enrolled</span>
        </div>
        
        <Link 
          to={`/courses/${_id}`}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center block"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;