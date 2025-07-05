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

    // Validate required fields
    if (!title || !description || !category || !price) {
      return res.status(400).json({ 
        message: 'Title, description, category, and price are required' 
      });
    }

    // Process the uploaded video using the upload service
    const uploadResult = await uploadService.processFile(req.file, 'video', {
      maxDuration: 5, // 5 minutes max as per README
      thumbnailTimestamp: '10', // Generate thumbnail at 10 seconds as per README
      thumbnailSize: '640x360'
    });

    // Create course with all required fields
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
      thumbnail: uploadResult.thumbnailPath || null, // Handle case where thumbnail is not generated
      duration: uploadResult.duration || 5, // Default to 5 minutes if not available
      isPublished: false // Start as draft, mentor can publish later
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
    
    // Clean up uploaded file if there was an error
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