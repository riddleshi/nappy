const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("Registering user:", username, password );

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.registerNewUser(username, hashedPassword);
    res.status(201).json({ message: 'Registration successful' }); // <-- send JSON
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: 'Registration error' }); // <-- send JSON
  }
};