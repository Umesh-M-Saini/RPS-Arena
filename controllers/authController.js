const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

async function signup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.redirect('/signup?error=server_error');
  }
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.redirect('/signup?error=username_taken');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const created = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: created._id, email: created.email }, process.env.JWT_SECRET || 'change-me');
  res.cookie('token', token, cookieOptions());
  return res.redirect('/');
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/login?error=user_not_found');
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.redirect('/login?error=user_not_found');
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.redirect('/login?error=wrong_password');
  }
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'change-me');
  res.cookie('token', token, cookieOptions());
  return res.redirect('/');
}

function logout(req, res) {
  res.clearCookie('token');
  return res.redirect('/login');
}

module.exports = {
  signup,
  login,
  logout,
};
