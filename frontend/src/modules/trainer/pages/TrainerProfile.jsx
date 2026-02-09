import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Info, Shield, ChevronRight, Trophy } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const TrainerProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            setUserData(JSON.parse(stored));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/${path}`;
    };

    const menuItems = [
        { icon: <User size={20} className="text-blue-500" />, label: 'Edit Profile', action: () => navigate('/trainer/profile/edit') },
        { icon: <Shield size={20} className="text-emerald-500" />, label: 'Privacy & Security', action: () => { } },
        { icon: <Info size={20} className="text-amber-500" />, label: 'Help & Support', action: () => { } },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FD] dark:bg-[#0D1117] transition-colors duration-300 pb-32">
            {/* Glossy Header Background */}
            <div className="bg-[#1A1F2B] dark:bg-black pt-12 px-6 pb-24 rounded-b-[3.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mt-20"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mb-10"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative group mb-6">
                        <div className="w-32 h-32 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-2xl p-1 transition-transform group-hover:scale-105 duration-500">
                            {userData?.photo ? (
                                <img src={getImageUrl(userData.photo)} alt="Profile" className="w-full h-full object-cover rounded-[1.8rem]" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                    <span className="text-4xl font-black text-white">{userData?.firstName?.[0]}</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-[#1A1F2B] rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/5">
                            <Settings size={20} className="text-emerald-500 animate-spin-slow" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2 uppercase italic">
                        {userData?.firstName} {userData?.lastName}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-2 px-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                            Professional Trainer
                        </span>
                        {userData?.experience && (
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border border-white/5 px-4 py-1.5 rounded-full backdrop-blur-md">
                                {userData.experience} Yrs Experience
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="px-6 -mt-10 relative z-20">
                {/* Stats Cards Row */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white dark:bg-[#1A1F2B] p-5 rounded-[2.2rem] shadow-xl border border-gray-100 dark:border-gray-800/50 flex flex-col items-center text-center group active:scale-95 transition-all">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3 text-blue-500 group-hover:rotate-12 transition-transform">
                            <Shield size={22} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Emp ID</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white truncate w-full">
                            {userData?.memberId || userData?.employeeId || 'V10-001'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#1A1F2B] p-5 rounded-[2.2rem] shadow-xl border border-gray-100 dark:border-gray-800/50 flex flex-col items-center text-center group active:scale-95 transition-all">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-3 text-amber-500 group-hover:scale-110 transition-transform">
                            <Trophy size={22} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Expertise</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white truncate w-full">
                            {userData?.gymActivities?.[0] || 'Fitness Pro'}
                        </p>
                    </div>
                </div>

                {/* Quick Actions Menu */}
                <div className="space-y-3 mb-10">
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 mb-4">Account Settings</h3>

                    {menuItems.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={item.action}
                            className="bg-white dark:bg-[#1A1F2B] p-5 rounded-[1.8rem] flex items-center justify-between cursor-pointer border border-gray-100 dark:border-gray-800/50 active:scale-[0.99] transition-all hover:shadow-lg group shadow-sm"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform text-gray-400 group-hover:text-emerald-500">
                                    {item.icon}
                                </div>
                                <span className="font-black text-gray-800 dark:text-gray-200 text-sm uppercase tracking-tight italic">{item.label}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-emerald-500 transition-colors">
                                <ChevronRight size={16} strokeWidth={3} />
                            </div>
                        </div>
                    ))}

                    <div
                        onClick={handleLogout}
                        className="bg-red-500/10 p-5 rounded-[1.8rem] flex items-center justify-between cursor-pointer border border-red-500/20 active:scale-[0.99] transition-all mt-10 shadow-sm"
                    >
                        <div className="flex items-center gap-5">
                            <div className="p-3 bg-red-500 rounded-2xl shadow-lg shadow-red-500/30">
                                <LogOut size={22} className="text-white" />
                            </div>
                            <span className="font-black text-red-500 uppercase tracking-widest text-sm italic">Sign Out Session</span>
                        </div>
                    </div>
                </div>

                {/* Brand Footnote */}
                <div className="flex flex-col items-center gap-2 opacity-30 mt-16 scale-90">
                    <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-black text-xs">V-10</div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[4px]">Elite Performance System</p>
                </div>
            </div>
        </div>
    );
};

export default TrainerProfile;
