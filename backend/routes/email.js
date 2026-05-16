const express = require('express');
const { 
  sendEmail, 
  sendVerificationEmail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail, 
  sendReviewNotificationEmail, 
  sendContactNotificationEmail 
} = require('../services/emailService');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Simple in-memory store for temporary verification tokens
// In production, you might want to use Redis or a database
const tempVerificationStore = new Map();

// Validation middleware
const validateEmail = (req, res, next) => {
  const { to, subject, html } = req.body;
  
  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'to, subject, and html are required'
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address',
      message: 'Please provide a valid email address'
    });
  }

  next();
};

// Send generic email
router.post('/send', validateEmail, async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    console.log(`📧 Sending email to: ${to}`);
    console.log(`📝 Subject: ${subject}`);

    const result = await sendEmail({
      to,
      subject,
      html,
      text
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send email'
    });
  }
});

// Send pre-signup verification email (before account creation)
router.post('/pre-signup-verification', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid email address'
      });
    }

    console.log(`📧 Sending pre-signup verification email to: ${email}`);

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('email, status')
      .eq('email', email)
      .single();

    if (existingCustomer) {
      if (existingCustomer.status === 'verified') {
        return res.status(400).json({
          success: false,
          error: 'Account already exists',
          message: 'An account with this email already exists and is verified.'
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Account already exists',
          message: 'An account with this email already exists but is not verified. Please check your email for the verification link.'
        });
      }
    }

    // Generate a temporary verification token for pre-signup verification
    const tempToken = 'temp_verification_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    
    // Store the temporary verification token with name (expires in 24 hours)
    tempVerificationStore.set(email, {
      token: tempToken,
      name: name || 'User',
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    
    // Create verification link that will redirect back to signup page
    const verificationLink = `http://localhost:8080/customer-signup?verified=true&email=${encodeURIComponent(email)}&token=${encodeURIComponent(tempToken)}`;
    
    const result = await sendVerificationEmail(email, name || 'User', verificationLink);

    if (result.success) {
      res.json({
        success: true,
        message: 'Verification email sent successfully',
        messageId: result.messageId,
        tempToken: tempToken // Send back the temp token for verification
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Pre-signup verification email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send verification email'
    });
  }
});

// Verify pre-signup token
router.post('/verify-pre-signup', async (req, res) => {
  try {
    const { email, token } = req.body;

    // Validation
    if (!email || !token) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'email and token are required'
      });
    }

    console.log(`🔍 Verifying pre-signup token for: ${email}`);

    // Check if token exists in our temporary store
    const storedData = tempVerificationStore.get(email);
    
    if (!storedData) {
      return res.status(404).json({
        success: false,
        error: 'Token not found',
        message: 'Verification token not found or expired.'
      });
    }

    // Check if token has expired
    if (Date.now() > storedData.expiresAt) {
      tempVerificationStore.delete(email);
      return res.status(400).json({
        success: false,
        error: 'Token expired',
        message: 'Verification token has expired. Please request a new verification email.'
      });
    }

    // Verify the token matches
    if (storedData.token !== token) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token',
        message: 'Invalid verification token.'
      });
    }

    // Token is valid - mark email as pre-verified
    storedData.verified = true;
    tempVerificationStore.set(email, storedData);

    console.log(`✅ Pre-signup verification successful for: ${email}`);

    res.json({
      success: true,
      message: 'Email verified successfully',
      email: email,
      name: storedData.name || 'User',
      verified: true
    });

  } catch (error) {
    console.error('❌ Pre-signup verification route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to verify token'
    });
  }
});

