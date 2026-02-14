# 🏥 VoiceTriage AI - Smart Patient Triage System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

**AI-Powered Hospital Triage & Patient Management System** built for Kanini Hackathon 2026

---

## 🎯 **Overview**

VoiceTriage AI is a comprehensive hospital management system that combines:
- 🚑 **Smart Patient Triage** - AI-based risk assessment and priority scoring
- 👨‍⚕️ **Doctor Booking System** - Real-time availability and capacity management
- 🌐 **Multilingual Support** - 6 Indian languages (English, Hindi, Tamil, Telugu, Malayalam, Kannada)
- 🎤 **Voice Input** - Speech-to-text for symptom capture
- 📊 **Real-time Dashboard** - Live queue monitoring and analytics

---

## ✨ **Key Features**

### **1. Intelligent Triage System**
- ✅ AI-powered risk assessment (Critical/Medium/Low)
- ✅ Automated priority scoring (0-100)
- ✅ Real-time patient queue management
- ✅ Department-based routing
- ✅ Vital signs monitoring

### **2. Doctor Booking & Management**
- ✅ One-click doctor assignment
- ✅ Capacity tracking (e.g., 3/5 patients)
- ✅ Availability management
- ✅ Department matching
- ✅ Booking validation (no double-booking)

### **3. Multilingual Interface**
- ✅ 6 languages supported
- ✅ Instant language switching
- ✅ Persistent language preference
- ✅ 300+ translated UI elements
- ✅ Works across all user roles

### **4. Role-Based Access**
- 👨‍💼 **Admin** - System oversight, analytics, staff management
- 👨‍⚕️ **Doctor** - Patient workspace, diagnosis, treatment plans
- 👩‍⚕️ **Nurse** - Vitals entry, triage queue, patient monitoring
- 🧑‍💼 **Receptionist** - Patient registration, lobby management
- 🧑‍🦱 **Patient** - Health portal, appointments, medical history

### **5. Patient Portal**
- ✅ Personal health dashboard
- ✅ Medical history timeline
- ✅ Health analytics & reports
- ✅ AI risk analysis
- ✅ Appointment management
- ✅ Doctor directory

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ installed
- Git installed
- Modern web browser

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/subash26s/med_link.git
cd med_link
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### **Running the Application**

**Option 1: Using separate terminals**

Terminal 1 - Backend:
```bash
cd backend
node server.js
```
Server runs on `http://localhost:5000`

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

**Option 2: Using the batch file (Windows)**
```bash
run_app.bat
```

### **Access the Application**

1. Open browser: `http://localhost:5173`
2. Login with demo credentials:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Doctor | `doctor` | `doctor123` |
| Nurse | `nurse` | `nurse123` |
| Receptionist | `receptionist` | `receptionist123` |
| Patient | `patient` | `patient123` |

---

## 📱 **Main Features & Pages**

### **Triage Queue System** (`/triage-queue`)
- Real-time patient queue with auto-refresh
- Risk-based categorization (🔴 Critical / 🟠 Medium / 🟢 Low)
- Complete vitals display (HR, Temp, SpO2, BP)
- One-click doctor booking
- Department matching

### **Admin Dashboard** (`/admin`)
- System analytics and metrics
- Patient traffic monitoring (24h)
- Hospital capacity overview
- Staff management
- Live patient registry

### **Doctor Dashboard** (`/doctor`)
- Priority patient queue
- Clinical workspace
- Patient vitals and history
- Diagnosis notes
- Treatment planning

### **Nurse Dashboard** (`/nurse`)
- Patient queue management
- Vitals entry interface
- AI triage analysis
- Priority alerts

### **Patient Portal** (`/patient/portal`)
- Personal health dashboard
- Medical history timeline
- Health analytics & charts
- AI risk analysis
- Appointment booking
- Profile management

---

## 🏗️ **Tech Stack**

### **Frontend**
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons

### **Backend**
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite** - Database
- **JSON Files** - Data storage (triage/booking)
- **JWT** - Authentication
- **bcrypt** - Password hashing

### **AI/ML**
- Risk assessment algorithm
- Priority scoring system
- IndicTrans2 integration (multilingual)

---

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### **Patients**
- `GET /api/patients/queue` - Get patient queue
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `PUT /api/patients/:id/status` - Update status

### **Triage Queue**
- `GET /triage/queue` - Get all patients sorted by priority
- `GET /triage/patient/:id` - Get specific patient
- `POST /triage/add` - Add patient to queue
- `PUT /triage/update/:id` - Update patient
- `DELETE /triage/remove/:id` - Remove patient

### **Doctor Booking**
- `GET /booking/doctors` - Get all doctors
- `GET /booking/doctors/:dept` - Get doctors by department
- `POST /booking/book` - Book doctor for patient
- `POST /booking/cancel` - Cancel booking
- `GET /booking/status/:id` - Get booking status

---

## 📁 **Project Structure**

