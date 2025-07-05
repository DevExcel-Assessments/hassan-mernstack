import Course from '../../models/Course.js';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const createCourse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    const {
      title,
      description,
      category,
      price,
      level,
      tags,
      requirements,
      whatYouWillLearn
    } = req.body;

    const videoPath = req.file.path;
    const thumbnailPath = `uploads/thumbnails/${req.file.filename.replace(path.extname(req.file.filename), '.jpg')}`;

    // Create thumbnails directory if it doesn't exist
    const thumbnailDir = path.dirname(thumbnailPath);
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Get video duration and generate thumbnail
    const videoInfo = await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .ffprobe((err, metadata) => {
          if (err) reject(err);
          else resolve(metadata);
        });
    });

    const duration = Math.floor(videoInfo.format.duration / 60); // Convert to minutes

    // Validate video duration (max 5 minutes)
    if (duration > 5) {
      // Clean up uploaded file
      fs.unlinkSync(videoPath);
      return res.status(400).json({ message: 'Video duration must be 5 minutes or less' });
    }

    // Generate thumbnail at 10 seconds
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['10'],
          filename: path.basename(thumbnailPath),
          folder: thumbnailDir,
          size: '640x360'
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Create course
    const course = new Course({
      title,
      description,
      category,
      price: parseFloat(price),
      level,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      requirements: requirements ? requirements.split(',').map(req => req.trim()) : [],
      whatYouWillLearn: whatYouWillLearn ? whatYouWillLearn.split(',').map(item => item.trim()) : [],
      mentor: req.user._id,
      videoUrl: videoPath,
      thumbnail: thumbnailPath,
      duration,
      isPublished: true
    });

    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('mentor', 'name email');

    res.status(201).json({
      message: 'Course created successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export default createCourse; 