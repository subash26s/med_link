# 🚑 Triage Queue + Doctor Booking System - Implementation Guide

## ✅ **FULLY WORKING SYSTEM**

This is a **production-ready** triage queue and doctor booking system with complete backend integration.

---

## 🎯 **What Was Built**

### **Backend Components**
1. ✅ **Patient Data** (`/backend/data/patients.json`)
   - 6 sample patients with complete vitals
   - Risk levels: Critical, Medium, Low
   - Department assignments
   - Booking status tracking

2. ✅ **Doctor Data** (`/backend/data/doctors.json`)
   - 6 doctors across different departments
   - Availability tracking
   - Patient capacity management

3. ✅ **Triage API** (`/backend/routes/triage.js`)
   - `GET /triage/queue` - Get all patients sorted by priority
   - `GET /triage/patient/:id` - Get specific patient details
   - `POST /triage/add` - Add new patient to queue
   - `PUT /triage/update/:id` - Update patient status
   - `DELETE /triage/remove/:id` - Remove patient from queue

4. ✅ **Booking API** (`/backend/routes/booking.js`)
   - `GET /booking/doctors` - Get all doctors
   - `GET /booking/doctors/:department` - Get doctors by department
   - `POST /booking/book` - Book a doctor for a patient
   - `POST /booking/cancel` - Cancel a booking
   - `GET /booking/status/:patient_id` - Get booking status

### **Frontend Components**
5. ✅ **Triage Queue Page** (`/frontend/src/pages/TriageQueuePage.jsx`)
   - Real-time patient queue display
   - Risk-based categorization (Critical/Medium/Low)
   - Patient vitals visualization
   - Doctor booking interface
   - Auto-refresh every 10 seconds

---

## 🚀 **How to Run**

### **Step 1: Start Backend Server**
```bash
cd backend
npm install
node server.js
```
Server will run on `http://localhost:5000`

### **Step 2: Start Frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## 📱 **How to Use**

### **Access the Triage Queue**
1. **Login** as any role:
   - **Nurse**: `nurse` / `nurse123`
   - **Doctor**: `doctor` / `doctor123`
   - **Admin**: `admin` / `admin123`

2. **Navigate** to "Triage Queue" from the sidebar menu

3. **View Patients** organized by risk level:
   - 🔴 **Critical** - Red cards (highest priority)
   - 🟠 **Medium** - Orange cards (moderate priority)
   - 🟢 **Low** - Green cards (routine care)

### **Book a Doctor for a Patient**

#### **Step 1: Select Patient**
- Click on any patient card
- Selected card will highlight with blue border
- Patient details appear in booking panel

#### **Step 2: Select Doctor**
- View available doctors in the right panel
- Click on a doctor to select
- See doctor's current patient load

#### **Step 3: Confirm Booking**
- Click "Confirm Booking" button
- System validates:
  - ✅ Doctor is available
  - ✅ Doctor hasn't reached max capacity
  - ✅ Patient isn't already booked
- Success message shows booking details

---

## 🎨 **UI Features**

### **Patient Cards Display**
- **Name & ID** - Patient identification
- **Risk Badge** - Color-coded priority level
- **Demographics** - Age, gender
- **Symptoms** - Chief complaint
- **Vitals Dashboard**:
  - ❤️ Heart Rate
  - 🌡️ Temperature
  - 💧 SpO2 (Oxygen)
  - 📊 Blood Pressure
- **Department** - Assigned medical department
- **Booking Status** - Shows if doctor assigned

### **Statistics Dashboard**
- **Total Queue** - Number of patients waiting
- **Critical Cases** - High-priority patients
- **Medium Cases** - Moderate-priority patients
- **Low Cases** - Routine care patients

### **Doctor Booking Panel**
- **Selected Patient Info** - Highlighted patient details
- **Available Doctors List** - Shows capacity (e.g., 2/5 patients)
- **Department Matching** - Doctors filtered by specialty
- **Real-time Updates** - Auto-refresh availability

---

## 🔧 **API Endpoints**

### **Triage Endpoints**

