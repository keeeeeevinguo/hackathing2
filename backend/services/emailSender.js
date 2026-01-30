import nodemailer from 'nodemailer';
import fs from 'fs';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

/**
 * Send the generated video ad as an attachment to a consumer's email.
 * @param {string} to - Recipient email
 * @param {string} productName - Product name for the subject/body
 * @param {string} videoFilePath - Absolute path to the video file on disk
 * @returns {Promise<boolean>} - true if sent, false if skipped (no config or error)
 */
export async function sendVideoAdEmail(to, productName, videoFilePath) {
  const email = (to || '').trim();
  if (!email || !email.includes('@')) {
    console.warn('sendVideoAdEmail: invalid or missing email', to);
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn('sendVideoAdEmail: SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping email.');
    return false;
  }

  if (!videoFilePath || !fs.existsSync(videoFilePath)) {
    console.warn('sendVideoAdEmail: video file not found', videoFilePath);
    return false;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@localhost';
  const subject = `Your personalized video ad: ${productName}`;
  const html = `
    <p>Hi,</p>
    <p>Your personalized video ad for <strong>${productName}</strong> is ready.</p>
    <p>Please find your video attached to this email.</p>
    <p>Thanks,<br/>AI Video Ad Generator</p>
  `;
  const text = `Your personalized video ad for ${productName} is ready. Your video is attached to this email.`;

  const filename = videoFilePath.split(/[/\\]/).pop() || 'video-ad.mp4';

  try {
    await transporter.sendMail({
      from: `"AI Video Ad Generator" <${from}>`,
      to: email,
      subject,
      text,
      html,
      attachments: [
        {
          filename,
          content: fs.readFileSync(videoFilePath),
          contentType: 'video/mp4',
        },
      ],
    });
    console.log(`Email sent to ${email} for product: ${productName} (video attached)`);
    return true;
  } catch (err) {
    console.error(`Failed to send email to ${email}:`, err.message);
    return false;
  }
}
