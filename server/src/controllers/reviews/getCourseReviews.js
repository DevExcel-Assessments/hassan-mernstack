import Review from '../../models/Review.js';
import Course from '../../models/Course.js';

const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

   
    const query = { course: courseId };
    if (rating && [1, 2, 3, 4, 5].includes(parseInt(rating))) {
      query.rating = parseInt(rating);
    }

   
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOptions = { helpfulCount: -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

   
    const skip = (parseInt(page) - 1) * parseInt(limit);

   
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

   
    const totalReviews = await Review.countDocuments(query);

   
    const ratingDistribution = await Review.aggregate([
      { $match: { course: course._id } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

   
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(item => {
      distribution[item._id] = item.count;
    });

   
    const totalPages = Math.ceil(totalReviews / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      ratingDistribution: distribution,
      courseRating: {
        average: course.rating,
        total: course.reviewCount,
        distribution: course.ratingDistribution
      }
    });

  } catch (error) {
    console.error('Error getting course reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

export default getCourseReviews; 