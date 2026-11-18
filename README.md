# MMS Backend

REST API for receiving, storing and retrieving environmental readings collected by ESP32-based devices.

> Part of the **[Smart Beehive Monitoring System](https://github.com/rusilveira/rusilveira#smart-beehive-monitoring-system)**: [sensor node](https://github.com/rusilveira/esp32-beehive-sensor-node-lora) · [LoRa link](https://github.com/rusilveira/esp32-lora-reliable-link) · [gateway](https://github.com/rusilveira/esp32-beehive-lora-gateway) · **API** · [dashboard](https://github.com/rusilveira/mms-frontend)

---

## Problem

Readings that arrive from the LoRa gateway need to be stored safely and served to the dashboard, filtered by period, without making the embedded device wait.

## Solution

A REST API in Node.js and Express backed by PostgreSQL. The gateway posts each reading and gets a fast response; the dashboard queries history by period or date range. Simulation scripts make it possible to test the whole flow without hardware.

---

## Overview

This backend is responsible for:

- receiving sensor readings from devices
- storing data in a relational database
- providing endpoints for frontend consumption
- enabling local testing through simulation scripts

---

## Technologies

- Node.js
- Express
- PostgreSQL
- JavaScript

---

## Project Structure

- `server.js` → Express API initialization and route handling
- `database.js` → PostgreSQL connection and table initialization
- `simulador.js` → basic reading simulation
- `simulador-cenarios.js` → scenario-based simulation
- `contrato-api-esp32.txt` → ESP32/Gateway payload contract

---

## Features

- HTTP-based data ingestion from ESP32 gateway
- low-latency POST response optimized for embedded communication
- persistent PostgreSQL data storage
- historical data retrieval
- period-based filtering
- custom date range filtering
- ESP32 timestamp support
- integration-ready with frontend monitoring dashboard

---

## API Endpoints

### Get readings

```http
GET /api/readings
GET /api/readings?period=24h
GET /api/readings?period=7d
GET /api/readings?period=30d
GET /api/readings?period=all
GET /api/readings?start=2026-04-23&end=2026-04-23
```

## Create reading

```http
POST /api/readings
```

## API status

```http
GET /api/status
```

## Deployment

This backend is currently deployed on Render and connected to a PostgreSQL cloud database.

It is designed to receive real-time readings from the ESP32 LoRa Wi-Fi gateway and serve processed historical data to the monitoring dashboard.

---

## Getting Started

```bash
git clone https://github.com/rusilveira/mms-backend.git
cd mms-backend
npm install
node server.js
```
Access the API at:
http://localhost:3000

---

## Author

**Ruan Silveira** · Industrial instrumentation technician and Electrical Engineering student  
[GitHub](https://github.com/rusilveira) · [LinkedIn](https://www.linkedin.com/in/ruan-silveira-494110257)

## License

MIT. See [LICENSE](LICENSE).
