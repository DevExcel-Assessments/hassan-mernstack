import User from '../../models/User.js';

const verifyResetCode = async (req, res) => {
  try {
    const { email, resetCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetCode || !user.resetCodeExpiry) {
      return res.status(400).json({ success: false, message: 'No reset code found. Please request a new one.' });
    }

    if (new Date() > user.resetCodeExpiry) {
      return res.status(400).json({ success: false, message: 'Reset code has expired. Please request a new one.' });
    }

    if (user.resetCode !== resetCode) {
      return res.status(400).json({ success: false, message: 'Invalid reset code' });
    }

    res.json({
      success: true,
      message: 'Reset code verified successfully',
      email: user.email
    });
  } catch (error) {
    console.error('Reset code verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default verifyResetCode;