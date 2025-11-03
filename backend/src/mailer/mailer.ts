import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  EMAIL_ENABLED
} = process.env;

// Configuramos el transporter SMTP
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 465,
  secure: SMTP_SECURE === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Función para enviar correos
export async function sendVerificationEmail(to: string, code: string) {
  if (EMAIL_ENABLED !== 'true') {
    console.log('📧 Email deshabilitado (EMAIL_ENABLED=false)');
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h2>Verificación de cuenta - Mr. Crispy 💈</h2>
      <p>Hola 👋, gracias por registrarte en <strong>Mr. Crispy</strong>.</p>
      <p>Tu código de verificación es:</p>
      <h1 style="background:#000; color:#fff; display:inline-block; padding:10px 20px; border-radius:8px;">${code}</h1>
      <p>Por favor ingrésalo en la aplicación para completar tu registro.</p>
      <br>
      <p>Si no realizaste esta solicitud, ignora este mensaje.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to,
      subject: 'Verificación de cuenta - Mr. Crispy 💈',
      html: htmlContent,
    });

    console.log(`📨 Correo de verificación enviado a ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo de verificación');
  }
}
