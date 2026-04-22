const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS readings (
      id SERIAL PRIMARY KEY,
      colmeia_id TEXT NOT NULL,
      temperatura REAL NOT NULL,
      umidade REAL NOT NULL,
      temperatura_interna REAL,
      umidade_interna REAL,
      temperatura_externa REAL,
      umidade_externa REAL,
      peso REAL NOT NULL,
      bateria REAL NOT NULL,
      dataCompleta TIMESTAMPTZ NOT NULL
    )
  `);

  console.log("Banco PostgreSQL conectado e tabela verificada.");
}

module.exports = {
  pool,
  initDatabase,
};