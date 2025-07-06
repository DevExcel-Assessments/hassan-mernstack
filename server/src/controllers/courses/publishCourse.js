import Course from '../../models/Course.js';

const publishCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.user._id;

    const course = await Course.findOne({ _id: id, mentor: mentorId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to publish this course'
      });
    }

    if (!course.title || !course.description || !course.videoUrl || !course.price) {
      return res.status(400).json({
        success: false,
        message: 'Course must have title, description, video, and price before publishing'
      });
    }
    
    course.isPublished = true;
    await course.save();

    res.json({
      success: true,
      message: 'Course published successfully',
      course
    });
  } catch (error) {
    console.error('Error publishing course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default publishCourse; 