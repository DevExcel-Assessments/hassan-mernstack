import Stripe from 'stripe';
import Order from '../../models/Order.js';
import Course from '../../models/Course.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

   
    const course = await Course.findById(courseId).populate('mentor', 'name');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

   
    const existingOrder = await Order.findOne({
      user: req.user._id,
      course: courseId,
      status: 'completed'
    });

    if (existingOrder) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

   
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description,
             
              ...(course.thumbnail && {
                images: [
                 
                  course.thumbnail.startsWith('http') 
                    ? course.thumbnail 
                    : `${process.env.CLIENT_URL || 'http://localhost:5173'}/api${course.thumbnail.replace(/\\/g, '/')}`
                ]
              }),
            },
            unit_amount: Math.round(course.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-confirmation?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-confirmation?canceled=true`,
      metadata: {
        courseId: courseId,
        userId: req.user._id.toString(),
        courseTitle: course.title,
        mentorName: course.mentor.name
      },
      customer_email: req.user.email,
    });

   
    const order = new Order({
      user: req.user._id,
      course: courseId,
      amount: course.price,
      stripeSessionId: session.id,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Checkout session created successfully',
      sessionUrl: session.url,
      orderId: order._id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default createOrder; 