const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

const generateSlug = (brandName) => {
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Date.now().toString(36);
};

const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const approvalEmailExistingUserHtml = (name, loginUrl) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0a0804;border-radius:16px;border:1px solid #2a2218;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#c9a84c,#e8d5a3);padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:#070503;letter-spacing:1px;">Happy Moments</span>
      <p style="margin:6px 0 0;font-size:13px;color:#3a2e10;font-weight:600;">Vendor Portal</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#e8d5a3;font-size:22px;margin:0 0 12px;">You're approved! 🎉</h2>
      <p style="color:#8a7a5a;font-size:14px;margin:0 0 24px;">Hi ${name}, your vendor application has been reviewed and approved. You already have a Happy Moments account — use the same credentials to log into your vendor dashboard.</p>
      <div style="text-align:center;">
        <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#e8d5a3);color:#070503;font-weight:800;font-size:14px;padding:14px 32px;border-radius:50px;text-decoration:none;">Log in to Vendor Dashboard</a>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #2a2218;text-align:center;">
      <p style="color:#3a2e1a;font-size:11px;margin:0;">© Happy Moments India · Do not share your credentials.</p>
    </div>
  </div>
`;

const approvalEmailHtml = (name, email, tempPassword, loginUrl) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0a0804;border-radius:16px;border:1px solid #2a2218;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#c9a84c,#e8d5a3);padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:#070503;letter-spacing:1px;">Happy Moments</span>
      <p style="margin:6px 0 0;font-size:13px;color:#3a2e10;font-weight:600;">Vendor Portal</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#e8d5a3;font-size:22px;margin:0 0 12px;">You're approved! 🎉</h2>
      <p style="color:#8a7a5a;font-size:14px;margin:0 0 24px;">Hi ${name}, your vendor application has been reviewed and approved. You can now log into your vendor dashboard.</p>
      <div style="background:#1a1408;border:1px solid #3a2e1a;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#5a4e32;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 12px;">Your login credentials</p>
        <p style="margin:0 0 8px;font-size:14px;color:#c9a84c;"><strong>Email:</strong> <span style="color:#e8d5a3;">${email}</span></p>
        <p style="margin:0;font-size:14px;color:#c9a84c;"><strong>Temp password:</strong> <span style="color:#e8d5a3;letter-spacing:0.1em;">${tempPassword}</span></p>
      </div>
      <p style="color:#5a4e32;font-size:12px;margin:0 0 20px;">Please change your password after your first login.</p>
      <div style="text-align:center;">
        <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#e8d5a3);color:#070503;font-weight:800;font-size:14px;padding:14px 32px;border-radius:50px;text-decoration:none;">Log in to Dashboard</a>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #2a2218;text-align:center;">
      <p style="color:#3a2e1a;font-size:11px;margin:0;">© Happy Moments India · Do not share your credentials.</p>
    </div>
  </div>
`;

const declineEmailHtml = (name, reason) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0a0804;border-radius:16px;border:1px solid #2a2218;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#c9a84c,#e8d5a3);padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:#070503;letter-spacing:1px;">Happy Moments</span>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#e8d5a3;font-size:20px;margin:0 0 12px;">Application Update</h2>
      <p style="color:#8a7a5a;font-size:14px;margin:0 0 20px;">Hi ${name}, thank you for applying to join the Happy Moments vendor network.</p>
      <p style="color:#8a7a5a;font-size:14px;margin:0 0 16px;">After reviewing your application, we're unable to approve it at this time.</p>
      ${reason ? `<div style="background:#1a1408;border:1px solid #3a2e1a;border-radius:12px;padding:16px;margin-bottom:20px;"><p style="color:#5a4e32;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 8px;">Reason</p><p style="color:#c9a84c;font-size:14px;margin:0;">${reason}</p></div>` : ''}
      <p style="color:#5a4e32;font-size:13px;margin:0;">You're welcome to re-apply after addressing the above. If you have questions, reply to this email.</p>
    </div>
  </div>
