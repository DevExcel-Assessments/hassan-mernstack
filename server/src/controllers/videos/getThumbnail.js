import fs from 'fs';
import path from 'path';
import Course from '../../models/Course.js';
import Order from '../../models/Order.js';

const getThumbnail = async (req, res) => {
  try {
    const { courseId } = req.params;

    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    
    const isEnrolled = await Order.findOne({
      user: req.user._id,
      course: courseId,
      status: 'completed'
    });

    const isMentor = course.mentor.toString() === req.user._id.toString();

    if (!isEnrolled && !isMentor) {
      return res.status(403).json({ message: 'Access denied. Please enroll in the course first.' });
    }

    
    const thumbnailPath = path.resolve(course.thumbnail);

    
    if (!fs.existsSync(thumbnailPath)) {
      return res.status(404).json({ message: 'Thumbnail not found' });
    }

    
    const stat = fs.statSync(thumbnailPath);
    const fileSize = stat.size;

    
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000', 
    };
    
    res.writeHead(200, head);
    fs.createReadStream(thumbnailPath).pipe(res);
  } catch (error) {
    console.error('Error serving thumbnail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getThumbnail; 