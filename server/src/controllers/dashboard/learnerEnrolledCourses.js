import Order from '../../models/Order.js';
import Course from '../../models/Course.js';

const getLearnerEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Order.find({
      user: userId,
      status: 'completed'
    }).populate({
      path: 'course',
      populate: {
        path: 'mentor',
        select: 'name email'
      }
    });

    const enrolledCourses = enrollments.map(enrollment => {
      const course = enrollment.course;
      
      const daysSinceEnrollment = Math.floor(
        (Date.now() - enrollment.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      let progress = Math.min(daysSinceEnrollment * 5, 100); 
      
      if (daysSinceEnrollment > 20) {
        progress = 100;
      }

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        thumbnail: course.thumbnail,
        mentor: course.mentor,
        progress: Math.round(progress),
        isCompleted: progress >= 100,
        enrolledAt: enrollment.createdAt,
        lastAccessed: enrollment.updatedAt || enrollment.createdAt
      };
    });

    enrolledCourses.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));

    res.json({
      success: true,
      courses: enrolledCourses
    });
  } catch (error) {
    console.error('Error fetching learner enrolled courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default getLearnerEnrolledCourses; 