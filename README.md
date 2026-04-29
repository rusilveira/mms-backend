# MMS Backend

REST API for receiving, storing and retrieving environmental readings collected by ESP32-based devices.

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

## License

This project is protected under a custom license.

It is provided for viewing and educational purposes only.  
Unauthorized use, copying, modification, or distribution is strictly prohibited.

See the LICENSE file for more details.

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
