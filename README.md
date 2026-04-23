# 🛡️ Sec-OS: Real-Time Threat Intelligence Dashboard

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-success?style=for-the-badge)](https://noah.cyacad.com)
[![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)](#)
[![WebSockets](https://img.shields.io/badge/WebSockets-Enabled-orange?style=for-the-badge)](#)
[![Cowrie](https://img.shields.io/badge/Cowrie-Honeypot-yellow?style=for-the-badge)](#)

**Sec-OS** is an interactive, browser-based Security Operations Center (SOC) dashboard designed to capture, parse, and visualize live automated botnet traffic and malicious SSH intrusion attempts in real-time. 

Instead of relying on static logs, this project bridges the gap between offensive threat intelligence and defensive visualization by piping live data from a production honeypot directly into a responsive, high-fidelity web interface.


---

## 🏗️ System Architecture

This project is built on a custom, asynchronous data pipeline consisting of three primary layers:

### 1. The Sensor Layer (Data Capture)
* **Cowrie Honeypot:** Deployed on an exposed cloud VPS, listening on port 22 to intercept automated brute-force attacks, credential stuffing, and malicious payload drops.
* **Telemetry Generation:** Cowrie logs all interactions (commands executed, passwords attempted, binaries uploaded) into a structured JSON firehose.

### 2. The Relay Layer (Backend Pipeline)
* **Python Asynchronous Engine:** A lightweight `Flask-SocketIO` server running on a `gevent` worker engine parses the Cowrie logs in real-time.
* **Threat Enrichment:** Extracts critical intelligence (Target IP, attempted credentials, SHA256 payload hashes) and cross-references IPs with a geolocation API to map threat origins.
* **Nginx Reverse Proxy:** Routes encrypted WSS (WebSocket Secure) traffic from the public internet safely to the local Python engine.

### 3. The Visualization Layer (Frontend UI)
* **Interactive DOM:** A fully custom, vanilla JavaScript "virtual desktop" environment that dynamically handles window dragging, stacking (z-index manipulation), and mobile-responsive grid formatting.
* **Live Telemetry:** Uses `Socket.io-client` to ingest the backend data stream and dynamically update UI components without page refreshes.

---

## ✨ Core Dashboard Features

* **🌐 Global Geo-Tracker:** Utilizes `Leaflet.js` to plot the origin of incoming attacks on a dark-themed world map in real-time.
* **🧬 Dynamic Payload Analyzer:** An HTML5 Canvas/DOM hybrid tool that acts as a visual forensic extraction engine. It actively parses `[Direct Binary Uploads]` over SFTP and extracts the malware's SHA256 cryptographic hash for external Threat Intel cross-referencing.
* **🕸️ Node Swarm Topology:** An engineered HTML5 Canvas visualization of the network state. Employs color psychology (Cyan vs. Red) and a Time-To-Live (TTL) garbage-collection algorithm to combat alert fatigue, instantly drawing attention to active malicious sockets while cleanly expiring stale connections.
* **💻 Interactive Terminal Interface:** A simulated CLI that acts as a live attack firehose while also accepting custom user commands (e.g., `help`, `whoami`, `projects`).
* **📊 Attack Analytics:** Integrates `Chart.js` to categorize and graph historical and active attack vectors (Recon, Brute Force, Payloads, Script Execution).

---

## 📁 Repository Structure

```text
├── index.html       # The DOM structure and layout grids
├── style.css        # CSS variables, glassmorphism UI, and mobile media queries
├── app.js           # Window management, WebSocket listeners, and Canvas engines
└── relay.py         # The backend Python Flask-SocketIO parser (Hosted on VPS)
