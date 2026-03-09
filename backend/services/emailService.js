const nodemailer = require('nodemailer');
const moment = require('moment');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (to, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Gestión de Inquilinos" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Restablecer contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Restablecer contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Hacé click en el siguiente botón para crear una nueva contraseña:</p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Restablecer contraseña
        </a>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora.</p>
        <p style="color: #666; font-size: 14px;">Si no solicitaste esto, podés ignorar este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendPaymentReceipt = async (to, tenantName, payment) => {
  const mailOptions = {
    from: `"Gestión de Inquilinos" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Comprobante de pago recibido - Recibo #${payment.receiptNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1976d2; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Comprobante de Pago</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="margin: 0 0 20px 0; color: #333;">
            Estimado/a <strong>${tenantName}</strong>,
          </p>
          
          <p style="margin: 0 0 20px 0; color: #666;">
            Confirmamos que hemos recibido exitosamente tu pago. A continuación encontrarás los detalles:
          </p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #1976d2;">Número de Recibo:</td>
                <td style="padding: 8px; text-align: right; color: #333;"><strong>${payment.receiptNumber}</strong></td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; font-weight: bold; color: #1976d2;">Monto:</td>
                <td style="padding: 8px; text-align: right; color: #333;"><strong>$${payment.amount.toFixed(2)}</strong></td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; font-weight: bold; color: #1976d2;">Fecha de Pago:</td>
                <td style="padding: 8px; text-align: right; color: #333;">${moment(payment.date).format('DD/MM/YYYY')}</td>
              </tr>
              ${payment.description ? `
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #1976d2;">Descripción:</td>
                <td style="padding: 8px; text-align: right; color: #333;">${payment.description}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #2e7d32;">
              ✓ El pago ha sido registrado correctamente en nuestro sistema.
            </p>
          </div>
          
          <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
            Si tenés alguna pregunta o necesitás más información, no dudes en contactarnos.
          </p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 0;">Este es un comprobante automático generado por el sistema de gestión de inquilinos.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail, sendPaymentReceipt };
