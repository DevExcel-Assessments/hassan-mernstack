import { passwordResetHtml } from '../mailsHtml/passwordResetEmail.js';
import { emailVerificationHtml } from '../mailsHtml/verificationEmail.js';
import sendEmail from './sendEmail.js';


export const sendVerificationEmail = async (email, verificationCode,name) => {
  try {
    const subject = 'Verify Your Email - DevCourse';
    const html = emailVerificationHtml( verificationCode);
    
    const result = await sendEmail({
      email,
      subject,
      html
    });
    return result;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};


export const sendPasswordResetEmail = async (email, resetCode, name) => {
  try {
    const subject = 'Password Reset Request - DevCourse';
    const html = passwordResetHtml( resetCode);
    
    const result = await sendEmail({
      email,
      subject,
      html
    });
    return result;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};


export const sendWelcomeEmail = async (email, name) => {
  try {
    const subject = 'Welcome to DevCourse!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to DevCourse, ${name}!</h2>
        <p>Thank you for joining our learning platform. We're excited to have you on board!</p>
        <p>Start exploring courses and enhance your skills today.</p>
        <p>Best regards,<br>The DevCourse Team</p>
      </div>
    `;
    
    const result = await sendEmail({
      email,
      subject,
      html
    });
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}; 