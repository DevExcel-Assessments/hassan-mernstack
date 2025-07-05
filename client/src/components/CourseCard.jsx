import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Star } from 'lucide-react';

const CourseCard = ({ course }) => {
  const { _id, title, description, thumbnail, price, mentor, duration, rating, enrolledCount } = course;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={thumbnail || '/api/placeholder/300/200'} 
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold text-green-600">
          ${price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{mentor?.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{rating?.toFixed(1) || 'New'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{duration} min</span>
          </div>
          <span className="text-sm text-gray-600">{enrolledCount} enrolled</span>
        </div>
        
        <Link 
          to={`/courses/${_id}`}
          className="mt-4 w-full btn btn-primary text-center block"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;