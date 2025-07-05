import Stripe from 'stripe';
import Order from '../../models/Order.js';
import Course from '../../models/Course.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Update order status
    const order = await Order.findOne({ paymentIntentId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();

    // Add user to course enrolled students
    await Course.findByIdAndUpdate(order.course, {
      $addToSet: { enrolledStudents: order.user }
    });

    res.json({
      message: 'Payment confirmed and enrollment completed',
      order
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default confirmPayment; 