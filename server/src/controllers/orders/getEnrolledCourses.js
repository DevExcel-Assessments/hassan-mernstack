import Order from '../../models/Order.js';

const getEnrolledCourses = async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.user._id,
      status: 'completed'
    })
    .populate('course')
    .populate('course.mentor', 'name');

    const courses = orders.map(order => order.course);

    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getEnrolledCourses; 