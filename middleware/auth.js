const jwt = require('jsonwebtoken');

function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (_) {
    return null;
  }
}

function setAuthState(secret) {
  return (req, res, next) => {
    const token = req.cookies && req.cookies.token;
    const decoded = token ? verifyToken(token, secret) : null;
    req.user = decoded || null;
    res.locals.isAuthenticated = !!decoded;
    next();
  };
}

function requireAuth(secret) {
  return (req, res, next) => {
    const token = req.cookies && req.cookies.token;
    const decoded = token ? verifyToken(token, secret) : null;
    if (!decoded) {
      return res.redirect('/login');
    }
    req.user = decoded;
    next();
  };
}

module.exports = {
  setAuthState,
  requireAuth,
};
