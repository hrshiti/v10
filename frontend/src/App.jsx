import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './modules/user/Dashboard';
import Home from './modules/user/pages/Home';
import Calendar from './modules/user/pages/Calendar';
import Workouts from './modules/user/pages/Workouts';
import WorkoutDetails from './modules/user/pages/WorkoutDetails';
import Profile from './modules/user/pages/Profile';
import Settings from './modules/user/pages/Settings';
import FAQ from './modules/user/pages/FAQ';
import TermsAndConditions from './modules/user/pages/TermsAndConditions';
import AboutUs from './modules/user/pages/AboutUs';
import PrivacyPolicy from './modules/user/pages/PrivacyPolicy';
import Achievements from './modules/user/pages/Achievements';
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import Login from './modules/user/pages/Login';
import Register from './modules/user/pages/Register';
import VerifyOtp from './modules/user/pages/VerifyOtp';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* User Routes */}
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="workout/:id" element={<WorkoutDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Settings Navigation Routes */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
