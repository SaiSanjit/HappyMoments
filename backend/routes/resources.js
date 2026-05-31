const express = require('express');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');

const router = express.Router();

// POST /api/resources/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'email, otp, and newPassword are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const emailRoutes = require('./email');
    const store = emailRoutes.resourceResetOtpStore;

    const key = email.toLowerCase().trim();
    const stored = store.get(key);

    if (!stored || !stored.verified) {
      return res.status(400).json({ success: false, message: 'OTP not verified. Please complete the verification step first.' });
    }

    if (Date.now() > stored.expiresAt) {
      store.delete(key);
      return res.status(400).json({ success: false, message: 'Session expired. Please start over.' });
    }

    // SHA-256 hash to match ResourceAuth.tsx hashPassword()
    const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');

    const { error } = await supabase
      .from('crm_resources')
      .update({ password_hash: newHash })
      .eq('id', stored.resourceId);

    if (error) {
      console.error('❌ resource reset-password DB error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update password' });
    }

    store.delete(key);

    console.log(`✅ Resource password reset for: ${email}`);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ resource reset-password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

module.exports = router;
