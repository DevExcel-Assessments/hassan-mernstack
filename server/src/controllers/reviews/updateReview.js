import Review from '../../models/Review.js';
import Course from '../../models/Course.js';

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;

    if (!rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Rating and review are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (review.length < 10 || review.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Review must be between 10 and 1000 characters'
      });
    }

   
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (existingReview.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

   
    existingReview.rating = rating;
    existingReview.review = review;
    await existingReview.save();

   
    const course = await Course.findById(existingReview.course);
    if (course) {
      await course.updateRatingDistribution();
    }

   
    await existingReview.populate('user', 'name avatar');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: existingReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

export default updateReview; 