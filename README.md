# MMS Backend

API REST do sistema MMS para recebimento, armazenamento e consulta de leituras ambientais coletadas por dispositivos ESP32.

---

## Visão geral

O backend é responsável por:

- receber leituras enviadas pelos dispositivos
- armazenar os dados em banco SQLite
- disponibilizar endpoints para consumo pelo dashboard web
- permitir testes locais com simuladores

---

## Tecnologias utilizadas

- Node.js
- Express
- SQLite
- JavaScript

---

## Estrutura do projeto

- `server.js` → inicialização da API e rotas principais  
- `database.js` → conexão e operações com o banco SQLite  
- `simulador.js` → envio de leituras simuladas  
- `simulador-cenarios.js` → simulação de cenários  
- `contrato-api-esp32.txt` → referência de integração com ESP32  

---

## Funcionalidades

- recebimento de leituras via HTTP  
- armazenamento persistente  
- consulta de histórico  
- suporte a filtros por período  
- integração com ESP32 e dashboard  

---

## Como executar localmente

```bash
git clone https://github.com/rusilveira/mms-backend.git
cd mms-backend
npm install
node server.js
```

Acesse: http://localhost:3000/
