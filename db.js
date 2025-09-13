const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  user: 'postgres',        // tu usuario de PostgreSQL
  host: 'localhost',       // si es local, normalmente es localhost
  database: 'Segurimapp',  // el nombre de tu base de datos
  password: 'Segurimapp2025', // la contraseña que pusiste al instalar PostgreSQL
  port: 5432,              // puerto por defecto de PostgreSQL
});

module.exports = pool;
