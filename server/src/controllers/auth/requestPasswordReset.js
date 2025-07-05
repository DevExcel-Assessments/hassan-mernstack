import User from '../../models/User.js';
import { sendPasswordResetEmail } from '../../lib/utils/helper/emailService.js';

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: 'If an account with this email exists, a password reset code has been sent.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetCode, user.name);
      
      res.json({
        success: true,
        message: 'If an account with this email exists, a password reset code has been sent.',
        email: user.email,
        resetCode: resetCode
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Unable to send password reset email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default requestPasswordReset;