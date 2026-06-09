# 🌪️ AgroShield AI: Software & Predictive Analytics Platform

> **AI-Driven Crop Protection & Intelligent Windbreak Net Automation for Banana Farmers**

---

> [!IMPORTANT]
> **Project Scope Notice**  
> This repository contains the **Software and AI Platform** of AgroShield AI. This includes the FastAPI backend, the Random Forest predictive model, the JWT-based authentication system, and the React glassmorphism monitoring dashboard.  
> **Note:** The physical hardware components (sensor nodes, ESP32/Arduino microcontroller firmware, anemometer/telemetry integration, and stepper motor actuators for deploying physical windbreak nets) are a separate phase of the project and will be added to this ecosystem in the future.

---

**AgroShield AI** is an advanced, real-time IoT monitoring and predictive analytics platform built specifically for banana farmers to protect their crops against severe winds, cyclones, and adverse weather conditions.

By combining live sensor telemetry with a Scikit-Learn Machine Learning engine, AgroShield AI proactively predicts crop damage probability and automatically deploys windbreak nets to save yields before storms hit.

---

## 📸 Screenshots

### 🖥️ Farm Dashboard
Real-time wind telemetry across all farms, net deployment status, and live AI risk predictions — all in a single view.

![Farm Dashboard — full sidebar](images/dashboard.png)
![Farm Dashboard — collapsed sidebar](images/dashboard-collapsed.png)

---

### 🤖 AI Predictions
Machine learning–powered damage risk scores for each registered farm. Shows model accuracy (94.2%), true positive rate (91.8%), peak wind forecast time, and actionable AI recommendations.

![AI Predictions Page](images/ai-predictions.png)

---

### 🌤️ Weather Forecasts
7-day wind forecast bar chart with per-day max wind speed, gust levels, and rainfall. Includes a 24-hour hourly breakdown for precise planning.

![Weather Forecasts Page](images/forecasts.png)

---

### 📊 Analytics
Performance metrics dashboard showing total deployments (147), average net response time (4.2s), losses prevented (₹28.5L), and risk distribution donut chart across all farms.

![Analytics Page](images/analytics.png)

---

### 📋 System Events
Full audit trail of all critical alerts, auto-deployments, and system activities — filterable by type (Alert / Deployment / System).

![System Events Page](images/events.png)

---

### 📝 Damage Reports
Report, track, and log crop damage incidents across farms with severity classification and estimated loss tracking in INR.

![Damage Reports Page](images/damage-reports.png)

---

### ⚙️ Settings
Configure user profile, notification preferences (SMS, Email, Push), and wind speed thresholds (Warning → Auto Deploy → Critical) with interactive sliders.

![Settings Page](images/settings.png)

---

## ⚡ System Architecture

The following diagram illustrates how the software layers in this repository integrate with the planned physical IoT hardware:

```mermaid
flowchart TD
    classDef default fill:#1e293b,stroke:#475569,stroke-width:1px,color:#f8fafc;
    classDef hardware fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#93c5fd;
    classDef software fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#a7f3d0;
    classDef database fill:#0f172a,stroke:#f59e0b,stroke-width:1px,color:#fde68a;

    subgraph Hardware_Layer ["📡 Hardware & Physical Layer (Future Phase)"]
        Sensors["Weather Sensors (Anemometer, DHT22)"]:::hardware
        MCU["ESP32 / LoRa Node Microcontroller"]:::hardware
        Actuators["Stepper Motor / Net Actuators"]:::hardware
        Sensors -->|Analog/I2C Telemetry| MCU
        MCU -->|GPIO High/Low| Actuators
    end

    subgraph Software_Layer ["💻 AgroShield Software Ecosystem (This Repo)"]
        API["FastAPI Backend Server"]:::software
        ML["Random Forest ML Predictor"]:::software
        DB[("SQLite Database & SQLAlchemy")]:::database
        SMS["SMS Notification Gateway (Twilio)"]:::software
        Dashboard["React + Vite Frontend (Glassmorphism Dashboard)"]:::software

        MCU -.->|HTTPS / WebSockets Telemetry| API
        API -.->|Trigger Actuation Command| MCU

        API <-->|Retrieve/Update State| DB
        API <-->|Evaluate Features & Fetch Predictions| ML
        API -->|Dispatch Alert Payloads| SMS
        Dashboard <-->|REST Requests & WebSocket Stream| API
    end
```

