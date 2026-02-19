import React, { useState } from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { QrCode, ImagePlus, User, Home, Bell } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import TrainerScanQR from '../pages/TrainerScanQR';
import AddSuccessStory from '../pages/AddSuccessStory';
import MyStories from '../pages/MyStories';
import TrainerHome from '../pages/TrainerHome';
import TrainerProfile from '../pages/TrainerProfile';
import TrainerEditProfile from '../pages/TrainerEditProfile';

const TrainerDashboardLayout = () => {
    const getLinkClasses = (isActive) =>
        `flex flex-col items-center gap-1 group transition-all duration-300 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`;

    return (
        <div className="h-screen bg-gray-50 dark:bg-[#121212] font-sans w-full max-w-md mx-auto relative overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 transition-colors duration-300 flex flex-col">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Top Notification Bar */}
            <div className="bg-black text-white px-6 py-2 flex items-center justify-between z-50">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">System Online</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">V10.2.4</span>
                    <Bell size={12} className="text-emerald-500" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 text-gray-900 dark:text-white">
                <Outlet />
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-6 pt-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center z-50">
                <NavLink to="/trainer" end className={({ isActive }) => getLinkClasses(isActive)}>
                    <Home size={24} />
                    <span className="text-[10px] font-bold">Home</span>
                </NavLink>

                <NavLink to="/trainer/scan" className={({ isActive }) => getLinkClasses(isActive)}>
                    <QrCode size={24} />
                    <span className="text-[10px] font-bold">Scan</span>
                </NavLink>

                <NavLink to="/trainer/stories" className={({ isActive }) => getLinkClasses(isActive)}>
                    <ImagePlus size={24} />
                    <span className="text-[10px] font-bold">Stories</span>
                </NavLink>

                <NavLink to="/trainer/profile" className={({ isActive }) => getLinkClasses(isActive)}>
                    <User size={24} />
                    <span className="text-[10px] font-bold">Profile</span>
                </NavLink>
            </div>
        </div>
    );
};

const TrainerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<TrainerDashboardLayout />}>
                <Route index element={<TrainerHome />} />
                <Route path="scan" element={<TrainerScanQR />} />
                <Route path="stories" element={<MyStories />} />
                <Route path="story/add" element={<AddSuccessStory />} />
                <Route path="story/edit/:id" element={<AddSuccessStory />} />
                <Route path="profile" element={<TrainerProfile />} />
                <Route path="profile/edit" element={<TrainerEditProfile />} />
            </Route>
        </Routes>
    );
};

export default TrainerRoutes;
