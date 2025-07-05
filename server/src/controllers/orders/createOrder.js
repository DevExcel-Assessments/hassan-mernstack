import Stripe from 'stripe';
import Order from '../../models/Order.js';
import Course from '../../models/Course.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const existingOrder = await Order.findOne({
      user: req.user._id,
      course: courseId,
      status: 'completed'
    });

    if (existingOrder) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        courseId: courseId,
        userId: req.user._id.toString()
      }
    });

    // Create order
    const order = new Order({
      user: req.user._id,
      course: courseId,
      amount: course.price,
      paymentIntentId: paymentIntent.id,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default createOrder; 