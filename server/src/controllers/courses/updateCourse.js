import Course from '../../models/Course.js';

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, mentor: req.user._id });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }

    const updates = req.body;
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }

    Object.assign(course, updates);
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('mentor', 'name email');

    res.json({
      message: 'Course updated successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default updateCourse; 