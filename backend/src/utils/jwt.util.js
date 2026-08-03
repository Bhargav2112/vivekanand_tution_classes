const jwt = require('jsonwebtoken');

const getSecret = (name, fallback) => {
  const value = process.env[name];
  if (value && value.trim()) {
    return value;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} is not configured`);
  }

  return fallback || 'dev-secret';
};

const generateToken = (id) => {
  return jwt.sign({ id }, getSecret('JWT_SECRET', 'dev-access-secret'), {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, getSecret('JWT_REFRESH_SECRET', 'dev-refresh-secret'), {
    expiresIn: '90d',
  });
};

const getCookieOptions = (isProduction = process.env.NODE_ENV === 'production', expiresInMs = 30 * 24 * 60 * 60 * 1000) => ({
  expires: new Date(Date.now() + expiresInMs),
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
});

const buildAuthResponse = (user, accessToken, refreshToken, message = 'Authentication successful') => {
  const safeUser = user?.toObject ? user.toObject() : user;
  if (safeUser) {
    delete safeUser.password;
  }

  return {
    success: true,
    message,
    data: safeUser || null,
    access_token: accessToken || null,
    refresh_token: refreshToken || null,
  };
};

module.exports = {
  getSecret,
  generateToken,
  generateRefreshToken,
  getCookieOptions,
  buildAuthResponse,
};