`;

// GET /api/admin/pending-applications
router.get('/pending-applications', async (_req, res) => {
  try {
    const db = supabaseAdmin ?? supabase;
    const { data, error } = await db
      .from('vendor_applications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, applications: data });
  } catch (error) {
    console.error('❌ pending-applications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// POST /api/admin/approve-vendor
router.post('/approve-vendor', async (req, res) => {
  const { application_id, reviewed_by = 'admin' } = req.body;

  if (!application_id) {
    return res.status(400).json({ success: false, message: 'application_id is required' });
  }

  try {
    const db = supabaseAdmin ?? supabase;

    // 1. Fetch the application
    const { data: app, error: fetchError } = await db
      .from('vendor_applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (fetchError || !app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (app.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application is already ${app.status}` });
    }

    // 2. Create Supabase Auth user (via admin client)
    const tempPassword = generateTempPassword();
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Admin auth client not configured. Set SUPABASE_SERVICE_ROLE_KEY.' });
    }

    // Check if auth user already exists
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = userList?.users?.find(u => u.email === app.email);

    const isExistingUser = !!existingAuthUser;

    if (!existingAuthUser) {
      const { error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: app.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { brand_name: app.brand_name, spoc_name: app.spoc_name },
      });
      if (authError) throw new Error(`Auth user creation failed: ${authError.message}`);
    } else {
      // User already has an account (e.g. they're a customer too) — don't touch their password
      console.log(`ℹ️ Auth user already existed for ${app.email} — skipping password reset to preserve existing account`);
    }

    // 3. Create row in vendors table
    const slug = generateSlug(app.brand_name);
    const { error: vendorError } = await db.from('vendors').insert({
      slug,
      brand_name: app.brand_name,
      spoc_name: app.spoc_name,
      email: app.email,
      phone_number: app.phone_number,
      description: app.description,
      instagram: app.instagram || null,
      categories: app.categories || [],
      deliverables: [],
      starting_price: 1,
      events_completed: app.events_completed || 0,
      verified: false,
      currently_available: true,
      additional_info: app.website ? { website: app.website } : {},
    });

    if (vendorError) throw new Error(`Vendor creation failed: ${vendorError.message}`);

    // 4. Update application status
    await db.from('vendor_applications').update({
      status: 'approved',
      reviewed_by,
      reviewed_at: new Date().toISOString(),
    }).eq('id', application_id);

    // 5. Send welcome email — different copy depending on whether they already had an account
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendor/login`;
    if (isExistingUser) {
      await sendEmail({
        to: app.email,
        subject: `You're approved — welcome to Happy Moments! 🎉`,
        html: approvalEmailExistingUserHtml(app.spoc_name || app.brand_name, loginUrl),
        text: `Hi ${app.spoc_name || app.brand_name}, your vendor application has been approved!\n\nYou already have a Happy Moments account — use your existing credentials to log in.\n\nDashboard: ${loginUrl}`,
      });
    } else {
      await sendEmail({
        to: app.email,
        subject: `You're approved — welcome to Happy Moments! 🎉`,
        html: approvalEmailHtml(app.spoc_name || app.brand_name, app.email, tempPassword, loginUrl),
        text: `Hi ${app.spoc_name || app.brand_name}, your vendor application has been approved!\n\nLogin: ${loginUrl}\nEmail: ${app.email}\nTemp Password: ${tempPassword}\n\nPlease change your password after first login.`,
      });
    }

    console.log(`✅ Vendor approved: ${app.brand_name} (${app.email})`);
    res.json({ success: true, message: 'Vendor approved successfully', slug });

  } catch (error) {
    console.error('❌ approve-vendor error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to approve vendor' });
  }
});

// POST /api/admin/decline-vendor
router.post('/decline-vendor', async (req, res) => {
  const { application_id, decline_reason = '', reviewed_by = 'admin' } = req.body;

  if (!application_id) {
    return res.status(400).json({ success: false, message: 'application_id is required' });
  }

  try {
    const db = supabaseAdmin ?? supabase;

    const { data: app, error: fetchError } = await db
      .from('vendor_applications')
      .select('id, email, spoc_name, brand_name, status')
      .eq('id', application_id)
      .single();

    if (fetchError || !app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (app.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application is already ${app.status}` });
    }

    await db.from('vendor_applications').update({
      status: 'rejected',
      decline_reason,
      reviewed_by,
      reviewed_at: new Date().toISOString(),
    }).eq('id', application_id);

    await sendEmail({
      to: app.email,
      subject: 'Update on your Happy Moments vendor application',
      html: declineEmailHtml(app.spoc_name || app.brand_name, decline_reason),
      text: `Hi ${app.spoc_name || app.brand_name}, your vendor application could not be approved at this time.${decline_reason ? `\n\nReason: ${decline_reason}` : ''}\n\nYou're welcome to re-apply after addressing the feedback.`,
    });

    console.log(`❌ Vendor declined: ${app.brand_name} (${app.email})`);
    res.json({ success: true, message: 'Vendor application declined' });

  } catch (error) {
    console.error('❌ decline-vendor error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to decline vendor' });
  }
});

module.exports = router;
