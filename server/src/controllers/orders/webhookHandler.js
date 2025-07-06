import Stripe from 'stripe';
import Order from '../../models/Order.js';
import Course from '../../models/Course.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
   
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
   
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

const handleCheckoutSessionCompleted = async (session) => {
 
  
  try {
   
    const order = await Order.findOne({ stripeSessionId: session.id });
    if (!order) {
     
      return;
    }

   
    if (session.payment_status === 'paid') {
     
      order.status = 'completed';
      order.completedAt = new Date();
      await order.save();

     
      await Course.findByIdAndUpdate(order.course, {
        $addToSet: { enrolledStudents: order.user }
      });

     
    } else {
     
      order.status = 'failed';
      await order.save();
     
    }
  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
};

const handlePaymentIntentSucceeded = async (paymentIntent) => {
 
 
};

const handlePaymentIntentFailed = async (paymentIntent) => {
 
  
  try {
   
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      order.status = 'failed';
      await order.save();
      
    }
  } catch (error) {
    console.error('Error handling failed payment intent:', error);
  }
};

export default handleStripeWebhook; 