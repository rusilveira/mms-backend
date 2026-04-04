const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "mms.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err.message);
  } else {
    console.log("Banco SQLite conectado.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      colmeia_id TEXT NOT NULL,
      temperatura REAL NOT NULL,
      umidade REAL NOT NULL,
      peso REAL NOT NULL,
      bateria REAL NOT NULL,
      dataCompleta TEXT NOT NULL
    )
  `);
});

module.exports = db;