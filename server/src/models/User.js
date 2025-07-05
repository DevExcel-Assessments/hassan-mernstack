import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['mentor', 'learner'],
    default: 'learner'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String
  },
  profilePicture: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: String,
  verificationCodeExpiresAt: Date,
  resetCode: String,
  resetCodeExpiry: Date,
  faceIdEnabled: {
    type: Boolean,
    default: false
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedUntil: Date,
  lastLogin: Date,
  refreshTokens: [{
    token: String,
    expiresAt: Date
  }],
  verificationEmailAttempts: {
    type: Number,
    default: 0
  },
  lastVerificationEmailSent: Date,
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.verifyPassword = async function(password) {
  return await this.comparePassword(password);
};

userSchema.methods.setVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = code;
  this.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return code;
};

userSchema.methods.isVerificationCodeValid = function() {
  return this.verificationCode && 
         this.verificationCodeExpiresAt && 
         new Date() < this.verificationCodeExpiresAt;
};

userSchema.methods.clearVerificationCode = function() {
  this.verificationCode = undefined;
  this.verificationCodeExpiresAt = undefined;
};

userSchema.methods.sendVerificationEmail = async function() {
  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutes ago
  
  if (this.verificationEmailAttempts >= 5) {
    throw new Error('Maximum verification email attempts reached. Please try again later.');
  }
  
  if (this.lastVerificationEmailSent && this.lastVerificationEmailSent > twoMinutesAgo) {
    throw new Error('Please wait 2 minutes before requesting another verification email.');
  }
  
  const verificationCode = this.setVerificationCode();
  
  this.verificationEmailAttempts += 1;
  this.lastVerificationEmailSent = now;
  
  await this.save();
  
  return verificationCode;
};

userSchema.methods.resetVerificationEmailAttempts = function() {
  this.verificationEmailAttempts = 0;
  this.lastVerificationEmailSent = undefined;
};

userSchema.methods.addRefreshToken = function(token) {
  this.refreshTokens.push({
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
};

userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
};

userSchema.methods.isAccountLocked = function() {
  if (!this.isLocked) return false;
  if (this.lockedUntil && new Date() > this.lockedUntil) {
    this.isLocked = false;
    this.lockedUntil = undefined;
    this.failedLoginAttempts = 0;
    return false;
  }
  return true;
};

export default mongoose.model('User', userSchema);