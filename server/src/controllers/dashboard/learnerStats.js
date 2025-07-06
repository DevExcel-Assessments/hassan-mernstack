import Order from '../../models/Order.js';
import Course from '../../models/Course.js';

const getLearnerStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Order.find({
      user: userId,
      status: 'completed'
    }).populate('course');

    const enrolledCourses = enrollments.length;
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const completedCourses = enrollments.filter(enrollment => 
      enrollment.createdAt < thirtyDaysAgo
    ).length;
    
    const inProgressCourses = enrolledCourses - completedCourses;

    const totalHoursWatched = enrollments.reduce((total, enrollment) => {
      const durationInHours = (enrollment.course.duration || 60) / 60; 
      return total + durationInHours;
    }, 0);

    const averageProgress = enrolledCourses > 0 ? 
      Math.round((completedCourses / enrolledCourses) * 100) : 0;
    
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentEnrollments = enrollments.filter(enrollment => 
      enrollment.createdAt >= lastWeek
    ).length;

    res.json({
      success: true,
      stats: {
        enrolledCourses,
        completedCourses,
        inProgressCourses,
        totalHoursWatched: Math.round(totalHoursWatched * 10) / 10,
        averageProgress,
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Error fetching learner stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learner statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default getLearnerStats; 