// Backend/Database/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// IMPORTANTE: usa SIEMPRE el .db en la RAÍZ del proyecto
const dbPath = path.join(__dirname, '..', '..', 'segurimapp.db');
//      __dirname = Backend/Database
//      ..  -> Backend
//      ..  -> (raíz del repo)
// Resultado: <raíz>/segurimapp.db

console.log('[DB] Usando archivo:', dbPath); // mira esto en la terminal

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

module.exports = db;
