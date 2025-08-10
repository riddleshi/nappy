const { Client } = require("pg");
require('dotenv').config()

const SQL = `
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL UNIQUE,      
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS sleeplogs (
    sleeplog_id SERIAL PRIMARY KEY,
    username VARCHAR(100) REFERENCES Users(name),
    date DATE NOT NULL,
    sleep_time TIME NOT NULL,
    wake_time TIME NOT NULL,
    mood TEXT
);

CREATE TABLE IF NOT EXISTS dream_journals (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  dream_text TEXT NOT NULL,
  ai_response TEXT
  username VARCHAR(100) REFERENCES Users(name);

);
`;
async function main() {
  console.log("seeding...");
  console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_NAME);
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();