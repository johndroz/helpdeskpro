const db = require('../db/db');

function createUser({ username, passwordHash, role, email }) {
  const stmt = db.prepare(`
    INSERT INTO users (username, password_hash, role, email)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(username, passwordHash, role, email);
  return result.lastInsertRowid;
}

function findUserByUsername(username) {
  const stmt = db.prepare(`
    SELECT * FROM users
    WHERE username = ?
  `);
  return stmt.get(username);
}

function findUserByEmail(email) {
  const stmt = db.prepare(`
    SELECT * FROM users
    WHERE email = ?
  `);
  return stmt.get(email);
}

function findUserById(userID) {
  const stmt = db.prepare(`
    SELECT id, username, role, email
    FROM users
    WHERE id = ?
  `);
  return stmt.get(userID);
}



module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  findUserByEmail
};