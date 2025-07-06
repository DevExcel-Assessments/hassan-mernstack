import Course from '../../models/Course.js';
import Order from '../../models/Order.js';

const getMentorRecentCourses = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const now = new Date();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const courses = await Course.find({ mentor: mentorId })
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const coursePerformance = [];

    for (const course of courses) {
      const courseOrders = await Order.find({
        course: course._id,
        status: 'completed'
      });

      const weeklyEnrollments = courseOrders.filter(order => 
        order.createdAt >= startOfWeek
      ).length;

      const weeklyRevenue = courseOrders
        .filter(order => order.createdAt >= startOfWeek)
        .reduce((sum, order) => sum + course.price, 0);

      const monthlyEnrollments = courseOrders.filter(order => 
        order.createdAt >= startOfMonth
      ).length;

      const monthlyRevenue = courseOrders
        .filter(order => order.createdAt >= startOfMonth)
        .reduce((sum, order) => sum + course.price, 0);

      coursePerformance.push({
        _id: course._id,
        title: course.title,
        category: course.category,
        price: course.price,
        isPublished: course.isPublished,
        enrolledStudents: courseOrders.length,
        weeklyEnrollments,
        weeklyRevenue,
        monthlyEnrollments,
        monthlyRevenue,
        createdAt: course.createdAt
      });
    }

    coursePerformance.sort((a, b) => b.weeklyEnrollments - a.weeklyEnrollments);

    res.json({
      success: true,
      courses: coursePerformance
    });
  } catch (error) {
    console.error('Error fetching mentor recent courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent course performance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default getMentorRecentCourses; 