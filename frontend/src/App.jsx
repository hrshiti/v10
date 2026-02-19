import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './modules/user/Dashboard';
import Home from './modules/user/pages/Home';
import Calendar from './modules/user/pages/Calendar';
import Workouts from './modules/user/pages/Workouts';
import WorkoutDetails from './modules/user/pages/WorkoutDetails';
import AssignedWorkoutDetails from './modules/user/pages/AssignedWorkoutDetails';
import Profile from './modules/user/pages/Profile';
import Settings from './modules/user/pages/Settings';
import FAQ from './modules/user/pages/FAQ';
import TermsAndConditions from './modules/user/pages/TermsAndConditions';
import AboutUs from './modules/user/pages/AboutUs';
import PrivacyPolicy from './modules/user/pages/PrivacyPolicy';
import Achievements from './modules/user/pages/Achievements';
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import Login from './modules/user/pages/Login';

import VerifyOtp from './modules/user/pages/VerifyOtp';
import ScanQR from './modules/user/pages/ScanQR';
import AttendanceSuccess from './modules/user/pages/AttendanceSuccess';
import Feedback from './modules/user/pages/Feedback';
import UserSuccessStories from './modules/user/pages/UserSuccessStories';
import AttendanceCalendar from './modules/user/pages/AttendanceCalendar';

import ProtectedRoute from './modules/user/components/ProtectedRoute';
import TrainerRoutes from './modules/trainer/routes/TrainerRoutes';
import FCMHandler from './components/FCMHandler';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App h-screen overflow-hidden">
      <ThemeProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <FCMHandler />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Attendance Flow */}
            <Route path="/scan" element={<ScanQR />} />
            <Route path="/success" element={<AttendanceSuccess />} />

            {/* User Routes */}
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="workouts" element={<Workouts />} />
              <Route path="workout/:id" element={<WorkoutDetails />} />
              <Route path="workout-details/:id" element={<AssignedWorkoutDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="attendance-history" element={<AttendanceCalendar />} />
              <Route path="settings" element={<Settings />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>

            {/* Settings Navigation Routes (Standalone) */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/stories" element={<UserSuccessStories />} />
          </Route>

          {/* Trainer Routes */}
          <Route path="/trainer/*" element={<TrainerRoutes />} />

        </Routes>
      </ThemeProvider>
    </div>
  );
}


export default App;
