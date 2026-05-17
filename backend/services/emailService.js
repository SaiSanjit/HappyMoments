const nodemailer = require('nodemailer');

let transporter = null;

const getEmailConfig = () => {
  const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
  const isSecurePort = smtpPort === 465;

  return {
    host: process.env.SMTP_HOST || 'mail.bindu.tconnecthub.com',
    port: smtpPort,
    secure: isSecurePort,
    requireTLS: !isSecurePort,
    auth: {
      user: process.env.SMTP_USER || 'test@bindu.tconnecthub.com',
      pass: process.env.SMTP_PASSWORD || 'your_email_password_here'
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    tls: { rejectUnauthorized: false }
  };
};

const getTransporter = () => {
  if (!transporter) {
    const emailConfig = getEmailConfig();
    transporter = nodemailer.createTransport(emailConfig);
    console.log(`📧 Email service configured for ${emailConfig.host}:${emailConfig.port}`);
    console.log(`👤 SMTP User: ${emailConfig.auth.user}`);
  }
  return transporter;
};

const initializeEmailService = () => {
  try {
    getTransporter();
    console.log('📧 Email service initialized (lazy connection)');
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error);
  }
};

// ── Shared layout wrapper ────────────────────────────────────────────────────
const layout = (bodyHtml, recipientEmail = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy Moments</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#c9a84c,#e8d5a3);border-radius:10px;padding:9px 16px;">
                    <span style="font-weight:900;font-size:17px;color:#1a0e00;letter-spacing:0.5px;">HM</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:18px;font-weight:700;color:#1a1208;letter-spacing:-0.3px;">Happy Moments</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:40px 40px 32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 20px 0;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                from <strong style="color:#6b7280;">Happy Moments</strong>
              </p>
              <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;">
                © ${new Date().getFullYear()} Happy Moments. All rights reserved.
              </p>
              ${recipientEmail ? `<p style="margin:0;font-size:11px;color:#9ca3af;">This email was sent to <a href="mailto:${recipientEmail}" style="color:#9ca3af;">${recipientEmail}</a>.</p>` : ''}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── OTP display block (shared by OTP emails) ─────────────────────────────────
const otpBlock = (otp) => `
  <div style="text-align:center;background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:28px 20px;margin:28px 0;">
    <span style="font-size:44px;font-weight:800;letter-spacing:14px;color:#1a1208;font-variant-numeric:tabular-nums;">${otp}</span>
  </div>
`;

// ── CTA button ────────────────────────────────────────────────────────────────
const ctaButton = (label, href) => `
  <div style="text-align:center;margin:28px 0;">
    <a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#b8923e);color:#fff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:8px;">
      ${label}
    </a>
  </div>
`;

// ── Text helpers ──────────────────────────────────────────────────────────────
const h1 = (text) => `<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827;line-height:1.3;">${text}</h1>`;
const p = (text, muted = false) => `<p style="margin:0 0 16px;font-size:15px;color:${muted ? '#6b7280' : '#374151'};line-height:1.6;">${text}</p>`;
const small = (text) => `<p style="margin:20px 0 0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.5;">${text}</p>`;
const divider = () => `<hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">`;

// ── Email templates ───────────────────────────────────────────────────────────
const emailTemplates = {
  // Email verification (link-based)
  verification: (name, verificationLink, recipientEmail = '') => ({
    subject: 'Verify your Happy Moments account',
    html: layout(`
      ${h1('Verify your account')}
      ${p(`Hi ${name},`)}
      ${p('Someone started creating a Happy Moments account using this email address. Please click the button below to verify your email and complete your registration.', true)}
      ${ctaButton('Verify Email Address', verificationLink)}
      ${divider()}
      ${p('Or copy and paste this link into your browser:', true)}
      <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;word-break:break-all;background:#f9fafb;padding:10px 12px;border-radius:6px;">${verificationLink}</p>
      ${small('This link expires in 24 hours. If you didn\'t create a Happy Moments account, you can safely ignore this email.')}
    `, recipientEmail),
    text: `Hi ${name},\n\nVerify your Happy Moments account by visiting:\n${verificationLink}\n\nThis link expires in 24 hours.\n\nIf you didn't request this, ignore this email.\n\n— Happy Moments`
  }),

  // Welcome email (after account verified)
  welcome: (name, loginLink, recipientEmail = '') => ({
    subject: 'Welcome to Happy Moments — your account is ready',
    html: layout(`
      ${h1('Welcome to Happy Moments!')}
      ${p(`Hi ${name},`)}
      ${p('Your account is verified and ready to go. Start discovering the perfect vendors for your next special event.', true)}
      ${ctaButton('Start Exploring', loginLink)}
      ${divider()}
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding:0 0 12px;">
            <p style="margin:0;font-size:14px;color:#374151;"><strong style="color:#c9a84c;">Browse vendors</strong></p>
            <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Explore our curated list of wedding vendors</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 0 12px;">
            <p style="margin:0;font-size:14px;color:#374151;"><strong style="color:#c9a84c;">Save favourites</strong></p>
            <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Shortlist the vendors you love</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 0 0;">
            <p style="margin:0;font-size:14px;color:#374151;"><strong style="color:#c9a84c;">Leave reviews</strong></p>
            <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Help other couples find the right fit</p>
          </td>
        </tr>
      </table>
      ${small('Happy planning!')}
    `, recipientEmail),
    text: `Hi ${name},\n\nWelcome to Happy Moments! Your account is verified.\n\nStart exploring: ${loginLink}\n\n— Happy Moments`
  }),

  // Password reset (link-based)
  passwordReset: (name, resetLink, recipientEmail = '') => ({
    subject: 'Reset your Happy Moments password',
    html: layout(`
      ${h1('Reset your password')}
      ${p(`Hi ${name},`)}
      ${p('We received a request to reset the password for your Happy Moments account. Click the button below to choose a new password.', true)}
      ${ctaButton('Reset Password', resetLink)}
      ${divider()}
      ${p('Or copy and paste this link into your browser:', true)}
      <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;word-break:break-all;background:#f9fafb;padding:10px 12px;border-radius:6px;">${resetLink}</p>
      ${small('This link expires in 1 hour. If you didn\'t request a password reset, please ignore this email — your password will remain unchanged.')}
    `, recipientEmail),
    text: `Hi ${name},\n\nReset your Happy Moments password:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\n— Happy Moments`
  }),

  // Vendor OTP
  vendorOtp: (name, otp, recipientEmail = '') => ({
    subject: `${otp} is your Happy Moments verification code`,
    html: layout(`
      ${h1('Verify your email')}
      ${p(`Hi ${name || 'there'},`)}
      ${p('Use the code below to verify your email address for your Happy Moments vendor application.', true)}
      ${otpBlock(otp)}
      ${small('This code expires in <strong>10 minutes</strong>. Do not share it with anyone.')}
    `, recipientEmail),
    text: `Your Happy Moments vendor verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\n— Happy Moments`
  }),

  // Customer password reset OTP
  customerResetOtp: (name, otp, recipientEmail = '') => ({
    subject: `${otp} is your Happy Moments password reset code`,
    html: layout(`
      ${h1('Reset your password')}
      ${p(`Hi ${name || 'there'},`)}
      ${p('Use the code below to reset your Happy Moments account password.', true)}
      ${otpBlock(otp)}
      ${small('This code expires in <strong>10 minutes</strong>. If you didn\'t request a password reset, you can safely ignore this email.')}
    `, recipientEmail),
    text: `Your Happy Moments password reset code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, ignore this email.\n\n— Happy Moments`
  }),

  // Review notification (vendor receives)
  reviewNotification: (vendorName, customerName, reviewText, rating, recipientEmail = '') => ({
    subject: `New review from ${customerName} on Happy Moments`,
    html: layout(`
      ${h1('You received a new review')}
      ${p(`Hi ${vendorName},`)}
      ${p(`${customerName} just left a review on your Happy Moments profile.`, true)}
      <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:20px 22px;margin:24px 0;">
        ${rating ? `<p style="margin:0 0 10px;font-size:14px;color:#c9a84c;letter-spacing:2px;">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>` : ''}
        <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;font-style:italic;">"${reviewText}"</p>
        <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">— ${customerName}</p>
      </div>
      ${small('Reviews help couples discover your services. Keep up the great work!')}
    `, recipientEmail),
    text: `Hi ${vendorName},\n\n${customerName} left you a ${rating ? rating + '/5 star ' : ''}review:\n\n"${reviewText}"\n\n— Happy Moments`
  }),

  // Contact form notification (vendor receives)
  contactNotification: (customerName, customerEmail, message, vendorName, recipientEmail = '') => ({
    subject: `New inquiry from ${customerName} — Happy Moments`,
    html: layout(`
      ${h1('You have a new inquiry')}
      ${p(`Hi ${vendorName},`)}
      ${p(`${customerName} sent you a message through Happy Moments.`, true)}
      <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:20px 22px;margin:24px 0;">
        <p style="margin:0 0 4px;font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">From</p>
        <p style="margin:0 0 16px;font-size:15px;color:#111827;font-weight:600;">${customerName} &lt;${customerEmail}&gt;</p>
        <p style="margin:0 0 4px;font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
        <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">${message}</p>
      </div>
      ${small('Reply directly to this email to respond to ' + customerName + '.')}
    `, recipientEmail),
    text: `Hi ${vendorName},\n\n${customerName} (${customerEmail}) sent you a message:\n\n"${message}"\n\n— Happy Moments`
  }),

  // Like notification (vendor receives)
  likeNotification: (vendorName, customerName, recipientEmail = '') => ({
    subject: `${customerName} liked your profile on Happy Moments`,
    html: layout(`
      ${h1('Someone liked your profile')}
      ${p(`Hi ${vendorName},`)}
      ${p(`<strong>${customerName}</strong> just liked your Happy Moments profile. They may be actively looking to book someone like you.`, true)}
      ${divider()}
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#374151;">A few tips to turn this into a booking:</p>
      <ul style="margin:0;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8;">
        <li>Keep your portfolio updated with your best work</li>
        <li>Make sure your packages and pricing are clearly listed</li>
        <li>Respond quickly if they reach out via WhatsApp</li>
      </ul>
      ${small('Keep up the great work!')}
    `, recipientEmail),
    text: `Hi ${vendorName},\n\n${customerName} liked your Happy Moments profile!\n\nMake sure your profile is up to date and respond quickly if they reach out.\n\n— Happy Moments`
  })
};

// ── Core send function ────────────────────────────────────────────────────────
const sendEmail = async (options) => {
  try {
    const emailConfig = getEmailConfig();
    const currentTransporter = nodemailer.createTransport(emailConfig);

    try {
      await currentTransporter.verify();
      console.log('✅ SMTP connection verified');
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:', verifyError);
      currentTransporter.close();
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    const mailOptions = {
      from: emailConfig.auth.user,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    console.log(`📤 Sending email to: ${options.to}`);
    const result = await currentTransporter.sendMail(mailOptions);
    currentTransporter.close();

    console.log('✅ Email sent:', { messageId: result.messageId, to: options.to });
    return { success: true, messageId: result.messageId, message: 'Email sent successfully', response: result.response };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message, message: `Failed to send email: ${error.message}`, code: error.code, responseCode: error.responseCode };
  }
};

// ── Convenience senders ───────────────────────────────────────────────────────
const sendVerificationEmail = async (email, name, tokenOrUrl, baseUrl = null) => {
  try {
    let verificationLink = (tokenOrUrl.startsWith('http://') || tokenOrUrl.startsWith('https://'))
      ? tokenOrUrl
      : `${baseUrl}/verify-email?token=${encodeURIComponent(tokenOrUrl)}`;

    const template = emailTemplates.verification(name, verificationLink, email);
    return await sendEmail({ to: email, subject: template.subject, html: template.html, text: template.text });
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error: error.message, message: 'Failed to send verification email' };
  }
};

const sendWelcomeEmail = async (email, name, loginLink) => {
  try {
    const template = emailTemplates.welcome(name, loginLink, email);
    return await sendEmail({ to: email, subject: template.subject, html: template.html, text: template.text });
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message, message: 'Failed to send welcome email' };
  }
};

