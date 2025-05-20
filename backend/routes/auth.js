const express = require('express');
const {
  registerCtrl,
  verifyEmailCtrl,
  resendVerificationCodeCtrl,
  loginCtrl,
  forgotPasswordCtrl,
  resetPasswordCtrl,
  refreshTokenCtrl,
  logoutCtrl,
} = require('../controllers/auth');
const {
  validatorRegister,
  validatorCode,
  validatorLogin,
  validatorForgotPassword,
  validatorResetPassword,
} = require('../validators/auth');
const { authMiddleware, refreshAuthMiddleware } = require('../middleware/session');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones de autenticación (registro, login, etc.)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Este endpoint permite registrar un nuevo usuario en el sistema.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Dirección de correo electrónico del usuario.
 *                 example: user123@test.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 8 caracteres).
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente. Se devuelve el usuario y un token de autenticación en los encabezados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID del usuario registrado.
 *                       example: "680b639d5d8ad20c64182ac9"
 *                     email:
 *                       type: string
 *                       description: Correo electrónico del usuario.
 *                       example: "example5@gmail.com"
 *                     role:
 *                       type: string
 *                       description: Rol del usuario.
 *                       example: "user"
 *                     emailVerified:
 *                       type: boolean
 *                       description: Indica si el correo electrónico ha sido verificado.
 *                       example: false
 *         headers:
 *           Authorization:
 *             description: Token JWT generado para el usuario.
 *             schema:
 *               type: string
 *               example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       409:
 *         description: El correo electrónico ya está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "EMAIL_ALREADY_EXISTS"
 *       422:
 *         description: Error de validación de datos. La petición contiene campos inválidos.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ERROR_CREATE_USER"
 */
router.post('/register', validatorRegister, registerCtrl);
router.put('/validate', authMiddleware, validatorCode, verifyEmailCtrl);
router.post('/resend-code', authMiddleware, resendVerificationCodeCtrl);
router.post('/login', validatorLogin, loginCtrl);
router.post('/forgot-password', validatorForgotPassword, forgotPasswordCtrl);
router.post('/reset-password', validatorResetPassword, resetPasswordCtrl);
router.post('/refresh', refreshAuthMiddleware, refreshTokenCtrl);
router.post('/logout', authMiddleware, logoutCtrl);

module.exports = router;
