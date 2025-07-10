const passport = require('../config/passport')
const db = require('../db/queries')

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/log-in');
};

exports.getUserView = (req, res) => {
  res.render('index', { user: req.user });
};