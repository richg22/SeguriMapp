import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./segurimapp.db', (err) => {
  if (err) {
    console.error('Error al crear la base de datos', err);
  } else {
    console.log('Base de datos creada!');
  }
});

// Crear tabla de usuarios
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error(err);
  else console.log('Tabla de usuarios lista!');
});

export default db;
