import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseService from '../services/courseService.js';
import { Plus, Edit, Trash2, Users, DollarSign, Play, Eye, AlertCircle } from 'lucide-react';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      console.log('Fetching mentor courses...');
      const result = await CourseService.getMentorCourses();
      console.log('API result:', result);
      
      if (result.success) {
        console.log('Setting courses:', result.courses);
        setCourses(result.courses || []);
      } else {
        console.log('API error:', result.error);
        setError(result.error);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        const result = await CourseService.deleteCourse(courseId);
        if (result.success) {
          setCourses(courses.filter(course => course._id !== courseId));
        } else {
          alert(result.error || 'Failed to delete course');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading your courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
            <p className="text-lg text-gray-600">Manage your courses and track performance</p>
          </div>
          <Link 
            to="/create-course" 
            className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Course</span>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">
                Start sharing your knowledge by creating your first course
              </p>
              <Link 
                to="/create-course" 
                className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Course</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                  {course.thumbnail ? (
                    <img 
                      src={CourseService.getThumbnailUrl(course.thumbnail)} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      CourseService.getStatusBadgeColor(course.isPublished)
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  {/* Course Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledStudents?.length || 0} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{CourseService.formatPrice(course.price)}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {course.category}
                    </span>
                  </div>
                  
                  {/* Course Details */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="capitalize">{course.level}</span>
                    <span>{CourseService.formatDuration(course.duration)}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <Link 
                      to={`/courses/${course._id}`}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Course</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {courses.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {(() => {
                const stats = CourseService.calculateCourseStats(courses);
                return (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCourses}</div>
                      <div className="text-gray-600">Total Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{stats.publishedCourses}</div>
                      <div className="text-gray-600">Published</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalStudents}</div>
                      <div className="text-gray-600">Total Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{CourseService.formatPrice(stats.totalRevenue)}</div>
                      <div className="text-gray-600">Total Revenue</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;