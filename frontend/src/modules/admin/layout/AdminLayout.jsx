import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationPanel from './NotificationPanel';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notificationOpen, setNotificationOpen] = useState(false);

    // Theme persistence
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleNotifications = () => {
        setNotificationOpen(!notificationOpen);
    };

    const toggleTheme = (mode) => {
        if (mode === 'dark') setIsDarkMode(true);
        else if (mode === 'light') setIsDarkMode(false);
        else setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
            <Sidebar isOpen={sidebarOpen} isDarkMode={isDarkMode} />

            <div className={`flex-1 flex flex-col min-h-screen transition-none min-w-0 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <Navbar
                    toggleSidebar={toggleSidebar}
                    sidebarOpen={sidebarOpen}
                    onNotificationClick={toggleNotifications}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                />

                <main className={`p-8 mt-16 flex-1 overflow-x-hidden min-w-0 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <Outlet context={{ isDarkMode }} />
                </main>
            </div>

            <NotificationPanel
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default AdminLayout;
