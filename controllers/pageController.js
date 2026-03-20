const jwt = require('jsonwebtoken');
const User = require('../models/User');

function landing(req, res) {
  return res.render('landing', {});
}

function loginPage(req, res) {
  const error = req.query.error;
  return res.render('login', { error });
}

function signupPage(req, res) {
  const error = req.query.error;
  return res.render('signup', { error });
}

async function profile(req, res) {
  const user = await User.findById(req.user.id);
  return res.render('profile', { user });
}

function play(req, res) {
  const token = req.cookies.token;
  if (token) {
    return res.render('play');
  }
  if (req.cookies.guestPlayed) {
    return res.redirect('/login?error=guest_limit');
  }
  return res.render('play');
}

module.exports = {
  landing,
  loginPage,
  signupPage,
  profile,
  play,
};
