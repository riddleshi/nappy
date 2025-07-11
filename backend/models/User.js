const pool = require('../db/pool');

async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM Users WHERE name = $1", [username]);
  return rows[0];
}

async function registerNewUser(username, password) {
  await pool.query("INSERT INTO Users (name, password) VALUES ($1, $2)", [username, password]);
}

module.exports = {
    getUserByUsername,
    registerNewUser
};