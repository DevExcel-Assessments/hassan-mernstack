import Course from '../../models/Course.js';
import Order from '../../models/Order.js';

const getRecommendedCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const userEnrollments = await Order.find({
      user: userId,
      status: 'completed'
    }).populate('course');

    const userCategories = userEnrollments.map(enrollment => enrollment.course.category);
    const categoryCounts = {};
    userCategories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const userLevels = userEnrollments.map(enrollment => enrollment.course.level);
    const levelCounts = {};
    userLevels.forEach(level => {
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    const preferredCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b, 'web-development'
    );
    const preferredLevel = Object.keys(levelCounts).reduce((a, b) => 
      levelCounts[a] > levelCounts[b] ? a : b, 'beginner'
    );

    const enrolledCourseIds = userEnrollments.map(enrollment => enrollment.course._id);

    const recommendationQuery = {
      _id: { $nin: enrolledCourseIds },
      isPublished: true
    };

    if (Object.keys(categoryCounts).length > 0) {
      recommendationQuery.category = { $in: Object.keys(categoryCounts) };
    }

 
    let recommendedCourses = await Course.find(recommendationQuery)
      .populate('mentor', 'name email')
      .sort({ enrolledStudents: -1, averageRating: -1 })
      .limit(6);

    if (recommendedCourses.length < 6) {
      const additionalCourses = await Course.find({
        _id: { $nin: [...enrolledCourseIds, ...recommendedCourses.map(c => c._id)] },
        isPublished: true
      })
      .populate('mentor', 'name email')
      .sort({ enrolledStudents: -1, averageRating: -1 })
      .limit(6 - recommendedCourses.length);

      recommendedCourses = [...recommendedCourses, ...additionalCourses];
    }

      
    const formattedCourses = recommendedCourses.map(course => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration,
      thumbnail: course.thumbnail,
      mentor: course.mentor,
      enrolledStudents: course.enrolledStudents?.length || 0,
      averageRating: course.averageRating || 0,
      totalReviews: course.totalReviews || 0
    }));

    res.json({
      success: true,
      courses: formattedCourses
    });
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommended courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default getRecommendedCourses; 