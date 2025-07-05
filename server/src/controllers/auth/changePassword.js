import User from '../../models/User.js';

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCurrentPasswordValid = await user.verifyPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({success: false, message: 'Current password is incorrect' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({success: false, message: 'New password must be at least 6 characters long' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({success: false, message: 'New password must be different from current password' });
    }

    user.password = newPassword;
    
    user.refreshTokens = [];
    
    await user.save();

    res.json({
      message: 'Password changed successfully. Please login again with your new password.'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default changePassword; 