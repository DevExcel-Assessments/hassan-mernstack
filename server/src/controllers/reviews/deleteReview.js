import Review from '../../models/Review.js';
import Course from '../../models/Course.js';

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

   
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    const courseId = review.course;

    
    await Review.findByIdAndDelete(reviewId);

   
    const course = await Course.findById(courseId);
    if (course) {
      await course.updateRatingDistribution();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

export default deleteReview; 