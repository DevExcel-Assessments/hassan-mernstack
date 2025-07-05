import Course from '../../models/Course.js';

const getMentorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ mentor: req.user._id })
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching mentor courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getMentorCourses; 