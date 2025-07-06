import Course from '../../models/Course.js';
import Review from '../../models/Review.js';

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('mentor', 'name email bio');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reviews = await Review.find({ course: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const courseData = course.toObject();
    courseData.reviews = reviews;

    res.json(courseData);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getCourseById; 