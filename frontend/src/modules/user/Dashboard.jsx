import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home as HomeIcon, Calendar as CalendarIcon, Dumbbell, Crown, QrCode } from 'lucide-react';

const Dashboard = () => {
    // Helper function for nav link classes
    const getLinkClasses = (isActive) =>
        `flex flex-col items-center gap-1 group transition-all duration-300 ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'}`;

    const getIconContainerClasses = (isActive) =>
        `p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-110' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`;

    return (
        <div className="h-screen h-[100dvh] bg-white dark:bg-[#121212] font-sans w-full md:max-w-md md:mx-auto relative md:shadow-2xl overflow-hidden md:ring-1 md:ring-gray-200 md:dark:ring-gray-800 md:my-4 md:h-[calc(100vh-2rem)] md:rounded-[3rem] transition-colors duration-300 flex flex-col">

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-24">
                <Outlet />
            </div>


            {/* Bottom Sticky Navigation */}
            <div className="fixed bottom-0 left-0 right-0 md:max-w-md mx-auto px-6 pb-8 pt-4 bg-white/95 dark:bg-black/85 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center z-50 transition-colors duration-300 safe-area-inset-bottom">

                <NavLink to="/" className={({ isActive }) => getLinkClasses(isActive)}>
                    {({ isActive }) => (
                        <>
                            <div className={getIconContainerClasses(isActive)}>
                                <HomeIcon size={24} />
                            </div>
                            {isActive && <span className="text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">Home</span>}
                        </>
                    )}
                </NavLink>

                <NavLink to="/calendar" className={({ isActive }) => getLinkClasses(isActive)}>
                    {({ isActive }) => (
                        <>
                            <div className={getIconContainerClasses(isActive)}>
                                <CalendarIcon size={isActive ? 24 : 28} />
                            </div>
                            {isActive && <span className="text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">Calendar</span>}
                        </>
                    )}
                </NavLink>

                <NavLink to="/scan" className="flex flex-col items-center gap-1 group -mt-6">
                    <div className="p-4 rounded-full bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95 border-4 border-white dark:border-black">
                        <QrCode size={28} />
                    </div>
                </NavLink>

                <NavLink to="/workouts" className={({ isActive }) => getLinkClasses(isActive)}>
                    {({ isActive }) => (
                        <>
                            <div className={getIconContainerClasses(isActive)}>
                                <Dumbbell size={isActive ? 24 : 28} />
                            </div>
                            {isActive && <span className="text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">Workouts</span>}
                        </>
                    )}
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => getLinkClasses(isActive)}>
                    {({ isActive }) => (
                        <>
                            <div className={getIconContainerClasses(isActive)}>
                                <Crown size={isActive ? 24 : 28} />
                            </div>
                            {isActive && <span className="text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">Profile</span>}
                        </>
                    )}
                </NavLink>

            </div>
        </div>
    );
};

export default Dashboard;
