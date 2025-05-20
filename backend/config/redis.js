require('dotenv').config();
const fetch = require('node-fetch');

// Variables de entorno
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Función para probar la conexión
const connectRedis = async () => {
  try {
    const response = await fetch(`${UPSTASH_URL}/GET/test`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });
    if (response.ok) {
      console.log('✅ Conectado a Redis');
    } else {
      console.log('❌ Error al conectar a Redis:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error de conexión con Redis:', error);
  }
};

module.exports = { connectRedis };
