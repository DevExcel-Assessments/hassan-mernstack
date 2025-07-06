import Course from '../../models/Course.js';

const unpublishCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.user._id;


    const course = await Course.findOne({ _id: id, mentor: mentorId });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to unpublish this course'
      });
    }


    course.isPublished = false;
    await course.save();

    res.json({
      success: true,
      message: 'Course unpublished successfully',
      course
    });
  } catch (error) {
    console.error('Error unpublishing course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unpublish course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default unpublishCourse; 