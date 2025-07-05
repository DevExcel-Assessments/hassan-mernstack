import User from '../../models/User.js';

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      skills,
      socialLinks,
      avatar,
      profilePicture
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (socialLinks) {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinks
      };
    }
    if (avatar) user.avatar = avatar;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
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
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default updateProfile; 