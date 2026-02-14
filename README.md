# VoiceTriage AI - Hackathon MVP

A full-stack Progressive Web App (PWA) for hospital patient intake, vitals monitoring, and AI-assisted triage using Voice-to-Text.

## Prerequisites
- Node.js (v18+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
Create a MySQL database named `voicetriage_db`.
(Tables will be auto-created by the backend on first run).

 Update `backend/.env` with your credentials:
```env
DB_USER=root
DB_PASSWORD=your_password
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## Features & Usage

1. **Login**:
   - **Admin**: username `admin`, password `admin123` (Auto-registers on first login)
   - **Doctor**: username `doctor`, password `doc123`
   - **Nurse**: username `nurse`, password `nurse123`
   - **Kiosk**: username `kiosk`, password `kiosk123` (Or specific Kiosk URL)

2. **Patient Kiosk** (`/kiosk`):
   - Patients enter details.
   - Use Microphone to speak symptoms (e.g., "I have severe chest pain").
   - AI assigns initial simple triage score.

3. **Nurse Dashboard** (`/nurse`):
   - View waiting list.
   - Select patient -> Enter Vitals (BP, HR, SpO2, Temp).
   - **AI Recalculates Score** based on Vitals (e.g., High BP + Chest Pain = RED).

4. **Doctor Dashboard** (`/doctor`):
   - View prioritized queue (Red > Yellow > Green).
   - Live updates every 5 seconds.

5. **Admin Dashboard** (`/admin`):
   - View analytics (Total patients, triage distribution, avg score).

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons, Recharts (pwa-plugin enabled)
- **Backend**: Node.js, Express, MySQL (mysql2)
- **AI**: Simple rule-based keyword & vitals logic
