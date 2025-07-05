import Order from '../../models/Order.js';

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('course', 'title description thumbnail price mentor')
      .populate('course.mentor', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default getMyOrders; 