import { generateToken, generateRefreshToken } from "../../lib/utils/helper/generateToken.js";
import User from "../../models/User.js";

const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    if (!user.isVerificationCodeValid()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.clearVerificationCode();
    user.resetVerificationEmailAttempts();
    await user.save();

    const accessToken = generateToken(user._id, '15m');
    const refreshToken = generateRefreshToken(user._id);

    if (accessToken.error || refreshToken.error) {
      return res.status(500).json({ 
        success: false,
        message: 'Error generating authentication tokens' 
      });
    }

    user.addRefreshToken(refreshToken);
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully. You can now login.',
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        bio: user.bio,
        skills: user.skills,
        socialLinks: user.socialLinks
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default verifyEmail;
