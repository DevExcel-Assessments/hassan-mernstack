import User from '../../models/User.js';
import { generateToken, generateRefreshToken } from '../../lib/utils/helper/generateToken.js';
import { verifyPassword } from "../../lib/utils/helper/password.js";
import sendEmail from "../../lib/utils/helper/sendEmail.js";
import { emailVerificationHtml } from "../../lib/utils/mailsHtml/verificationEmail.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    if (user.isAccountLocked()) {
      return res.status(423).json({ 
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.' 
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false,
        message: 'Please verify your email before logging in. Check your email for verification code.' 
      });
    }

    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
      
      await user.save();
      
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = undefined;
    user.lastLogin = new Date();
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
      message: 'Login successful',
      token: accessToken,
      refreshToken,
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
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

export default login;
