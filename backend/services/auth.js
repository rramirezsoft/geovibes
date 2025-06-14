const User = require('../models/nosql/user');
const { encrypt, compare } = require('../utils/handlePassword');
const {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} = require('../utils/handleJwt');
const { sendEmail } = require('../utils/handleEmail');
const crypto = require('crypto');
const { generateVerificationCode } = require('../utils/generateCode');
const BLOCKED_EMAILS = require('../constants/blockedEmails');
const {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
} = require('../utils/emailTemplates');

/**
 * Registra un usuario en la base de datos
 * @param {Object} userData - Datos del usuario (name, surnames, email, password)
 * @returns {Object} - Datos del usuario registrado + token JWT
 */
const registerUser = async (userData) => {
  try {
    // Verifica si el email está bloqueado
    if (BLOCKED_EMAILS.includes(userData.email)) {
      throw { status: 403, message: 'EMAIL_NOT_ALLOWED' };
    }
    // Encripta la contraseña
    const hashedPassword = await encrypt(userData.password);

    // Crea usuario
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    // Oculta la contraseña en la respuesta
    newUser.set('password', undefined, { strict: false });

    // Genera token de acceso JWT
    const accessToken = generateAccessToken(newUser);

    // Envia email de verificación
    await sendEmail({
      subject: 'Verifica tu cuenta en GeoVibes 🌍',
      to: userData.email,
      from: process.env.EMAIL,
      html: verificationEmailTemplate(newUser.verificationCode),
    });

    // Devuelve el usuario y el token
    return { user: newUser, accessToken, message: 'USER_CREATED' };
  } catch (error) {
    // Si el email o nikname ya existe, devuelve un error 409
    if (error.code === 11000) {
      if (error.keyValue.nickname) {
        throw { status: 409, message: 'NICKNAME_ALREADY_EXISTS' };
      } else if (error.keyValue.email) {
        throw { status: 409, message: 'EMAIL_ALREADY_EXISTS' };
      }
    }
    throw error;
  }
};

/**
 * Verifica el código de validación de email
 * @param {Object} user - Usuario autenticado (req.user desde el middleware)
 * @param {string} code - Código de verificación recibido
 * @returns {Object} - Mensaje de éxito
 * @throws {Object} - Error con código de estado y mensaje
 */
const verifyUserCode = async (user, code) => {
  try {
    if (user.emailVerified) {
      throw { status: 400, message: 'EMAIL_ALREADY_VERIFIED' };
    }

    if (user.verificationCode !== code) {
      if (user.verificationAttempts > 0) {
        user.verificationAttempts -= 1;
        await user.save();
      }

      if (user.verificationAttempts <= 0) {
        throw { status: 403, message: 'TOO_MANY_ATTEMPTS' };
      }

      throw { status: 401, message: 'INVALID_VERIFICATION_CODE' };
    }

    // Código correcto → marcar el email como verificado
    user.emailVerified = true;
    await user.save();

    return { message: 'EMAIL_VERIFIED_SUCCESSFULLY' };
  } catch (error) {
    throw error; // Le mandamos el error al controlador
  }
};

/**
 * Reenvía un nuevo código de verificación al usuario
 * @param {Object} user - Usuario autenticado (req.user desde el middleware)
 * @returns {Object} - Mensaje de éxito
 * @throws {Object} - Error con código de estado y mensaje
 */
const resendVerificationCode = async (user) => {
  try {
    if (user.emailVerified) {
      throw { status: 400, message: 'EMAIL_ALREADY_VERIFIED' };
    }

    // Generar un nuevo código y actualizar en BD
    user.verificationCode = generateVerificationCode();
    await user.save();

    // Envia email de verificación
    sendEmail({
      subject: 'Verifica tu cuenta en GeoVibes 🌍',
      to: user.email,
      from: process.env.EMAIL,
      html: verificationEmailTemplate(user.verificationCode),
    });

    return { message: 'VERIFICATION_CODE_SENT_SUCCESSFULLY' };
  } catch (error) {
    throw error;
  }
};

/**
 * Inicia sesión con email y password
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} - Usuario y tokens JWT (access y refresh)
 */
