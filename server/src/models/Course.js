import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'DevOps',
      'Machine Learning',
      'Cybersecurity'
    ]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: false
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String
  }],
  whatYouWillLearn: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  ratingDistribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

courseSchema.virtual('enrolledCount').get(function() {
  return this.enrolledStudents.length;
});

courseSchema.virtual('formattedRating').get(function() {
  return this.rating ? this.rating.toFixed(1) : '0.0';
});

courseSchema.methods.isUserEnrolled = function(userId) {
  return this.enrolledStudents.includes(userId);
};

courseSchema.methods.updateRatingDistribution = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ course: this._id });
  
  this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    if (this.ratingDistribution[review.rating] !== undefined) {
      this.ratingDistribution[review.rating]++;
    }
  });
  
  await this.save();
};

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

export default mongoose.model('Course', courseSchema);