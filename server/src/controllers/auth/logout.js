import User from '../../models/User.js';

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const user = await User.findOne({
        'refreshTokens.token': refreshToken
      });

      if (user) {
        user.removeRefreshToken(refreshToken);
        await user.save();
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default logout;
