import User from '../../models/User.js';
import { generateToken, verifyRefreshToken } from '../../lib/utils/helper/generateToken.js';

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token is required' 
      });
    }

    const tokenResult = verifyRefreshToken(refreshToken);
    if (tokenResult.error) {
      return res.status(401).json({ 
        success: false,
        message: tokenResult.error 
      });
    }

    const user = await User.findOne({
      _id: tokenResult.decoded._id,
      'refreshTokens.token': refreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired refresh token' 
      });
    }

    const newAccessToken = generateToken(user._id, '15m');
    if (newAccessToken.error) {
      return res.status(500).json({ 
        success: false,
        message: 'Error generating new access token' 
      });
    }

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.socialLinks,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during token refresh' 
    });
  }
};

export default refreshToken; 