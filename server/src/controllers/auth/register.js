import { sendVerificationEmail } from '../../lib/utils/helper/emailService.js';
import User from '../../models/User.js';

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'learner'
    });

    const verificationCode = user.setVerificationCode();
    await user.save();

  
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      email: user.email,
      verificationSent: true,
      verificationCode: verificationCode // For development testing
    });

    // Send verification email asynchronously (don't wait for it)
    // Temporarily commented out to test if email is causing the timeout
    /*
    sendVerificationEmail(user.email, verificationCode, user.name)
      .then(() => {
        console.log('Verification email sent successfully to:', email);
      })
      .catch((emailError) => {
        console.error('Email sending failed:', emailError);
      });
    */

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

export default register;