const loginUser = async (email, password) => {
  try {
    // Busca al usuario por email en la db
    const user = await User.findOne({ email });

    if (!user) {
      throw { status: 404, message: 'USER_NOT_FOUND' };
    }

    // Compara la contraseña introducida con la almacenada
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw { status: 401, message: 'INVALID_CREDENTIALS' };
    }

    // Genera access token
    const accessToken = generateAccessToken(user);

    // Intenta obtener un refreshToken ya existente
    let refreshToken = await getRefreshToken(user._id);

    if (!refreshToken) {
      // Si no hay, genera uno nuevo
      refreshToken = generateRefreshToken(user);
      await saveRefreshToken(user._id, refreshToken);
    }

    user.set('password', undefined, { strict: false });

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.log('❌ Error en login:', error);
    throw error;
  }
};

/**
 * Solicita el restablecimiento de contraseña y envía un token por correo.
 * @param {String} email - Correo del usuario.
 * @returns {Object} - Mensaje de éxito.
 * @throws {Object} - Error con código de estado y mensaje.
 */
const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: 'USER_NOT_FOUND' };

    // Comprobamos que el usuario no esté registrado con Google
    if (!user.password) {
      throw { status: 403, message: 'GOOGLE_ACCOUNT_NOT_SUPPORTED' };
    }

    // Generamos un token único de 32 bytes y 1 hora de expiración
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000; // 1 hora

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    // URL del frontend para el cambio de contraseña
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;

    await sendEmail({
      to: user.email,
      subject: 'Restablecimiento de contraseña',
      from: process.env.EMAIL,
      html: resetPasswordEmailTemplate(user.nickname, resetLink),
    });

    return { message: 'EMAIL_SENT' };
  } catch (error) {
    throw error;
  }
};

/**
 * Restablece la contraseña del usuario.
 * @param {String} token - Token único de restablecimiento.
 * @param {String} password - Nueva contraseña.
 */
const resetPassword = async (token, password) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Verifica que no haya expirado
    });

    if (!user) throw { status: 400, message: 'INVALID_OR_EXPIRED_TOKEN' };

    // verificamos que la nueva contraseña no sea igual a la actual
    const isSamePassword = await compare(password, user.password);
    if (isSamePassword) {
      throw { status: 400, message: 'SAME_PASSWORD' };
    }

    // Encriptamos la nueva contraseña
    const hashedPassword = await encrypt(password);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { message: 'PASSWORD_UPDATED' };
  } catch (error) {
    throw error;
  }
};

/**
 * Genera un nuevo Access Token utilizando el usuario del middleware
 * @param {Object} user - Usuario obtenido del middleware
 * @returns {Object} - Nuevo Access Token
 */
const refreshTokenService = (user) => {
  try {
    const newAccessToken = generateAccessToken({ _id: user._id });
    return { accessToken: newAccessToken };
  } catch (error) {
    throw error;
  }
};

/**
 * Cierra la sesión del usuario eliminando el Refresh Token
 * @param {ObjectId} userId - ID del usuario
 *
 */
const logoutUser = async (userId) => {
  try {
    await deleteRefreshToken(userId);
    return { message: 'LOGOUT_SUCCESSFUL' };
  } catch (error) {
    console.error('❌ Error en logoutUser:', error);
    throw error;
  }
};

/**
 * Autentica al usuario con Google y genera tokens JWT
 * @param {Object} user - Usuario autenticado por Google (req.user desde el middleware)
 * @returns - {Object} - Usuario, Access Token y Refresh Token
 */
const googleAuthService = async (user) => {
  try {
    if (!user) {
      throw { status: 401, message: 'GOOGLE_AUTH_FAILED' };
    }
    // Verificamos si el correo está bloqueado
    if (BLOCKED_EMAILS.includes(user.email)) {
      throw { status: 403, message: 'EMAIL_NOT_ALLOWED' };
    }
    const accessToken = generateAccessToken(user);

    let refreshToken = await getRefreshToken(user._id);
    if (!refreshToken) {
      refreshToken = generateRefreshToken(user);
      await saveRefreshToken(user._id, refreshToken);
    }

    user.set('password', undefined, { strict: false });

    return { user, accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  verifyUserCode,
  resendVerificationCode,
  loginUser,
  forgotPassword,
  resetPassword,
  refreshTokenService,
  logoutUser,
  googleAuthService,
};
