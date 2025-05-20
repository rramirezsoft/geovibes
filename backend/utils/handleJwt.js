const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Access Token (2h)
const generateAccessToken = (user) => {
  return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '2h' });
};

// Refresh Token (7d)
const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Verificar Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Verificar Refresh Token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

// Guardamos Refresh Token en Redis
const saveRefreshToken = async (userId, token) => {
  const key = `refreshToken:${userId}`;
  const response = await fetch(`${UPSTASH_URL}/SET/${key}/${token}?EX=604800`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
  });
  return response.ok;
};

// Obtenemos Refresh Token de Redis
const getRefreshToken = async (userId) => {
  const key = `refreshToken:${userId}`;
  const response = await fetch(`${UPSTASH_URL}/GET/${key}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.result;
};

// Eliminamos Refresh Token de Redis (Logout)
const deleteRefreshToken = async (userId) => {
  const key = `refreshToken:${userId}`;
  const response = await fetch(`${UPSTASH_URL}/DEL/${key}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
  });
  return response.ok;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
};
