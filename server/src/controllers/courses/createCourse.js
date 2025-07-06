import Course from '../../models/Course.js';
import uploadService from '../../lib/utils/uploadService.js';

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
      level = 'beginner',
      tags,
      requirements,
      whatYouWillLearn
    } = req.body;

    if (!title || !description || !category || !price) {
      return res.status(400).json({ 
        message: 'Title, description, category, and price are required' 
      });
    }

    const uploadResult = await uploadService.processFile(req.file, 'video', {
      maxDuration: 5, 
      thumbnailTimestamp: '10', 
      thumbnailSize: '640x360'
    });

    const course = new Course({
      title: title.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      level,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      requirements: requirements ? requirements.split(',').map(req => req.trim()) : [],
      whatYouWillLearn: whatYouWillLearn ? whatYouWillLearn.split(',').map(item => item.trim()) : [],
      mentor: req.user._id,
      videoUrl: uploadResult.originalPath,
      thumbnail: uploadResult.thumbnailPath || null, 
      duration: uploadResult.duration || 5, 
      isPublished: false 
    });

    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('mentor', 'name email');

    res.status(201).json({
      message: 'Course created successfully',
      course: populatedCourse,
      uploadInfo: {
        videoSize: uploadService.getFileSizeInMB(uploadResult.size),
        duration: uploadResult.duration,
        thumbnailGenerated: !!uploadResult.thumbnailPath,
        ffmpegAvailable: uploadService.isFFmpegInstalled()
      }
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
      
    if (req.file && req.file.path) {
      uploadService.cleanupFile(req.file.path);
    }
    
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export default createCourse; 