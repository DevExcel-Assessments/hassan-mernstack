import fs from 'fs';
import path from 'path';
import Course from '../../models/Course.js';
import Order from '../../models/Order.js';
import VideoCompression from '../../lib/utils/videoCompression.js';

const streamVideoCompressed = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { quality = 'medium' } = req.query;


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

   
    const originalVideoPath = path.resolve(course.videoUrl);

   
    if (!fs.existsSync(originalVideoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

   
    const compressedDir = path.join(process.cwd(), 'uploads', 'compressed-videos', courseId);
    if (!fs.existsSync(compressedDir)) {
      fs.mkdirSync(compressedDir, { recursive: true });
    }

   
    const compressedVideoPath = path.join(compressedDir, `video_${quality}.mp4`);
    const compressedVideoExists = fs.existsSync(compressedVideoPath);

    let videoPath = originalVideoPath;
    let isCompressed = false;

   
    if (!compressedVideoExists) {
      try {
        
        const compressionResult = await VideoCompression.compressVideo(
          originalVideoPath,
          compressedVideoPath,
          quality
        );

        if (compressionResult.success) {
          videoPath = compressedVideoPath;
          isCompressed = true;
        } else {
          console.log(` Compression failed, using original video`);
        }
      } catch (compressionError) {
        console.error(' Video compression error:', compressionError);
      }
    } else {
      videoPath = compressedVideoPath;
      isCompressed = true;
    }

   
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

   
    const headers = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'X-Video-Compressed': isCompressed.toString(),
      'X-Video-Quality': quality
    };

    if (range) {
     
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
      headers['Content-Length'] = chunksize;
      
      res.writeHead(206, headers);
      
      const file = fs.createReadStream(videoPath, { start, end });
      file.pipe(res);
    } else {
      
      headers['Content-Length'] = fileSize;
      res.writeHead(200, headers);
      
      const file = fs.createReadStream(videoPath);
      file.pipe(res);
    }


  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default streamVideoCompressed; 