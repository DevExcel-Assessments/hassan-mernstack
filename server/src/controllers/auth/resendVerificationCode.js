import User from "../../models/User.js";
import { sendVerificationEmail } from "../../lib/utils/helper/emailService.js";

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    try {
      const verificationCode = await user.sendVerificationEmail();
      await sendVerificationEmail(user.email, verificationCode, user.name);

      res.json({
        success: true,
        message: 'Verification code sent successfully to your email',
        attemptsRemaining: 5 - user.verificationEmailAttempts
      });
    } catch (emailError) {
      if (emailError.message.includes('Maximum verification email attempts reached')) {
        return res.status(429).json({
          success: false,
          message: 'Maximum verification email attempts reached. Please try again later.',
          attemptsRemaining: 0
        });
      } else if (emailError.message.includes('Please wait 2 minutes')) {
        return res.status(429).json({
          success: false,
          message: 'Please wait 2 minutes before requesting another verification email.',
          attemptsRemaining: 5 - user.verificationEmailAttempts
        });
      } else {
        console.error('Email sending error:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Unable to send verification email. Please try again later.',
          attemptsRemaining: 5 - user.verificationEmailAttempts
        });
      }
    }
  } catch (error) {
    console.error('Resend verification code error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default resendVerificationCode;
