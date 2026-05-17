const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// POST /api/customers/reset-password
// Requires a verified OTP from the email reset flow
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'email, otp, and newPassword are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Import the OTP store from email routes
    const emailRoutes = require('./email');
    const store = emailRoutes.customerResetOtpStore;

    const key = email.toLowerCase().trim();
    const stored = store.get(key);

    if (!stored || !stored.verified) {
      return res.status(400).json({ success: false, message: 'OTP not verified. Please complete the verification step first.' });
    }

    if (Date.now() > stored.expiresAt) {
      store.delete(key);
      return res.status(400).json({ success: false, message: 'Session expired. Please start over.' });
    }

    // Update password_hash using btoa (matches existing auth pattern)
    const newHash = Buffer.from(newPassword).toString('base64');

    const { error } = await supabase
      .from('customers')
      .update({ password_hash: newHash })
      .eq('id', stored.customerId);

    if (error) {
      console.error('❌ reset-password DB error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update password' });
    }

    // Clean up the OTP entry
    store.delete(key);

    console.log(`✅ Customer password reset for: ${email}`);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ reset-password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

module.exports = router;
