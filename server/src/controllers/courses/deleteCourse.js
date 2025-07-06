import Course from '../../models/Course.js';
import fs from 'fs';

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, mentor: req.user._id });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }

    
    if (fs.existsSync(course.videoUrl)) {
      fs.unlinkSync(course.videoUrl);
    }
    if (fs.existsSync(course.thumbnail)) {
      fs.unlinkSync(course.thumbnail);
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default deleteCourse; 