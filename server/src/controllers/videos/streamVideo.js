import fs from 'fs';
import path from 'path';
import Course from '../../models/Course.js';
import Order from '../../models/Order.js';

const streamVideo = async (req, res) => {
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

    // Get video file path
    const videoPath = path.resolve(course.videoUrl);

    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    // Get file stats
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Support for range requests (video seeking)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Send entire file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default streamVideo; 