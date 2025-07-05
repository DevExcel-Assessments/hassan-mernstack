import User from '../../models/User.js';
import { generateToken } from '../../lib/utils/helper/generateToken.js';
import sendEmail from '../../lib/utils/helper/sendEmail.js';

const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

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

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = undefined;
    
    user.refreshTokens = [];
    
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default resetPassword;