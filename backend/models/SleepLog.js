const pool = require('../db/pool');

async function addSleepLog({ username, date, sleep_time, wake_time, mood }) {
  await pool.query(
    `INSERT INTO sleeplogs (username, date, sleep_time, wake_time, mood)
     VALUES ($1, $2, $3, $4, $5)`,
    [username, date, sleep_time, wake_time, mood]
  );
}

async function getSleepLogsByUsername(username) {
  const { rows } = await pool.query(
    `SELECT * FROM sleeplogs WHERE username = $1 ORDER BY date DESC`,
    [username]
  );
  return rows;
}

async function getSleepLogsByMonth(username, month) {
  const { rows } = await pool.query(
    `
    SELECT * FROM sleeplogs
    WHERE username = $1 AND TO_CHAR(date, 'YYYY-MM') = $2
    ORDER BY date DESC
    `,
    [username, month]
  );
  return rows;
}

module.exports = {
  addSleepLog,
  getSleepLogsByUsername,
  getSleepLogsByMonth,
};