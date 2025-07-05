import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  requestPasswordResetSchema,
  verifyResetCodeSchema,
  resetPasswordSchema
} from '../lib/validations/auth/index.js';
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  logout,
  refreshToken,
  updateProfile,
  changePassword,
  getProfile
} from '../controllers/auth/index.js';

const router = express.Router();


('Register schema being used:', registerSchema.describe());
router.post('/register', register);

router.post('/login', validate(loginSchema), login);

router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);

router.post('/resend-verification', validate(resendVerificationSchema), resendVerificationCode);

router.post('/request-password-reset', validate(requestPasswordResetSchema), requestPasswordReset);
router.post('/verify-reset-code', validate(verifyResetCodeSchema), verifyResetCode);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

router.post('/refresh-token', refreshToken);

router.post('/logout', authenticate, logout);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

router.get('/verify', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
      avatar: req.user.avatar,
      bio: req.user.bio,
      skills: req.user.skills,
      socialLinks: req.user.socialLinks,
      profilePicture: req.user.profilePicture
    }
  });
});

export default router;