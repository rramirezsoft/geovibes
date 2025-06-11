function verificationEmailTemplate(code) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
      <h2 style="color: #1d274d;">¡Bienvenido a <span style="color: #8f4de3;">GeoVibes</span>! 🌍</h2>
      <p>Gracias por registrarte. Para completar tu registro, introduce este código en la aplicación:</p>
      <div style="font-size: 24px; font-weight: bold; background: #1d274d; color: white; padding: 10px 20px; display: inline-block; border-radius: 6px;">
        ${code}
      </div>
      <p style="margin-top: 20px;">Si tú no solicitaste este registro, puedes ignorar este correo.</p>
      <hr style="margin: 40px 0;" />
      <p style="font-size: 12px; color: #888;">Este correo fue enviado automáticamente por el sistema de verificación de GeoVibes.</p>
    </div>
  `;
}

function resetPasswordEmailTemplate(nickname, resetLink) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
      <h2 style="color: #1d274d;">Restablece tu contraseña en <span style="color: #8f4de3;">GeoVibes</span> 🔒</h2>
      <p>Hola <b>${nickname}</b>,</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
      <p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#8f4de3;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
          Cambiar contraseña
        </a>
      </p>
      <p style="margin-top:20px;">Este enlace expirará en 1 hora.</p>
      <hr style="margin: 40px 0;" />
      <p style="font-size: 12px; color: #888;">Si no fuiste tú, ignora este mensaje.</p>
    </div>
  `;
}

module.exports = {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
};
