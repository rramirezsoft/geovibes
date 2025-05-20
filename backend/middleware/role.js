const { handleHttpError } = require('../utils/handleError');

const checkRole = (roles) => (req, res, next) => {
  // Doble argumento
  try {
    const { user } = req;
    const userRole = user.role;
    const checkValueRole = roles.includes(userRole);
    //Comprobamos que el rol del usuario esté en roles
    if (!checkValueRole) {
      handleHttpError(res, 'NOT_ALLOWED', 403);
      return;
    }
    next();
  } catch (err) {
    handleHttpError(res, 'ERROR_PERMISSIONS', err.status || 500);
  }
};
module.exports = checkRole;