```
VoiceTriageAI/
├── backend/
│   ├── ai/                    # AI risk models
│   ├── config/                # Database configuration
│   ├── controllers/           # Request handlers
│   ├── data/                  # JSON data files
│   │   ├── patients.json      # Patient queue data
│   │   └── doctors.json       # Doctor availability
│   ├── middleware/            # Auth middleware
│   ├── routes/                # API routes
│   │   ├── triage.js          # Triage queue API
│   │   └── booking.js         # Booking API
│   ├── services/              # External services
│   └── server.js              # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LanguageContext.jsx
│   │   │   └── PatientContext.jsx
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Application pages
│   │   │   ├── patient/       # Patient portal pages
│   │   │   ├── TriageQueuePage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   └── NurseDashboard.jsx
│   │   ├── translations/      # Language files
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   ├── ta.json
│   │   │   ├── te.json
│   │   │   ├── ml.json
│   │   │   └── kn.json
│   │   └── App.jsx            # Main app component
│   └── index.html
├── TRIAGE_BOOKING_SYSTEM_GUIDE.md
├── MULTILINGUAL_IMPLEMENTATION_SUMMARY.md
└── README.md
```

---

## 🎨 **Screenshots**

### Triage Queue System
Real-time patient queue with risk-based categorization and doctor booking.

### Patient Dashboard
Comprehensive health overview with vitals, AI insights, and appointments.

### Doctor Workspace
Clinical interface for patient management and diagnosis.

---

## 🔧 **Configuration**

### **Backend Configuration**
Edit `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_secret_key_here
DATABASE_URL=./voicetriage.sqlite
```

### **Frontend Configuration**
Edit `frontend/vite.config.js` for proxy settings:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 📚 **Documentation**

- **[Triage & Booking System Guide](TRIAGE_BOOKING_SYSTEM_GUIDE.md)** - Complete technical documentation
- **[Multilingual Implementation](MULTILINGUAL_IMPLEMENTATION_SUMMARY.md)** - Translation system details
- **[Quick Start Guide](README_TRIAGE_SYSTEM.md)** - Fast setup instructions

---

## 🧪 **Testing**

### **Test Scenario 1: Book Critical Patient**
1. Login as nurse (`nurse` / `nurse123`)
2. Navigate to Triage Queue
3. Click on "Arun Kumar" (Critical patient)
4. Select "Dr. Priya Sharma" (Cardiology)
5. Click "Confirm Booking"
6. ✅ Booking confirmed

### **Test Scenario 2: View Patient Analytics**
1. Login as patient (`patient` / `patient123`)
2. Go to Health Analytics
3. View vitals history charts
4. Check AI prognosis

### **Test Scenario 3: Language Switching**
1. Login with any role
2. Click language dropdown (top right)
3. Select Hindi/Tamil/Telugu
4. ✅ All UI updates instantly

---

## 🌐 **Multilingual Support**

Supported languages:
- 🇬🇧 English (en)
- 🇮🇳 Hindi (hi)
- 🇮🇳 Tamil (ta)
- 🇮🇳 Telugu (te)
- 🇮🇳 Malayalam (ml)
- 🇮🇳 Kannada (kn)

**Features:**
- Instant language switching
- Persistent preference (localStorage)
- 300+ translated keys
- Works across all roles
- Supports variable replacement

---

## 🏆 **Hackathon Features**

### **Why This Wins**
1. ✅ **Fully Functional** - Real backend + database
2. ✅ **Beautiful UI** - Modern, responsive design
3. ✅ **Smart AI** - Risk scoring and triage
4. ✅ **Real-time** - Auto-refresh, live updates
5. ✅ **Complete System** - End-to-end workflow
6. ✅ **Multilingual** - 6 Indian languages
7. ✅ **Professional** - Hospital-grade quality
8. ✅ **Scalable** - Production-ready architecture
9. ✅ **Well-Documented** - Comprehensive guides
10. ✅ **Demo-Ready** - 80-second pitch script included

---

## 🚀 **Future Enhancements**

- [ ] WebSocket for real-time updates
- [ ] SMS/Email notifications
- [ ] QR code patient check-in
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Prescription management
- [ ] Lab report integration
- [ ] Telemedicine support
- [ ] MongoDB migration

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Team**

**Built for Kanini Hackathon 2026**

- **Developer**: Subash S
- **GitHub**: [@subash26s](https://github.com/subash26s)
- **Email**: subash26s@gmail.com

---

## 🙏 **Acknowledgments**

- Kanini for organizing the hackathon
- React and Node.js communities
- TailwindCSS for amazing styling
- All open-source contributors

---

## 📞 **Support**

For issues or questions:
- 📧 Email: subash26s@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/subash26s/med_link/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/subash26s/med_link/discussions)

---

## ⭐ **Star This Repo**

If you find this project useful, please give it a star! ⭐

---

**Made with ❤️ for better healthcare**

**Status**: Production Ready ✅  
**Last Updated**: February 15, 2026  
**Version**: 1.0.0
