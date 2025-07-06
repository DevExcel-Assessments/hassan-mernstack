import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services';
import CourseService from '../services/courseService.js';
import { Clock, User, Star, BookOpen, CheckCircle, DollarSign } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const isMentor = user && course && user._id === course.mentor._id;

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkEnrollment();
    }
  }, [id, user]);


  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/orders/enrolled-courses');
      const enrolledCourses = response.data;
      setIsEnrolled(enrolledCourses.some(c => c._id === id));
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setEnrolling(true);
    try {
      const orderResponse = await api.post('/orders', { courseId: id });
      window.location.href = orderResponse.data.sessionUrl;
    } catch (error) {
      console.error('Error creating order:', error);
      window.showToast('Failed to start payment. Please try again.', 'error');
      setEnrolling(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
     
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {course.level}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 text-lg">{course.description}</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{course.mentor.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{course.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700">{course.averageRating?.toFixed(1) || 'New'}</span>
              </div>
            </div>
          </div>
        </div>

       
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="relative mb-4">
              <img 
                src={course.thumbnail ? CourseService.getThumbnailUrl(course.thumbnail) : '/api/placeholder/400/300'} 
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              {!isEnrolled && !isMentor && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white font-medium">Preview Only</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                <span className="text-sm text-gray-600">{course.enrolledCount} enrolled</span>
              </div>
              
              {isMentor ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <User className="h-5 w-5" />
                    <span className="font-medium">You are the instructor</span>
                  </div>
                  <button className="w-full btn btn-secondary" disabled>
                    Your Course
                  </button>
                </div>
              ) : isEnrolled ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Enrolled</span>
                  </div>
                  <button className="w-full btn btn-success">
                    Continue Learning
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full btn btn-primary"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
         
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
              <ul className="space-y-2">
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

         
          {course.requirements && course.requirements.length > 0 && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

         
          {course.reviews && course.reviews.length > 0 && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="space-y-4">
                {course.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

          
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructor</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{course.mentor.name}</p>
                <p className="text-sm text-gray-600">{course.mentor.email}</p>
              </div>
            </div>
            {course.mentor.bio && (
              <p className="text-gray-700">{course.mentor.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;