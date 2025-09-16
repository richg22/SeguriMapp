// Backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./Database/db');

const app = express();
app.use(cors());            // permitir CORS en dev [4]
app.use(express.json());    // parseo JSON [7]

const PORT = process.env.PORT || 3001;
const SALT_ROUNDS = 12;

// Validador simple
const isValidEmail = (email) => typeof email === 'string' && /\S+@\S+\.\S+/.test(email);

// Salud
app.get('/health', (_req, res) => res.json({ ok: true })); // [5]

// Registro
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body || {};

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS); // [8]

    const sql = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
    db.run(sql, [String(name), String(email).toLowerCase(), passwordHash], function (err) {
      if (err) {
        if (String(err.code || '').includes('SQLITE_CONSTRAINT')) {
          return res.status(409).json({ error: 'El email ya está registrado' });
        }
        return res.status(500).json({ error: 'Error al guardar el usuario' });
      }
      return res.status(201).json({
        id: this.lastID,
        name: String(name),
        email: String(email).toLowerCase(),
      });
    });
  } catch (e) {
    return res.status(500).json({ error: 'Error interno' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan email y/o contraseña' });
  }
  const normEmail = String(email).toLowerCase();

  db.get(
    'SELECT id, name, email, password_hash FROM users WHERE email = ?',
    [normEmail],
    async (err, row) => {
      if (err) return res.status(500).json({ error: 'Error interno' });   // [9]
      if (!row) return res.status(401).json({ error: 'Credenciales inválidas' });
      const ok = await bcrypt.compare(String(password), row.password_hash); // [8]
      if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
      return res.status(200).json({ id: row.id, name: row.name, email: row.email });
    }
  );
});

// Raíz opcional
app.get('/', (_req, res) => res.send('SeguriMapp API viva'));

app.listen(PORT, () => {
  console.log(`API local en http://localhost:${PORT}`);
});