// Check pre-signup verification status
router.get('/check-pre-signup/:email', async (req, res) => {
  try {
    const { email } = req.params;

    console.log(`🔍 Checking pre-signup verification status for: ${email}`);

    const storedData = tempVerificationStore.get(email);
    
    if (!storedData) {
      return res.json({
        success: true,
        verified: false,
        message: 'No verification data found'
      });
    }

    // Check if token has expired
    if (Date.now() > storedData.expiresAt) {
      tempVerificationStore.delete(email);
      return res.json({
        success: true,
        verified: false,
        message: 'Verification token expired'
      });
    }

    res.json({
      success: true,
      verified: storedData.verified || false,
      message: storedData.verified ? 'Email is verified' : 'Email not yet verified'
    });

  } catch (error) {
    console.error('❌ Check pre-signup verification route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to check verification status'
    });
  }
});

// Resend verification email (gets token from database)
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid email address'
      });
    }

    console.log(`📧 Resending verification email to: ${email}`);

    // Query database to get the verification token for this email
    const { data: customer, error: dbError } = await supabase
      .from('customers')
      .select('verification_token, full_name, status')
      .eq('email', email)
      .single();

    if (dbError || !customer) {
      console.log(`❌ No customer found for email: ${email}`);
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
        message: 'No account found with this email address. Please sign up first.'
      });
    }

    if (customer.status === 'verified') {
      return res.status(400).json({
        success: false,
        error: 'Already verified',
        message: 'This email address is already verified.'
      });
    }

    if (!customer.verification_token) {
      return res.status(400).json({
        success: false,
        error: 'No verification token',
        message: 'No verification token found for this account. Please contact support.'
      });
    }

    console.log(`✅ Found verification token for ${email}`);
    
    const result = await sendVerificationEmail(email, customer.full_name || 'User', customer.verification_token, 'http://localhost:8080');

    if (result.success) {
      res.json({
        success: true,
        message: 'Verification email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Resend verification email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to resend verification email'
    });
  }
});

// Send verification email
router.post('/send-verification', async (req, res) => {
  try {
    const { email, name, token, baseUrl } = req.body;

    // Validation
    if (!email || !name || !token || !baseUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'email, name, token, and baseUrl are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid email address'
      });
    }

    console.log(`📧 Sending verification email to: ${email}`);
    console.log(`👤 Name: ${name}`);

    const result = await sendVerificationEmail(email, name, token, baseUrl);

    if (result.success) {
      res.json({
        success: true,
        message: 'Verification email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Verification email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send verification email'
    });
  }
});

// Debug endpoint to check verification tokens
router.get('/debug-tokens/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // This would normally query your database
    // For now, just return a mock response
    res.json({
      success: true,
      email: email,
      message: 'Debug endpoint - check your database for verification tokens',
      note: 'Look for verification_token in the customers table for this email'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug endpoint error',
      message: error.message
    });
  }
});

