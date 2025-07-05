import Course from '../../models/Course.js';

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('mentor', 'name email bio')
      .populate('reviews.user', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getCourseById; 