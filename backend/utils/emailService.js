const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️  Email configuration not found. Using development mode without email sending.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Platform!</h2>
        <p>Hi ${data.firstName},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.firstName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to Our Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our Platform!</h2>
        <p>Hi ${data.firstName},</p>
        <p>Thank you for verifying your email address! Your account is now active and ready to use.</p>
        <p>You can now log in to your account and start exploring our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.loginUrl}" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Log In Now
          </a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter (no email config), log the email content for development
    if (!transporter) {
      console.log('📧 Development Mode - Email would be sent:');
      console.log('To:', to);
      console.log('Subject:', subject || (template && emailTemplates[template](data)?.subject));
      
      if (template === 'passwordReset' && data.resetUrl) {
        console.log('🔗 Password Reset URL:', data.resetUrl);
      }
      if (template === 'emailVerification' && data.verificationUrl) {
        console.log('🔗 Email Verification URL:', data.verificationUrl);
      }
      
      // Return a mock success response
      return { messageId: 'dev-mode-' + Date.now() };
    }
    
    let emailContent = {};
    
    if (template && emailTemplates[template]) {
      const templateContent = emailTemplates[template](data);
      emailContent = {
        subject: subject || templateContent.subject,
        html: html || templateContent.html
      };
    } else {
      emailContent = {
        subject,
        html,
        text
      };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Our Platform'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      ...emailContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('⚠️  Email configuration not found. Running in development mode.');
      return true;
    }
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  testEmailConfig,
  emailTemplates
};
