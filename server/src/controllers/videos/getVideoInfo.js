import Course from '../../models/Course.js';
import Order from '../../models/Order.js';

const getVideoInfo = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled or is the mentor
    const isEnrolled = await Order.findOne({
      user: req.user._id,
      course: courseId,
      status: 'completed'
    });

    const isMentor = course.mentor.toString() === req.user._id.toString();

    if (!isEnrolled && !isMentor) {
      return res.status(403).json({ message: 'Access denied. Please enroll in the course first.' });
    }

    res.json({
      duration: course.duration,
      thumbnail: course.thumbnail,
      title: course.title,
      canAccess: true
    });
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getVideoInfo; 