import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error('JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables');
  process.exit(1);
}

export const generateToken = (userId, expiresIn = '7d') => {
  if (!userId) {
    return {
      error: 'User ID is required to generate token'
    };
  }
  try {
    return  jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn })
    
  } catch (error) {
    return {
      error: 'Error generating token'
    };
  }
};

export const generateRefreshToken = (userId) => {
  if (!userId) {
    return {
      error: 'User ID is required to generate refresh token'
    };
  }
  try {
    return  jwt.sign({ _id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
   
  } catch (error) {
    return {
      error: 'Error generating refresh token'
    };
  }
};

export const verifyToken = (token) => {
  try {
    return {
      decoded: jwt.verify(token, JWT_SECRET)
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        error: 'Token has expired'
      };
    }
    return {
      error: 'Invalid token'
    };
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return {
      decoded: jwt.verify(token, REFRESH_TOKEN_SECRET)
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        error: 'Refresh token has expired'
      };
    }
    return {
      error: 'Invalid refresh token'
    };
  }
};
