const pool = require('../db/pool');

async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM Users WHERE name = $1", [username]);
  return rows[0];
}

async function registerNewUser(username, password) {
  await pool.query("INSERT INTO Users (name, password) VALUES ($1, $2)", [username, password]);
}

async function getSleepGoal(username) {
  const { rows } = await pool.query(
    "SELECT sleep_goal_hours FROM Users WHERE name = $1",
    [username]
  );
  return rows[0]?.sleep_goal_hours ?? null;
}

async function updateSleepGoal(username, newGoal) {
  await pool.query(
    "UPDATE Users SET sleep_goal_hours = $1 WHERE name = $2",
    [newGoal, username]
  );
}

module.exports = {
    getUserByUsername,
    registerNewUser,
    getSleepGoal,
    updateSleepGoal
};