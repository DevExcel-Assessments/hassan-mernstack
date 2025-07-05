import User from '../../models/User.js';

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({success: false, message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.socialLinks,
        avatar: user.avatar,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        faceIdEnabled: user.faceIdEnabled,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({success: false, message: 'Server error' });
  }
};

export default getProfile; 