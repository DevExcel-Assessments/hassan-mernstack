import Course from '../../models/Course.js';

const getAllCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      level, 
      minPrice, 
      maxPrice,
      sortBy = 'newest',
      tags
    } = req.query;

    const query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (level && ['beginner', 'intermediate', 'advanced'].includes(level)) {
      query.level = level;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortObject = {};
    switch (sortBy) {
      case 'newest':
        sortObject = { createdAt: -1 };
        break;
      case 'oldest':
        sortObject = { createdAt: 1 };
        break;
      case 'price-low':
        sortObject = { price: 1 };
        break;
      case 'price-high':
        sortObject = { price: -1 };
        break;
      case 'popular':
        sortObject = { enrolledStudents: { $size: -1 } };
        break;
      case 'rating':
        sortObject = { averageRating: -1 };
        break;
      default:
        sortObject = { createdAt: -1 };
    }

    const courses = await Course.find(query)
      .populate('mentor', 'name email')
      .sort(sortObject)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Course.countDocuments(query);

    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    const availableCategories = await Course.distinct('category', { isPublished: true });
    const availableLevels = await Course.distinct('level', { isPublished: true });
    const priceRange = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      filters: {
        availableCategories,
        availableLevels,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default getAllCourses; 