const sendPasswordResetEmail = async (email, name, resetLink) => {
  try {
    const template = emailTemplates.passwordReset(name, resetLink, email);
    return await sendEmail({ to: email, subject: template.subject, html: template.html, text: template.text });
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message, message: 'Failed to send password reset email' };
  }
};

const sendReviewNotificationEmail = async (vendorEmail, vendorName, customerName, reviewText, rating) => {
  try {
    const template = emailTemplates.reviewNotification(vendorName, customerName, reviewText, rating, vendorEmail);
    return await sendEmail({ to: vendorEmail, subject: template.subject, html: template.html, text: template.text });
  } catch (error) {
    console.error('❌ Error sending review notification email:', error);
    return { success: false, error: error.message, message: 'Failed to send review notification email' };
  }
};

const sendLikeNotificationEmail = async (vendorEmail, vendorName, customerName) => {
  try {
    const template = emailTemplates.likeNotification(vendorName, customerName, vendorEmail);
    return await sendEmail({ to: vendorEmail, subject: template.subject, html: template.html, text: template.text });
  } catch (error) {
    console.error('❌ Error sending like notification email:', error);
    return { success: false, error: error.message, message: 'Failed to send like notification email' };
  }
};

const sendContactNotificationEmail = async (vendorEmail, customerName, customerEmail, message, vendorName) => {
  try {
    const template = emailTemplates.contactNotification(customerName, customerEmail, message, vendorName, vendorEmail);
    return await sendEmail({ to: vendorEmail, subject: template.subject, html: template.html, text: template.text });
  } catch (error) {
    console.error('❌ Error sending contact notification email:', error);
    return { success: false, error: error.message, message: 'Failed to send contact notification email' };
  }
};

module.exports = {
  initializeEmailService,
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendReviewNotificationEmail,
  sendContactNotificationEmail,
  sendLikeNotificationEmail,
  emailTemplates
};
