import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Info, Shield, ChevronRight } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 pb-24 text-gray-900 dark:text-white">
            <h1 className="text-2xl font-black mb-8">Profile</h1>

            {/* Header / Info */}
            <div className="bg-white dark:bg-[#1A1F2B] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center mb-8 text-center">
                <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl mb-5">
                    {userData?.photo ? (
                        <img src={getImageUrl(userData.photo)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={48} className="text-emerald-600" />
                    )}
                </div>
                <h2 className="text-2xl font-black tracking-tight">{userData?.firstName} {userData?.lastName}</h2>
                <div className="flex items-center gap-2 mt-1 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Senior Trainer</span>
                    {userData?.experience && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-800 px-3 py-1 rounded-full">{userData.experience} yrs exp</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-gray-50 dark:bg-[#121212] p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Emp ID</p>
                        <p className="text-sm font-bold truncate">{userData?.memberId || userData?.employeeId || 'EMP-110'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#121212] p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Expertise</p>
                        <p className="text-sm font-bold truncate">{userData?.gymActivities?.[0] || 'Fitness'}</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="space-y-3">
                {menuItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={item.action}
                        className="bg-white dark:bg-[#1A1F2B] p-4 rounded-2xl flex items-center justify-between cursor-pointer border border-gray-100 dark:border-gray-800 active:scale-98 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                {item.icon}
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </div>
                ))}

                <div
                    onClick={handleLogout}
                    className="bg-red-500/10 p-4 rounded-2xl flex items-center justify-between cursor-pointer border border-red-500/20 active:scale-98 transition-all mt-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500 rounded-xl">
                            <LogOut size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-red-500">Log Out</span>
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-12 uppercase tracking-[3px]">
                Powered by V10 System
            </p>
        </div>
    );
};

export default TrainerProfile;
