const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
  try {
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const SMTP_SECURE = (process.env.SMTP_SECURE ?? 'false').toLowerCase() === 'true';
    const SMTP_USER = process.env.SMTP_USER || process.env.GMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_PASS;
    const TO = process.env.TEST_TO || SMTP_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('✖ SMTP_USER or SMTP_PASS not set in backend/.env. Aborting test.');
      process.exit(2);
    }

    const transporter = SMTP_HOST && SMTP_PORT ?
      nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE, auth: { user: SMTP_USER, pass: SMTP_PASS } }) :
      nodemailer.createTransport({ service: 'gmail', auth: { user: SMTP_USER, pass: SMTP_PASS } });

    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('✔ Transporter verified');

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || SMTP_USER,
      to: TO,
      subject: 'Test email from MyAppCrispy backend',
      text: 'This is a test email sent by backend/test-send.js',
    });

    console.log('✔ Email sent. MessageId:', info.messageId);
    process.exit(0);
  } catch (err) {
    console.error('✖ Error sending test email:', err);
    process.exit(1);
  }
})();
