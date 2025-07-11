const passport = require('../config/passport')
const User = require('../models/User')

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/log-in');
};

exports.getUserView = (req, res) => {
  res.render('index', { user: req.user });
};