// Test email endpoint (for development)
router.post('/test', async (req, res) => {
  try {
    const testEmail = req.body.email || 'test@example.com';
    
    console.log(`🧪 Sending test email to: ${testEmail}`);

    const result = await sendEmail({
      to: testEmail,
      subject: 'Test Email from HappyMoments API',
      html: `
        <h1>🎉 Test Email Successful!</h1>
        <p>This is a test email from the HappyMoments Email API.</p>
        <p>If you received this email, the email service is working correctly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
      text: `
        Test Email Successful!
        
        This is a test email from the HappyMoments Email API.
        
        If you received this email, the email service is working correctly!
        
        Timestamp: ${new Date().toISOString()}
      `
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
        to: testEmail
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Test email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send test email'
    });
  }
});

// Send welcome email
router.post('/welcome', async (req, res) => {
  try {
    const { email, name, loginLink } = req.body;

    // Validation
    if (!email || !name || !loginLink) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'email, name, and loginLink are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid email address'
      });
    }

    console.log(`📧 Sending welcome email to: ${email}`);

    const result = await sendWelcomeEmail(email, name, loginLink);

    if (result.success) {
      res.json({
        success: true,
        message: 'Welcome email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Welcome email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send welcome email'
    });
  }
});

// Send password reset email
router.post('/password-reset', async (req, res) => {
  try {
    const { email, name, resetLink } = req.body;

    // Validation
    if (!email || !name || !resetLink) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'email, name, and resetLink are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid email address'
      });
    }

    console.log(`📧 Sending password reset email to: ${email}`);

    const result = await sendPasswordResetEmail(email, name, resetLink);

    if (result.success) {
      res.json({
        success: true,
        message: 'Password reset email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Password reset email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send password reset email'
    });
  }
});

// Send review notification email to vendor
router.post('/review-notification', async (req, res) => {
  try {
    const { vendorEmail, vendorName, customerName, reviewText, rating } = req.body;

    // Validation
    if (!vendorEmail || !vendorName || !customerName || !reviewText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'vendorEmail, vendorName, customerName, and reviewText are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vendorEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid vendor email address'
      });
    }

    console.log(`📧 Sending review notification email to vendor: ${vendorEmail}`);

    const result = await sendReviewNotificationEmail(vendorEmail, vendorName, customerName, reviewText, rating);

    if (result.success) {
      res.json({
        success: true,
        message: 'Review notification email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Review notification email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send review notification email'
    });
  }
});

// Send contact form notification email to vendor
router.post('/contact-notification', async (req, res) => {
  try {
    const { vendorEmail, customerName, customerEmail, message, vendorName } = req.body;

    // Validation
    if (!vendorEmail || !customerName || !customerEmail || !message || !vendorName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'vendorEmail, customerName, customerEmail, message, and vendorName are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vendorEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        message: 'Please provide a valid vendor email address'
      });
    }

    console.log(`📧 Sending contact notification email to vendor: ${vendorEmail}`);

    const result = await sendContactNotificationEmail(vendorEmail, customerName, customerEmail, message, vendorName);

    if (result.success) {
      res.json({
        success: true,
        message: 'Contact notification email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Contact notification email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send contact notification email'
    });
  }
});

// ── Vendor Email OTP ────────────────────────────────────────────────────────

// In-memory store for vendor OTPs (10-minute expiry)
const vendorOtpStore = new Map();

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// POST /api/email/send-vendor-otp
router.post('/send-vendor-otp', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const otp = generateOtp();
    vendorOtpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0a0804;border-radius:16px;border:1px solid #2a2218;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#e8d5a3);border-radius:12px;padding:10px 18px;font-weight:900;font-size:18px;color:#070503;letter-spacing:1px;">HM</div>
        </div>
        <h2 style="color:#e8d5a3;font-size:22px;margin:0 0 8px;">Verify your email</h2>
        <p style="color:#8a7a5a;font-size:14px;margin:0 0 28px;">Hi ${name || 'there'}, enter this code to verify your email address for your Happy Moments vendor application.</p>
        <div style="text-align:center;background:#1a1408;border:1px solid #3a2e1a;border-radius:12px;padding:28px;margin-bottom:24px;">
          <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#c9a84c;">${otp}</span>
        </div>
        <p style="color:#5a4e32;font-size:12px;text-align:center;margin:0;">This code expires in <strong style="color:#8a7a5a;">10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `;

    const result = await sendEmail({
      to: email,
      subject: `${otp} — your Happy Moments verification code`,
      html,
      text: `Your Happy Moments vendor verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
    });

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message || 'Failed to send OTP' });
    }

    console.log(`📧 Vendor OTP sent to: ${email}`);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ send-vendor-otp error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// POST /api/email/verify-vendor-otp
router.post('/verify-vendor-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'email and otp are required' });
    }

    const stored = vendorOtpStore.get(email);

    if (!stored) {
      return res.status(404).json({ success: false, message: 'OTP not found. Please request a new code.' });
    }

    if (Date.now() > stored.expiresAt) {
      vendorOtpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code.' });
    }

    if (stored.otp !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }

    vendorOtpStore.delete(email);
    console.log(`✅ Vendor email verified: ${email}`);
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('❌ verify-vendor-otp error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
});

module.exports = router;
