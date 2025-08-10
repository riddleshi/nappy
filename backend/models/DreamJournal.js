const pool = require('../db/pool');

async function addDream({ date, dream_text, username }) {
  await pool.query(
    "INSERT INTO dream_journals (date, dream_text, username) VALUES ($1, $2, $3)",
    [date, dream_text, username]
  );
}

async function getDreamsByUsername(username) {
  const { rows } = await pool.query(
    "SELECT * FROM dream_journals WHERE username = $1 ORDER BY date DESC",
    [username]
  );
  return rows;
}

async function updateAIResponse(id, ai_response) {
  await pool.query(
    "UPDATE dream_journals SET ai_response = $1 WHERE id = $2",
    [ai_response, id]
  );
}

module.exports = {
  addDream,
  getDreamsByUsername,
  updateAIResponse,
};