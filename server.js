const express = require("express");
const cors = require("cors");
const { pool, initDatabase } = require("./database");

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

app.get("/api/readings", async (req, res) => {
  try {
    const period = req.query.period || "24h";
    const { start, end } = req.query;

    let query = `SELECT * FROM readings`;
    const params = [];
    const where = [];

    if (start && end) {
      params.push(`${start}T00:00:00-03:00`);
      params.push(`${end}T23:59:59.999-03:00`);
      where.push(`dataCompleta BETWEEN $1 AND $2`);
    } else {
      let limiteData = null;

      if (period === "24h") {
        limiteData = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      } else if (period === "7d") {
        limiteData = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (period === "30d") {
        limiteData = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (period === "all") {
        limiteData = null;
      }

      if (limiteData) {
        params.push(limiteData);
        where.push(`dataCompleta >= $1`);
      }
    }

    if (where.length) {
      query += ` WHERE ${where.join(" AND ")}`;
    }

    query += ` ORDER BY dataCompleta ASC`;

    const result = await pool.query(query, params);
    const rows = result.rows;

    const dadosFormatados = rows.map((item) => ({
      id: item.id,
      colmeia_id: item.colmeia_id,
      hora: new Date(item.datacompleta).toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
      }),
      dataCompleta: item.datacompleta,
      temperaturaInterna: item.temperatura_interna,
      umidadeInterna: item.umidade_interna,
      temperaturaExterna: item.temperatura_externa,
      umidadeExterna: item.umidade_externa,
      peso: item.peso,
      bateria: item.bateria,
    }));

    res.json(dadosFormatados);
  } catch (err) {
    console.error("Erro ao buscar leituras:", err);
    res.status(500).json({ erro: "Erro ao buscar leituras." });
  }
});

app.post("/api/readings", async (req, res) => {
  try {
    const {
      colmeia_id,
      temperatura,
      umidade,
      interna,
      externa,
      peso,
      bateria,
      dataCompleta,
    } = req.body;

    if (!colmeia_id || peso === undefined || bateria === undefined) {
      return res.status(400).json({ erro: "Dados incompletos." });
    }

    let tempInterna;
    let umiInterna;
    let tempExterna;
    let umiExterna;

    const formatoNovoValido =
      interna &&
      externa &&
      interna.temperatura !== undefined &&
      interna.umidade !== undefined &&
      externa.temperatura !== undefined &&
      externa.umidade !== undefined;

    if (formatoNovoValido) {
      tempInterna = Number(interna.temperatura);
      umiInterna = Number(interna.umidade);
      tempExterna = Number(externa.temperatura);
      umiExterna = Number(externa.umidade);
    } else {
      if (temperatura === undefined || umidade === undefined) {
        return res.status(400).json({
          erro: "Dados incompletos. Envie temperatura/umidade ou interna/externa.",
        });
      }

      const tempNum = Number(temperatura);
      const umiNum = Number(umidade);

      if (Number.isNaN(tempNum) || Number.isNaN(umiNum)) {
        return res.status(400).json({ erro: "Valores numéricos inválidos." });
      }

      tempInterna = tempNum;
      umiInterna = umiNum;
      tempExterna = tempNum;
      umiExterna = umiNum;
    }

    const pesoNum = Number(peso);
    const bateriaNum = Number(bateria);

    if (
      Number.isNaN(tempInterna) ||
      Number.isNaN(umiInterna) ||
      Number.isNaN(tempExterna) ||
      Number.isNaN(umiExterna) ||
      Number.isNaN(pesoNum) ||
      Number.isNaN(bateriaNum)
    ) {
      return res.status(400).json({ erro: "Valores numéricos inválidos." });
    }

    const timestamp = dataCompleta || new Date().toISOString();

    await pool.query(
      `
      INSERT INTO readings (
        colmeia_id,
        temperatura,
        umidade,
        temperatura_interna,
        umidade_interna,
        temperatura_externa,
        umidade_externa,
        peso,
        bateria,
        dataCompleta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        colmeia_id,
        tempInterna,
        umiInterna,
        tempInterna,
        umiInterna,
        tempExterna,
        umiExterna,
        pesoNum,
        bateriaNum,
        timestamp,
      ]
);

res.sendStatus(201);

  } catch (err) {
    console.error("Erro ao salvar leitura:", err);
    res.status(500).json({ erro: "Erro ao salvar leitura." });
  }
});

app.get("/api/status", async (req, res) => {
  try {
    const countResult = await pool.query(`SELECT COUNT(*)::int as total FROM readings`);
    const lastResult = await pool.query(
      `SELECT * FROM readings ORDER BY dataCompleta DESC LIMIT 1`
    );

    const rowCount = countResult.rows[0];
    const rowLast = lastResult.rows[0];

    let ultimaLeituraFormatada = null;

    if (rowLast) {
      ultimaLeituraFormatada = {
        id: rowLast.id,
        colmeia_id: rowLast.colmeia_id,
        dataCompleta: rowLast.datacompleta,
        temperaturaInterna:
          rowLast.temperatura_interna !== null &&
          rowLast.temperatura_interna !== undefined
            ? rowLast.temperatura_interna
            : rowLast.temperatura,
        umidadeInterna:
          rowLast.umidade_interna !== null &&
          rowLast.umidade_interna !== undefined
            ? rowLast.umidade_interna
            : rowLast.umidade,
        temperaturaExterna:
          rowLast.temperatura_externa !== null &&
          rowLast.temperatura_externa !== undefined
            ? rowLast.temperatura_externa
            : rowLast.temperatura,
        umidadeExterna:
          rowLast.umidade_externa !== null &&
          rowLast.umidade_externa !== undefined
            ? rowLast.umidade_externa
            : rowLast.umidade,
        peso: rowLast.peso,
        bateria: rowLast.bateria,
      };
    }

    res.json({
      api: "online",
      banco: "online",
      totalLeituras: rowCount?.total || 0,
      ultimaLeitura: ultimaLeituraFormatada,
      servidorEm: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro ao consultar status:", err);
    res.status(500).json({ erro: "Erro ao consultar banco." });
  }
});

// Recomendo remover esta rota em produção.
// Se quiser manter, proteja com token/senha.
app.delete("/api/readings", async (req, res) => {
  try {
    await pool.query("DELETE FROM readings");
    res.json({ mensagem: "Todos os dados foram apagados" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao apagar dados" });
  }
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao iniciar banco:", err);
    process.exit(1);
  });