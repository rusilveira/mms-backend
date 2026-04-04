const API_URL = "http://localhost:3000/api/readings";

function rand(min, max, casas = 1) {
  return Number((Math.random() * (max - min) + min).toFixed(casas));
}

async function enviarLeitura() {
  const agora = new Date();

  const payload = {
    colmeia_id: "COL-01",
    temperaturaInterna: rand(29.5, 33.5, 1),
    umidadeInterna: rand(68, 80, 0),
    temperaturaExterna: rand(22, 31, 1),
    umidadeExterna: rand(55, 78, 0),
    peso: rand(5.6, 5.95, 2),
    bateria: rand(3.78, 4.05, 3),
    dataCompleta: agora.toISOString(),
  };

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

    console.log(`[${agora.toLocaleTimeString("pt-BR")}] Leitura enviada com sucesso`);
    console.log(payload);
    console.log("Resposta:", json);
    console.log("--------------------------------------------------");
  } catch (err) {
    console.error("Erro ao enviar leitura:", err.message);
  }
}

enviarLeitura();
setInterval(enviarLeitura, 15000);