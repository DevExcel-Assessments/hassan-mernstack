import Course from '../../models/Course.js';
import Order from '../../models/Order.js';

const getMentorStats = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const courses = await Course.find({ mentor: mentorId });
    
    const courseIds = courses.map(course => course._id);
    const orders = await Order.find({ 
      course: { $in: courseIds },
      status: 'completed'
    }).populate('course');

    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    const draftCourses = totalCourses - publishedCourses;

    const totalStudents = new Set(orders.map(order => order.user.toString())).size;

    const totalRevenue = orders.reduce((sum, order) => sum + order.course.price, 0);
    
    const thisMonthOrders = orders.filter(order => 
      order.createdAt >= startOfMonth
    );
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.course.price, 0);

    const thisWeekOrders = orders.filter(order => 
      order.createdAt >= startOfWeek
    );
    const thisWeekRevenue = thisWeekOrders.reduce((sum, order) => sum + order.course.price, 0);

    const lastMonthOrders = await Order.find({
      course: { $in: courseIds },
      status: 'completed',
      createdAt: { $gte: lastMonth, $lt: startOfMonth }
    }).populate('course');
    
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.course.price, 0);
    const monthlyGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentEnrollments = orders.filter(order => 
      order.createdAt >= lastWeek
    ).length;

    res.json({
      success: true,
      stats: {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalStudents,
        totalRevenue,
        thisMonthRevenue,
        thisWeekRevenue,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Error fetching mentor stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default getMentorStats; 