---

## ✨ Key Features

### 🧠 Real-Time AI Prediction Engine
*   Driven by a custom-trained **Random Forest Regressor** (Scikit-Learn) with **94.2% accuracy** and a **91.8% true positive rate**.
*   Continuously analyses wind velocity, gust intensity, ambient temperature, humidity, farm area, and net coverage to output a live **Damage Probability Score (0–100%)**.
*   Generates actionable AI recommendations per farm (e.g. *"High risk window approaching. Auto-deployment logic active."*).

### 🌬️ Autonomous Risk Escalation & Net Control
*   Dynamically escalates threat levels: **Safe** 🟢 ➔ **Moderate** 🟡 ➔ **High** 🟠 ➔ **Severe** 🔴.
*   Auto-deploys windbreak nets when gust thresholds are exceeded (configurable per farm in Settings).
*   Tracks net state — **Deployed / Deploying / Retracted** — in real time.

### 📱 Smart Alerting & SMS Notifications
*   Instant SMS dispatch on critical events or auto-deployments via **Twilio** (Mock Mode available for development).
*   Full audit log of all alerts, deployments, and system events in the **System Events** page.

### 📊 Premium Analytics Dashboard
*   Tracks **147 total deployments**, **₹28.5L losses prevented**, and **4.2s average net response time**.
*   Risk distribution donut chart, monthly deployment bar charts, and net response time trend line.

### 📅 7-Day Weather Forecasts
*   Per-day max wind, gust, and rainfall breakdown.
*   24-hour hourly wind speed & temperature display for granular planning.

### 🔐 Role-Based Access Control (RBAC)
*   JWT authentication supporting three tiers: **Admin**, **Farm Manager**, and **Farmer**.
*   Each role gets a tailored permission set across all dashboard views.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide React |
| **Backend** | FastAPI (Python), SQLAlchemy, SQLite |
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib |
| **Auth & Security** | Passlib, PyJWT |
| **Notifications** | Twilio SMS (Mock Mode for dev) |

---

## 📂 Repository Layout

```
.
├── backend/
│   ├── app/              # FastAPI core (routes, schemas, models, seed data)
│   │   └── ml_models/    # Trained Random Forest model binaries
│   ├── scripts/          # ML training & storm simulation scripts
│   └── requirements.txt
├── images/               # App screenshots (used in this README)
│   ├── dashboard.png
│   ├── ai-predictions.png
│   ├── analytics.png
│   ├── forecasts.png
│   ├── events.png
│   ├── damage-reports.png
│   └── settings.png
├── src/                  # React Frontend
│   ├── components/       # Reusable UI widgets
│   ├── pages/            # Dashboard, Forecasts, Events, Analytics, AI Predictions, Settings
│   └── App.jsx
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/omrajput14/agroshield.git
cd agroshield
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Seed the SQLite database with mock users and farms
python app/seed.py

# Train the Random Forest Machine Learning model
python scripts/train_ml_model.py

# Start the FastAPI server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Open a new terminal in the root directory:
```bash
npm install
npm run dev
```

### 4. Access the Application
Open `http://localhost:5173` in your browser and log in with:
*   **Email:** `farmer@agroshield.ai`
*   **Password:** `password123`

---

## 🚨 Triggering a Mock Storm Simulation

While the backend server is running, open a new terminal and execute:
```bash
cd backend
source venv/bin/activate
python scripts/trigger_alert.py
```
This simulates a **Category 1 cyclonic wind spike** at Sakshi Agro Farm, auto-deploys the nets, and logs a mock SMS alert to the terminal.

---

## 🔌 Hardware Roadmap (Upcoming Phase)

The physical IoT components planned for integration with this platform include:

| Component | Details |
|---|---|
| **Microcontrollers** | ESP32 nodes over Wi-Fi / LoRaWAN |
| **Wind Sensors** | Anemometers for real-time speed & gust measurement |
| **Environment Sensors** | DHT22 for temperature & humidity readings |
| **Actuators** | Relay-controlled 12V stepper/servo motors for rolling out or retracting reinforced windbreak canvases |
| **Firmware** | Arduino/ESP-IDF firmware (separate repository, to be linked) |
