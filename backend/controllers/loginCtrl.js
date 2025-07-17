const passport = require('../config/passport');

exports.getLogin = (req, res) => {
  res.json({ message: "Login endpoint" });
};

exports.logIn = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
});

exports.logOut = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/log-in');
  });
};