import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CourseService from '../services/courseService.js';
import EnrolledCoursesService from '../services/enrolledCoursesService.js';
import { Play, Clock, CheckCircle, AlertCircle, RefreshCw, Star } from 'lucide-react';

const EnrolledCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      
      const result = await EnrolledCoursesService.getEnrolledCourses();
      
      if (result.success) {
        setCourses(result.courses);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(EnrolledCoursesService.getEnrollmentError(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your courses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h2>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="space-x-4">
            <button
              onClick={fetchEnrolledCourses}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
            
            <Link to="/courses" className="btn btn-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="card hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={course.thumbnail ? CourseService.getThumbnailUrl(course.thumbnail) : '/api/placeholder/300/200'} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Enrolled
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{course.duration} min</span>
                  </div>
                  <span className="text-sm text-gray-600">By {course.mentor?.name}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress: 45%</span>
                    <span>3 of 7 lessons</span>
                  </div>
                </div>
                
                <Link 
                  to={`/watch/${course._id}`}
                  className="mt-4 w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Continue Learning</span>
                </Link>
                
                {/* Review Button */}
                <Link 
                  to={`/course/${course._id}`}
                  className="mt-2 w-full btn btn-secondary flex items-center justify-center space-x-2"
                >
                  <Star className="h-4 w-4" />
                  <span>Rate & Review</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;