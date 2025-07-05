import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CourseService from '../services/courseService.js';
import { Play, Clock, CheckCircle } from 'lucide-react';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get('/api/orders/enrolled-courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading courses...</div>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;