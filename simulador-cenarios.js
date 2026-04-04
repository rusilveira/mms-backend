const API_URL = "http://localhost:3000/api/readings";

function rand(min, max, casas = 1) {
  return Number((Math.random() * (max - min) + min).toFixed(casas));
}

function gerarLeitura(cenario = "normal") {
  const agora = new Date();

  const base = {
    colmeia_id: "COL-01",
    dataCompleta: agora.toISOString(),
  };

  if (cenario === "normal") {
    return {
      ...base,
      temperaturaInterna: rand(29.5, 33.5, 1),
      umidadeInterna: rand(68, 80, 0),
      temperaturaExterna: rand(22, 31, 1),
      umidadeExterna: rand(55, 78, 0),
      peso: rand(5.6, 5.95, 2),
      bateria: rand(3.78, 4.05, 3),
    };
  }

  if (cenario === "temperatura_critica") {
    return {
      ...base,
      temperaturaInterna: rand(34.5, 38.5, 1),
      umidadeInterna: rand(60, 72, 0),
      temperaturaExterna: rand(29, 36, 1),
      umidadeExterna: rand(45, 65, 0),
      peso: rand(5.5, 5.85, 2),
      bateria: rand(3.8, 4.0, 3),
    };
  }

  if (cenario === "bateria_baixa") {
    return {
      ...base,
      temperaturaInterna: rand(30, 33, 1),
      umidadeInterna: rand(68, 78, 0),
      temperaturaExterna: rand(23, 30, 1),
      umidadeExterna: rand(55, 75, 0),
      peso: rand(5.55, 5.9, 2),
      bateria: rand(3.2, 3.48, 3),
    };
  }

  if (cenario === "sem_dados") {
    return {
      ...base,
      temperaturaInterna: null,
      umidadeInterna: null,
      temperaturaExterna: null,
      umidadeExterna: null,
      peso: null,
      bateria: null,
    };
  }

  return {
    ...base,
    temperaturaInterna: rand(29.5, 33.5, 1),
    umidadeInterna: rand(68, 80, 0),
    temperaturaExterna: rand(22, 31, 1),
    umidadeExterna: rand(55, 78, 0),
    peso: rand(5.6, 5.95, 2),
    bateria: rand(3.78, 4.05, 3),
  };
}

async function enviarLeitura(cenario) {
  const payload = gerarLeitura(cenario);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Erro HTTP:", res.status, json);
      return;
    }

    console.log(`Cenário: ${cenario}`);
    console.log(payload);
    console.log("Resposta:", json);
    console.log("--------------------------------------------------");
  } catch (err) {
    console.error("Erro ao enviar leitura:", err.message);
  }
}

const cenario = process.argv[2] || "normal";

enviarLeitura(cenario);
setInterval(() => enviarLeitura(cenario), 15000);