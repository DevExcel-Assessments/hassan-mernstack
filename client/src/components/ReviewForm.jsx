import React, { useState, useEffect } from 'react';
import { Star, Send, AlertCircle, CheckCircle } from 'lucide-react';
import ReviewService from '../services/reviewService.js';

const ReviewForm = ({ courseId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    checkExistingReview();
  }, [courseId]);

  const checkExistingReview = async () => {
    try {
      const result = await ReviewService.getCourseReviews(courseId);
      if (result.success && result.data.reviews) {
        // Check if current user has already reviewed this course
        const userReview = result.data.reviews.find(review => 
          review.user._id === localStorage.getItem('userId')
        );
        if (userReview) {
          setExistingReview(userReview);
          setRating(userReview.rating);
          setReview(userReview.review);
        }
      }
    } catch (error) {
      console.error('Error checking existing review:', error);
    }
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating) => {
    setHoveredRating(hoveredRating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (review.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    if (review.trim().length > 1000) {
      setError('Review must be less than 1000 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        rating,
        review: review.trim()
      };

      let result;
      if (existingReview) {
        // Update existing review
        result = await ReviewService.updateReview(existingReview._id, reviewData);
      } else {
        // Create new review
        result = await ReviewService.createReview(courseId, reviewData);
      }

      if (result.success) {
        setSuccess(true);
        if (onReviewSubmitted) {
          onReviewSubmitted(result.data.review);
        }
        // Reset form after successful submission
        setTimeout(() => {
          setSuccess(false);
          if (!existingReview) {
            setRating(0);
            setReview('');
          }
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingText = (rating) => {
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating] || 'Select Rating';
  };

  const getRatingColor = (rating) => {
    const colors = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-blue-500',
      5: 'text-green-500'
    };
    return colors[rating] || 'text-gray-400';
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700 font-medium">
            {existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {existingReview ? 'Update Your Review' : 'Write a Review'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={handleRatingLeave}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className={`ml-2 font-medium ${getRatingColor(rating)}`}>
              {getRatingText(rating)}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this course. What did you like? What could be improved? (Minimum 10 characters)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
            maxLength="1000"
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {review.length}/1000 characters
            </span>
            {review.length < 10 && review.length > 0 && (
              <span className="text-xs text-red-500">
                At least 10 characters required
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || rating === 0 || review.trim().length < 10}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>{existingReview ? 'Update Review' : 'Submit Review'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Guidelines */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Review Guidelines:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Be honest and constructive in your feedback</li>
          <li>• Focus on the course content and learning experience</li>
          <li>• Avoid personal attacks or inappropriate language</li>
          <li>• Your review helps other learners make informed decisions</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewForm; 