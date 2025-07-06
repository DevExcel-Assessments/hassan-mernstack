import Review from '../../models/Review.js';

const toggleHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body; 
    const userId = req.user._id;

    if (typeof helpful !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Helpful must be a boolean value'
      });
    }

   
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

   
    const existingMark = review.helpful.find(mark => 
      mark.user.toString() === userId.toString()
    );

    if (existingMark) {
      
      existingMark.helpful = helpful;
    } else {
     
      review.helpful.push({
        user: userId,
        helpful
      });
    }

    await review.save();

    res.json({
      success: true,
      message: `Review marked as ${helpful ? 'helpful' : 'not helpful'}`,
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount
    });

  } catch (error) {
    console.error('Error toggling helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating helpful status'
    });
  }
};

export default toggleHelpful; 