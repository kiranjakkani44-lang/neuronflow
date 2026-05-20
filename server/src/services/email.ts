import * as nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export function initMailer() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log('[Email] SMTP not configured, email sending disabled');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  console.log('[Email] SMTP transporter initialized');
  return transporter;
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  if (!transporter) {
    console.log(`[Email] SMTP not configured. Reset token for ${email}: ${resetToken}`);
    return false;
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: `"NeuronFlow" <${process.env.SMTP_FROM || 'noreply@neuronflow.com'}>`,
      to: email,
      subject: 'NeuronFlow - Password Reset',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">NeuronFlow</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
    console.log(`[Email] Password reset email sent to ${email}`);
    return true;
  } catch (err) {
    console.error(`[Email] Failed to send reset email to ${email}:`, err);
    return false;
  }
}

export { transporter };
