const cron = require('node-cron');
const User = require('../models/nosql/user');

const cleanUnverifiedUsers = async () => {
  try {
    console.log('🧹 Limpiando usuarios no verificados...');

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const deletedUsers = await User.deleteMany({
      emailVerified: false,
      createdAt: { $lte: twoHoursAgo },
    });

    if (deletedUsers.deletedCount > 0) {
      console.log(`🗑️ Eliminados ${deletedUsers.deletedCount} usuarios no verificados.`);
    } else {
      console.log('✅ No hay usuarios por eliminar.');
    }
  } catch (error) {
    console.error('❌ Error al limpiar usuarios no verificados:', error);
  }
};

cron.schedule('0 */2 * * *', cleanUnverifiedUsers); // Ejecuta la tarea cada 2 horas

module.exports = cleanUnverifiedUsers;
