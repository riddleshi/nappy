const passport = require('../config/passport');

exports.getLogin = (req, res) => {
  res.json({ message: "Login endpoint" });
};

exports.logIn = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Login failed' });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);
};

exports.logOut = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/log-in');
  });
};