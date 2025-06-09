require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

let oauth2Client;

const createTransporter = async () => {
  if (!oauth2Client) {
    oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });
  }

  const getAccessToken = async () => {
    try {
      const accessToken = await oauth2Client.getAccessToken();
      return accessToken.token;
    } catch (err) {
      console.error('Error obteniendo el token de acceso:', err);
      throw new Error('Error al obtener access token');
    }
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: await getAccessToken(),
    },
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  try {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
  } catch (e) {
    console.error('Error enviando el email:', e);
  }
};

module.exports = { sendEmail };
