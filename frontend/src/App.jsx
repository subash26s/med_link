import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PatientProvider } from './contexts/PatientContext';
import PatientWelcome from './pages/patient/WelcomeScreen';
import PatientForm from './pages/patient/IntakeForm';
import PatientReview from './pages/patient/ReviewSummary';
import PatientResult from './pages/patient/ResultScreen';
import PatientWaiting from './pages/patient/WaitingScreen';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import NurseDashboard from './pages/NurseDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionDashboard from './pages/ReceptionDashboard';
import ReportsDashboard from './pages/ReportsDashboard';
import PatientList from './pages/PatientList';
import PatientDashboard from './pages/patient/PatientDashboard';
import HealthAnalytics from './pages/patient/HealthAnalytics';
import MedicalHistory from './pages/patient/MedicalHistory';
import MedicalReports from './pages/patient/MedicalReports';
import ProfilePage from './pages/patient/ProfilePage';
import EmergencyPage from './pages/patient/EmergencyPage';
import Appointments from './pages/patient/Appointments';
import AIRiskAnalysis from './pages/patient/AIRiskAnalysis';
import DoctorsList from './pages/patient/DoctorsList';
import SettingsPage from './pages/patient/SettingsPage';
import TriageQueuePage from './pages/TriageQueuePage';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <PatientProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />

                            {/* Patient Check-In Flow */}
                            <Route path="/patient" element={<Navigate to="/patient/start" replace />} />
                            <Route path="/patient/start" element={<PatientWelcome />} />
                            <Route path="/patient/form" element={<PatientForm />} />
                            <Route path="/patient/review" element={<PatientReview />} />
                            <Route path="/patient/result" element={<PatientResult />} />
                            <Route path="/patient/waiting" element={<PatientWaiting />} />

                            {/* Alias for backward compatibility */}
                            <Route path="/kiosk" element={<Navigate to="/patient/start" replace />} />

                            <Route
                                path="/nurse"
                                element={
                                    <PrivateRoute roles={['nurse', 'admin']}>
                                        <NurseDashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/doctor"
                                element={
                                    <PrivateRoute roles={['doctor', 'admin']}>
                                        <DoctorDashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/admin/patients"
                                element={
                                    <PrivateRoute roles={['admin']}>
                                        <PatientList />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute roles={['admin']}>
                                        <AdminDashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/reception"
                                element={
                                    <PrivateRoute roles={['receptionist', 'admin']}>
                                        <ReceptionDashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/reports"
                                element={
                                    <PrivateRoute roles={['doctor', 'admin']}>
                                        <ReportsDashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/triage-queue"
                                element={
                                    <PrivateRoute roles={['nurse', 'doctor', 'admin']}>
                                        <TriageQueuePage />
                                    </PrivateRoute>
                                }
                            />

                            {/* Logged-in Patient Portal */}
                            <Route
                                path="/patient/portal"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <PatientDashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/health"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <HealthAnalytics />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/appointments"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <Appointments />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/reports"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <MedicalReports />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/ai-risk"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <AIRiskAnalysis />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/doctors"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <DoctorsList />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/history"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <MedicalHistory />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/profile"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <ProfilePage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/settings"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <SettingsPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/patient/portal/emergency"
                                element={
                                    <PrivateRoute roles={['patient', 'admin']}>
                                        <EmergencyPage />
                                    </PrivateRoute>
                                }
                            />

                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </Router>
                </PatientProvider>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;