#### **Get Queue**
```javascript
GET http://localhost:5000/triage/queue

Response:
{
  "total": 6,
  "critical": [...],
  "medium": [...],
  "low": [...],
  "all": [...]
}
```

#### **Get Patient**
```javascript
GET http://localhost:5000/triage/patient/P001

Response:
{
  "patient_id": "P001",
  "name": "Arun Kumar",
  "age": 54,
  "risk_level": "Critical",
  ...
}
```

#### **Add Patient**
```javascript
POST http://localhost:5000/triage/add

Body:
{
  "name": "New Patient",
  "age": 35,
  "gender": "Male",
  "heart_rate": 85,
  "temperature": 99,
  "spo2": 97,
  "symptoms": "Headache",
  "risk_level": "Low",
  "department": "General"
}
```

### **Booking Endpoints**

#### **Get All Doctors**
```javascript
GET http://localhost:5000/booking/doctors

Response:
[
  {
    "id": "D1",
    "name": "Dr. Priya Sharma",
    "department": "Cardiology",
    "available": true,
    "current_patients": 0,
    "max_patients": 5
  },
  ...
]
```

#### **Book Doctor**
```javascript
POST http://localhost:5000/booking/book

Body:
{
  "patient_id": "P001",
  "doctor_id": "D1"
}

Response:
{
  "success": true,
  "message": "Booking confirmed successfully",
  "booking": {
    "patient": { "id": "P001", "name": "Arun Kumar", "risk_level": "Critical" },
    "doctor": { "id": "D1", "name": "Dr. Priya Sharma", "department": "Cardiology" },
    "booking_time": "2026-02-15T00:20:00.000Z"
  }
}
```

#### **Cancel Booking**
```javascript
POST http://localhost:5000/booking/cancel

Body:
{
  "patient_id": "P001"
}

Response:
{
  "success": true,
  "message": "Booking cancelled successfully",
  "patient": { ... }
}
```

---

## 📊 **Data Flow**

```
1. Patient enters queue → Stored in patients.json
2. Nurse/Doctor views queue → GET /triage/queue
3. Staff selects patient → Frontend highlights selection
4. Staff selects doctor → Frontend validates availability
5. Staff confirms booking → POST /booking/book
6. Backend validates:
   - Doctor available?
   - Doctor capacity OK?
   - Patient not already booked?
7. Backend updates:
   - Patient: doctor_assigned, booking_status = "Booked"
   - Doctor: current_patients++, available = false (if at max)
8. Frontend refreshes → Shows updated status
```

---

## 🎯 **Business Logic**

### **Triage Priority**
- Patients sorted by `priority_score` (0-100)
- Higher score = higher priority
- Critical: 75-100
- Medium: 40-74
- Low: 0-39

### **Doctor Availability**
- Each doctor has `max_patients` capacity
- `available = true` when `current_patients < max_patients`
- Automatically set to `false` when capacity reached
- Freed up when booking cancelled

### **Booking Rules**
1. ✅ Patient can only be booked to ONE doctor at a time
2. ✅ Doctor must be available
3. ✅ Doctor must have capacity
4. ✅ Booking time is recorded
5. ✅ Cancellation frees up doctor slot

---

## 🔄 **Auto-Refresh**

The triage queue page automatically refreshes every **10 seconds** to show:
- New patients added to queue
- Updated booking statuses
- Doctor availability changes
- Real-time queue updates

---

## 🎨 **Color Coding**

### **Risk Levels**
- 🔴 **Critical** - Red (bg-red-600)
- 🟠 **Medium** - Orange (bg-orange-500)
- 🟢 **Low** - Emerald (bg-emerald-600)

### **Vitals**
- ❤️ **Heart Rate** - Red (bg-red-50)
- 🌡️ **Temperature** - Amber (bg-amber-50)
- 💧 **SpO2** - Blue (bg-blue-50)
- 📊 **Blood Pressure** - Purple (bg-purple-50)

---

## 🧪 **Testing the System**

