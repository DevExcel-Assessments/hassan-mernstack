import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CourseService from '../services/courseService.js';
import VideoService from '../services/videoService.js';
import ReviewService from '../services/reviewService.js';
import ReviewForm from '../components/ReviewForm.jsx';
import { ArrowLeft, Play, Pause, Lock, AlertCircle, User, Star, MessageSquare } from 'lucide-react';

const VideoPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [canAccessVideo, setCanAccessVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [videoReady, setVideoReady] = useState(false);

  const isMentor = user && course && user._id === course.mentor._id;

  useEffect(() => {
    fetchCourseAndVideo();
  }, [courseId]);

  const fetchCourseAndVideo = async () => {
    try {

     
      const enrollmentResult = await VideoService.isEnrolledInCourse(courseId);
      if (enrollmentResult.success) {
        setIsEnrolled(enrollmentResult.isEnrolled);
      } else {
      }

     
      const courseResult = await CourseService.getCourseById(courseId);
      if (courseResult.success) {
        setCourse(courseResult.course);
      } else {
        setError(courseResult.error);
        setLoading(false);
        return;
      }

     
      const videoAccessResult = await VideoService.getVideoInfo(courseId);
      if (videoAccessResult.success) {
        const { canAccess } = videoAccessResult.videoInfo;
        setCanAccessVideo(canAccess);
        
        if (canAccess) {
          await loadVideoStream(courseId);
        }
      } else {
        setError(VideoService.getVideoError(videoAccessResult.error));
      }

    } catch (error) {
      setError(VideoService.getVideoError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadVideoStream = async (courseId) => {
    try {
      setVideoLoading(true);

      // Use original video directly
      const directVideoUrl = VideoService.getOriginalVideoStreamUrl(courseId);
      
      // Test the URL accessibility
      const testResponse = await fetch(directVideoUrl, { method: 'HEAD' });
      
      if (!testResponse.ok) {
        throw new Error(`Video URL test failed: ${testResponse.status} ${testResponse.statusText}`);
      }
      
      setVideoUrl(directVideoUrl);
      
    } catch (error) {
      setError(`Failed to load video: ${error.message}`);
    } finally {
      setVideoLoading(false);
    }
  };

  const retryVideoLoad = () => {
    setVideoError('');
    setVideoReady(false);
    loadVideoStream(courseId);
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const result = await ReviewService.getCourseReviews(courseId);
      if (result.success) {
        setReviews(result.data.reviews || []);
        // Check if current user has already reviewed
        const currentUserReview = result.data.reviews?.find(review => 
          review.user._id === user._id
        );
        setUserReview(currentUserReview || null);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setUserReview(newReview);
    setShowReviewForm(false);
    // Reload reviews to update the list
    loadReviews();
  };

  useEffect(() => {
    if (courseId && isEnrolled) {
      loadReviews();
    }
  }, [courseId, isEnrolled]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/enrolled-courses')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Courses</span>
        </button>

        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">{error}</p>
          
          {!isEnrolled && !isMentor && (
            <div className="space-y-4">
              <p className="text-gray-600">You need to enroll in this course to watch the video.</p>
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="btn btn-primary"
              >
                Enroll in Course
              </button>
            </div>
          )}
          
          {isMentor && (
            <div className="space-y-4">
              <p className="text-gray-600">You are the instructor of this course.</p>
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="btn btn-secondary"
              >
                View Course Details
              </button>
            </div>
          )}
          
          <button
            onClick={() => navigate('/enrolled-courses')}
            className="btn btn-secondary mt-4"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
     
      <button
        onClick={() => navigate('/enrolled-courses')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to My Courses</span>
      </button>

     
      <div className="bg-black rounded-lg overflow-hidden relative">
        {canAccessVideo ? (
          videoLoading ? (
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Loading video...</p>
              </div>
            </div>
          ) : videoUrl ? (
            <video
              controls
              className="w-full h-auto"
              poster={course?.thumbnail ? CourseService.getThumbnailUrl(course.thumbnail) : undefined}
              preload="metadata"
              crossOrigin="anonymous"
              onLoadStart={() => console.log('Video load started')}
              onLoadedMetadata={() => console.log('Video metadata loaded')}
              onCanPlay={() => console.log(' Video can play')}
              onError={(e) => {
                console.error(' Video error:', e);
                console.error('Video error details:', e.target.error);
              }}
              onLoad={() => console.log(' Video loaded')}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-xl font-semibold mb-2">Video Error</h3>
                <p className="text-gray-400 mb-4">Failed to load video</p>
                <button
                  onClick={() => loadVideoStream(courseId)}
                  className="btn btn-primary"
                >
                  Retry
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Video Locked</h3>
              <p className="text-gray-400 mb-4">
                {isMentor 
                  ? 'You are the instructor of this course.'
                  : isEnrolled 
                    ? 'Video is currently unavailable.' 
                    : 'Enroll in this course to watch the video.'
                }
              </p>
              {!isEnrolled && !isMentor && (
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="btn btn-primary"
                >
                  Enroll Now
                </button>
              )}
              {isMentor && (
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="btn btn-secondary"
                >
                  View Course Details
                </button>
              )}
            </div>
          </div>
        )}
      </div>

     
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course?.title}</h1>
        <p className="text-gray-600 mb-4">{course?.description}</p>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span>Instructor: {course?.mentor?.name}</span>
          <span>Duration: {course?.duration} minutes</span>
          <span>Category: {course?.category}</span>
        </div>
      </div>

      
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
          <span className="text-sm text-gray-600">Lesson 1 of 1</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: '100%' }}
          ></div>
        </div>
        
        <div className="flex justify-between">
          <button className="btn btn-secondary" disabled>
            Previous Lesson
          </button>
          <button className="btn btn-primary" disabled>
            Next Lesson
          </button>
        </div>
      </div>

      {/* Review Section - Only for enrolled learners */}
      {isEnrolled && !isMentor && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Course Review</span>
            </h3>
            {!showReviewForm && !userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn btn-primary"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                courseId={courseId}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {userReview && !showReviewForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">Your Review</h4>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit Review
                </button>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < userReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-700">
                  {ReviewService.getRatingText(userReview.rating)}
                </span>
              </div>
              <p className="text-blue-800">{userReview.review}</p>
            </div>
          )}

          {/* Other Reviews */}
          {reviews.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Other Reviews ({reviews.length})</h4>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {reviews
                  .filter(review => review.user._id !== user._id) // Exclude current user's review
                  .slice(0, 5) // Show only first 5 reviews
                  .map((review, index) => (
                    <div key={review._id || index} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">{review.user.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.review}</p>
                    </div>
                  ))}
              </div>
              {reviews.length > 5 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing 5 of {reviews.length} reviews
                </p>
              )}
            </div>
          )}

          {reviewsLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading reviews...</p>
            </div>
          )}

          {!reviewsLoading && reviews.length === 0 && !userReview && (
            <div className="text-center py-4">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No reviews yet. Be the first to review this course!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;