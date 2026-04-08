const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API do MMS rodando.");
});

app.get("/api/readings", (req, res) => {
  const period = req.query.period || "24h";

  let limiteData = null;

  if (period === "24h") {
    limiteData = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  } else if (period === "7d") {
    limiteData = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (period === "30d") {
    limiteData = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  let sql = `SELECT * FROM readings`;
  const params = [];

  if (limiteData) {
    sql += ` WHERE dataCompleta >= ?`;
    params.push(limiteData);
  }

  sql += ` ORDER BY dataCompleta ASC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar leituras:", err);
      return res.status(500).json({ erro: "Erro ao buscar leituras." });
    }

    const dadosFormatados = rows.map((item) => ({
      id: item.id,
      colmeia_id: item.colmeia_id,
      hora: new Date(item.dataCompleta).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dataCompleta: item.dataCompleta,
      temperatura: item.temperatura,
      umidade: item.umidade,
      peso: item.peso,
      bateria: item.bateria,
    }));

    res.json(dadosFormatados);
  });
});

app.post("/api/readings", (req, res) => {
  const { colmeia_id, temperatura, umidade, peso, bateria, dataCompleta } = req.body;

  if (
    !colmeia_id ||
    temperatura === undefined ||
    umidade === undefined ||
    peso === undefined ||
    bateria === undefined
  ) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }

  const tempNum = Number(temperatura);
  const umiNum = Number(umidade);
  const pesoNum = Number(peso);
  const bateriaNum = Number(bateria);

  if (
    Number.isNaN(tempNum) ||
    Number.isNaN(umiNum) ||
    Number.isNaN(pesoNum) ||
    Number.isNaN(bateriaNum)
  ) {
    return res.status(400).json({ erro: "Valores numéricos inválidos." });
  }

  const timestamp = dataCompleta || new Date().toISOString();

  const sql = `
    INSERT INTO readings (colmeia_id, temperatura, umidade, peso, bateria, dataCompleta)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [colmeia_id, tempNum, umiNum, pesoNum, bateriaNum, timestamp],
    function (err) {
      if (err) {
        console.error("Erro ao salvar leitura:", err);
        return res.status(500).json({ erro: "Erro ao salvar leitura." });
      }

      res.status(201).json({
        mensagem: "Leitura salva com sucesso.",
        id: this.lastID,
      });
    }
  );
});

app.get("/api/status", (req, res) => {
  db.get(`SELECT COUNT(*) as total FROM readings`, [], (errCount, rowCount) => {
    if (errCount) {
      console.error("Erro ao consultar banco:", errCount);
      return res.status(500).json({ erro: "Erro ao consultar banco." });
    }

    db.get(
      `SELECT * FROM readings ORDER BY dataCompleta DESC LIMIT 1`,
      [],
      (errLast, rowLast) => {
        if (errLast) {
          console.error("Erro ao consultar última leitura:", errLast);
          return res.status(500).json({ erro: "Erro ao consultar última leitura." });
        }

        res.json({
          api: "online",
          banco: "online",
          totalLeituras: rowCount?.total || 0,
          ultimaLeitura: rowLast || null,
          servidorEm: new Date().toISOString(),
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.delete("/api/readings", (req, res) => {
  db.run("DELETE FROM readings", [], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao apagar dados" });
    }

    res.json({ mensagem: "Todos os dados foram apagados" });
  });
});