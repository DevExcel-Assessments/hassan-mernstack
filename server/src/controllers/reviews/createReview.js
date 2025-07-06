import Review from '../../models/Review.js';
import Course from '../../models/Course.js';
import Order from '../../models/Order.js';

const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
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

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

   
    const enrollment = await Order.findOne({
      user: userId,
      course: courseId,
      status: 'completed'
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to leave a review'
      });
    }

   
    const existingReview = await Review.findOne({
      course: courseId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

   
    const newReview = new Review({
      course: courseId,
      user: userId,
      rating,
      review
    });

    await newReview.save();

   
    await course.updateRatingDistribution();

   
    await newReview.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

export default createReview; 