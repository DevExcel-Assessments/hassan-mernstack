import fs from 'fs';
import path from 'path';
import Course from '../../models/Course.js';
import Order from '../../models/Order.js';
import { spawn } from 'child_process';

const streamVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { preview } = req.query;


   
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
      if (preview === 'true') {
        
       
        const videoPath = path.resolve(course.videoUrl);
        
        if (!fs.existsSync(videoPath)) {
          return res.status(404).json({ message: 'Video file not found' });
        }

       
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;

       
        const previewSize = Math.min(fileSize, 1024 * 1024); 
        
        res.writeHead(200, {
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Content-Length': previewSize,
          'Content-Disposition': 'inline; filename="preview.mp4"',
          'X-Preview-Mode': 'true',
          'X-Preview-Duration': '10'
        });

       
        const file = fs.createReadStream(videoPath, { 
          start: 0, 
          end: previewSize - 1 
        });
        
        file.pipe(res);
        
        file.on('error', (error) => {
          if (!res.headersSent) {
            res.status(500).json({ message: 'Error streaming video file' });
          }
        });

        return;
      } else {
        return res.status(403).json({ message: 'Access denied. Please enroll in the course first.' });
      }
    }


    const videoPath = path.resolve(course.videoUrl);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

   
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;


    if (range) {
     
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
      
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default streamVideo; 