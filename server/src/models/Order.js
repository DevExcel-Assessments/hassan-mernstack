import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  stripeSessionId: {
    type: String
  },
  paymentMethod: {
    type: String,
    default: 'stripe'
  },
  completedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  }
}, {
  timestamps: true
});

orderSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Order', orderSchema);