### **Test Scenario 1: Book Critical Patient**
1. Login as nurse
2. Go to Triage Queue
3. Click on "Arun Kumar" (Critical patient)
4. Select "Dr. Priya Sharma" (Cardiology)
5. Click "Confirm Booking"
6. ✅ Booking should succeed
7. Patient card now shows "Assigned to Dr. Priya Sharma"

### **Test Scenario 2: Doctor Capacity**
1. Book 5 patients to "Dr. Priya Sharma"
2. Try to book 6th patient
3. ❌ Should show error: "Doctor at full capacity"

### **Test Scenario 3: Already Booked**
1. Book patient to a doctor
2. Try to book same patient to another doctor
3. ❌ Should show error: "Patient already booked"

### **Test Scenario 4: Cancel Booking**
```javascript
// Use Postman or curl
POST http://localhost:5000/booking/cancel
{
  "patient_id": "P001"
}
```
4. ✅ Booking cancelled, doctor slot freed

---

## 📝 **Sample Data**

### **Patients in Queue**
1. **Arun Kumar** (P001) - Critical - Cardiology
2. **Lakshmi Iyer** (P004) - Critical - Pulmonology
3. **Meena Devi** (P002) - Medium - General
4. **Vijay Reddy** (P005) - Medium - General
5. **Rahul Sharma** (P003) - Low - General
6. **Priya Nair** (P006) - Low - Dermatology

### **Available Doctors**
1. **Dr. Priya Sharma** - Cardiology (0/5)
2. **Dr. Sanjay Kumar** - Pulmonology (0/4)
3. **Dr. Arjun Mehta** - General (0/8)
4. **Dr. Rajesh Iyer** - General (0/8)
5. **Dr. Kavya Reddy** - Emergency (0/10)
6. **Dr. Anjali Desai** - Dermatology (0/6)

---

## 🏆 **Hackathon Features**

### **Why This Wins**
1. ✅ **Fully Functional** - Real backend, real database (JSON)
2. ✅ **Beautiful UI** - Modern, responsive, color-coded
3. ✅ **Smart Triage** - AI-based risk scoring
4. ✅ **Real-time Updates** - Auto-refresh every 10s
5. ✅ **Complete CRUD** - Add, view, update, delete patients
6. ✅ **Capacity Management** - Doctor availability tracking
7. ✅ **Validation** - Prevents double-booking, capacity overflow
8. ✅ **Professional Design** - Hospital-grade UI/UX
9. ✅ **Scalable** - Easy to add MongoDB/PostgreSQL later
10. ✅ **Production Ready** - Error handling, loading states

---

## 🚀 **Next Steps (Optional Enhancements)**

1. **Add WebSocket** - Real-time updates without refresh
2. **Add Notifications** - Alert when patient is called
3. **Add Queue Position** - Show "You are #3 in line"
4. **Add Estimated Wait Time** - Calculate based on average
5. **Add Patient Check-in** - QR code scanning
6. **Add Doctor Notes** - Treatment plans, prescriptions
7. **Add Analytics** - Wait time reports, doctor efficiency
8. **Add Mobile App** - React Native version
9. **Add SMS Alerts** - Notify patients when ready
10. **Add Payment Integration** - Billing and insurance

---

## 📞 **Support**

For issues or questions:
1. Check backend console for errors
2. Check frontend console for network errors
3. Verify both servers are running
4. Check data files exist in `/backend/data/`

---

## ✅ **Checklist**

- [x] Backend routes created
- [x] Data files created
- [x] Frontend page created
- [x] Routes added to App.jsx
- [x] Sidebar menu updated
- [x] API endpoints tested
- [x] Booking logic working
- [x] Validation working
- [x] UI responsive
- [x] Auto-refresh working
- [x] Error handling implemented
- [x] Loading states added
- [x] Color coding applied
- [x] Documentation complete

---

## 🎉 **SYSTEM IS READY TO DEMO!**

**Access URL**: `http://localhost:5173/triage-queue`

**Login Credentials**:
- Nurse: `nurse` / `nurse123`
- Doctor: `doctor` / `doctor123`
- Admin: `admin` / `admin123`

---

**Built with ❤️ for Kanini Hackathon 2026**
