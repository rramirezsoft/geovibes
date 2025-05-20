export const ERROR_MESSAGES = {
  // Register
  NICKNAME_ALREADY_EXISTS: "El nickname ya está en uso.",
  EMAIL_ALREADY_EXISTS: "El email ya está en uso.",
  // validate email
  EMAIL_ALREADY_VERIFIED: "Tu email ya ha sido verificado.",
  TOO_MANY_ATTEMPTS:
    "Has superado el número máximo de intentos. Vuelve a registrarte.",
  INVALID_VERIFICATION_CODE: "Código incorrecto. Intenta de nuevo.",
  // Login
  INVALID_CREDENTIALS: "Email o contraseña incorrectos.",
  //middleware
  EMAIL_NOT_VERIFIED: "Email no verificado.",
  NOT_TOKEN: "No se encontró el token de acceso.",
  NOT_AUTHORIZED: "No autorizado.",
  NOT_SESSION: "No hay sesión activa.",
  // refresh token
  NO_REFRESH_TOKEN_PROVIDED: "No se encontró el token de refresco.",
  INVALID_REFRESH_TOKEN: "Token de actualización inválido.",
  REFRESH_TOKEN_MISMATCH: "El token de actualización no coincide.",
  // general
  USER_NOT_FOUND: "No existe ningún usuario con ese email.",
  // Password reset
  INVALID_OR_EXPIRED_TOKEN: "El enlace ha expirado o no es válido.",
  // Fallback
  DEFAULT: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
};
