const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("Registering user:", username, password );

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await User.registerNewUser(username, hashedPassword);

    res.redirect('/log-in');
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send('Registration error');
  }
};