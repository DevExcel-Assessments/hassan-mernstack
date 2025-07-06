import Course from '../../models/Course.js';
import Order from '../../models/Order.js';



const getRevenueChartData = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { timeframe = '6months' } = req.query;

    const courses = await Course.find({ mentor: mentorId });
    const courseIds = courses.map(course => course._id);

    const now = new Date();
    let startDate, labels, months;
    
    switch (timeframe) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        months = 0;
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        months = 1;
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        labels = ['Jan', 'Feb', 'Mar'];
        months = 3;
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        months = 6;
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months = 12;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        months = 6;
    }

    const orders = await Order.find({
      course: { $in: courseIds },
      status: 'completed',
      createdAt: { $gte: startDate }
    }).populate('course');

    const revenue = new Array(labels.length).fill(0);
    const enrollments = new Array(labels.length).fill(0);

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      let periodIndex;

      if (timeframe === '7days') {
        periodIndex = orderDate.getDay();
      } else if (timeframe === '30days') {
        const weekDiff = Math.floor((now - orderDate) / (7 * 24 * 60 * 60 * 1000));
        periodIndex = Math.min(3, weekDiff);
      } else {
        const monthDiff = (now.getFullYear() - orderDate.getFullYear()) * 12 + 
                         (now.getMonth() - orderDate.getMonth());
        periodIndex = Math.min(labels.length - 1, months - monthDiff - 1);
      }

      if (periodIndex >= 0 && periodIndex < labels.length) {
        revenue[periodIndex] += order.course.price;
        enrollments[periodIndex]++;
      }
    });

    res.json({
      success: true,
      data: {
        labels,
        revenue,
        enrollments
      }
    });
  } catch (error) {
    console.error('Error fetching revenue chart data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue chart data'
    });
  }
};



const getCoursePerformanceData = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const courses = await Course.find({ mentor: mentorId })
      .populate('mentor', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const coursePerformance = [];

    for (const course of courses) {
      const courseOrders = await Order.find({
        course: course._id,
        status: 'completed'
      });

      const enrollments = courseOrders.length;
      const revenue = enrollments * course.price;
      
        const rating = 4.0 + Math.random() * 1.0; 

      coursePerformance.push({
        title: course.title,
        enrollments,
        revenue,
        rating: parseFloat(rating.toFixed(1))
      });
    }

    coursePerformance.sort((a, b) => b.revenue - a.revenue);
    const topCourses = coursePerformance.slice(0, 5);

    const data = {
      labels: topCourses.map(course => course.title),
      enrollments: topCourses.map(course => course.enrollments),
      revenue: topCourses.map(course => course.revenue),
      ratings: topCourses.map(course => course.rating)
    };

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching course performance data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course performance data'
    });
  }
};



const getEnrollmentTrends = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { timeframe = '6weeks' } = req.query;

    const courses = await Course.find({ mentor: mentorId });
    const courseIds = courses.map(course => course._id);

    const now = new Date();
    let startDate, labels;
    
    switch (timeframe) {
      case '4weeks':
        startDate = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        break;
      case '6weeks':
        startDate = new Date(now.getTime() - 6 * 7 * 24 * 60 * 60 * 1000);
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
        break;
      case '8weeks':
        startDate = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
        break;
      default:
        startDate = new Date(now.getTime() - 6 * 7 * 24 * 60 * 60 * 1000);
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    }

    const orders = await Order.find({
      course: { $in: courseIds },
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const newEnrollments = new Array(labels.length).fill(0);
    const totalEnrollments = new Array(labels.length).fill(0);

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const weekDiff = Math.floor((now - orderDate) / (7 * 24 * 60 * 60 * 1000));
      const weekIndex = Math.min(labels.length - 1, weekDiff);

      if (weekIndex >= 0) {
        newEnrollments[weekIndex]++;
      }
    });

    let cumulative = 0;
    for (let i = labels.length - 1; i >= 0; i--) {
      cumulative += newEnrollments[i];
      totalEnrollments[i] = cumulative;
    }

    res.json({
      success: true,
      data: {
        labels,
        newEnrollments,
        totalEnrollments
      }
    });
  } catch (error) {
    console.error('Error fetching enrollment trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment trends'
    });
  }
};



const getStudentEngagementData = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const courses = await Course.find({ mentor: mentorId });
    const courseIds = courses.map(course => course._id);

    const orders = await Order.find({
      course: { $in: courseIds },
      status: 'completed'
    });

    const totalStudents = new Set(orders.map(order => order.user.toString())).size;
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(order => 
      new Date(order.createdAt) >= thirtyDaysAgo
    );
    const activeStudents = new Set(recentOrders.map(order => order.user.toString())).size;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newOrders = orders.filter(order => 
      new Date(order.createdAt) >= sevenDaysAgo
    );
    const newStudents = new Set(newOrders.map(order => order.user.toString())).size;


    const inactiveStudents = totalStudents - activeStudents;

    const data = {
      labels: ['Active Students', 'Inactive Students', 'New Students'],
      values: [activeStudents, inactiveStudents, newStudents]
    };

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching student engagement data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student engagement data'
    });
  }
};

export {
  getRevenueChartData,
  getCoursePerformanceData,
  getEnrollmentTrends,
  getStudentEngagementData
}; 