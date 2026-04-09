# MMS Backend

REST API for receiving, storing and retrieving environmental readings collected by ESP32-based devices.

---

## Overview

This backend is responsible for:

- receiving sensor readings from devices
- storing data in a SQLite database
- providing endpoints for frontend consumption
- enabling local testing through simulation scripts

---

## Technologies

- Node.js
- Express
- SQLite
- JavaScript

---

## Project Structure

- `server.js` → API initialization and routes
- `database.js` → database connection and queries
- `simulador.js` → basic reading simulation
- `simulador-cenarios.js` → scenario-based simulation
- `contrato-api-esp32.txt` → ESP32 integration reference

---

## Features

- HTTP-based data ingestion
- persistent data storage
- historical data retrieval
- period-based filtering
- integration-ready with ESP32 and frontend dashboard

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
