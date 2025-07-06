import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ course: 1, user: 1 }, { unique: true });


reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.filter(h => h.helpful).length;
});


reviewSchema.virtual('notHelpfulCount').get(function() {
  return this.helpful.filter(h => !h.helpful).length;
});


reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });


reviewSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('rating')) {
    try {
      const Course = mongoose.model('Course');
      const Review = mongoose.model('Review');
      
      
      const reviews = await Review.find({ course: this.course });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      
      await Course.findByIdAndUpdate(this.course, {
        rating: Math.round(averageRating * 10) / 10, 
        reviewCount: reviews.length
      });
    } catch (error) {
      console.error('Error updating course rating:', error);
    }
  }
  next();
});


reviewSchema.pre('remove', async function(next) {
  try {
    const Course = mongoose.model('Course');
    const Review = mongoose.model('Review');
    
    
    const reviews = await Review.find({ course: this.course });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    
    await Course.findByIdAndUpdate(this.course, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('Error updating course rating after review deletion:', error);
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review; 