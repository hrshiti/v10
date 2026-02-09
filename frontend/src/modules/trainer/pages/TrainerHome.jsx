import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ImagePlus, QrCode, Clock, Briefcase, Trophy, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const TrainerHome = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState(null);

    const [gymDetails, setGymDetails] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            setUserData(JSON.parse(stored));
        }
        fetchStats();
        fetchGymDetails();
    }, []);

    const fetchGymDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/gym-details`);
            const data = await response.json();
            if (response.ok) setGymDetails(data);
        } catch (error) {
            console.error('Error fetching gym details:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/user/trainer/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
                // Update profile info if present
                if (data.user) {
                    const updated = { ...userData, ...data.user };
                    setUserData(updated);
                    localStorage.setItem('userData', JSON.stringify(updated));
                }
            }
        } catch (error) {
            console.error('Error fetching trainer stats:', error);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/${path}`;
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Determine card style based on attendance status
    const getAttendanceCardStyle = () => {
        if (!stats?.userStatus?.isPresent) {
            return "bg-emerald-500 text-white shadow-emerald-500/30"; // Not checked in yet
        }
        if (stats.userStatus.type === 'checkin') {
            return "bg-blue-500 text-white shadow-blue-500/30"; // Checked In (Needs Check Out)
        }
        return "bg-gray-500 text-white shadow-gray-500/30 cursor-default opacity-60"; // Done for day
    };

    const getAttendanceText = () => {
        if (!stats?.userStatus?.isPresent) return { title: "Punch\nIn", subtitle: "Start Your Shift" };
        if (stats.userStatus.type === 'checkin') return { title: "Punch\nOut", subtitle: "End Your Day" };
        return { title: "Hours\nLogged", subtitle: "Duty Completed" };
    };

    const attendanceInfo = getAttendanceText();

    const isProfileIncomplete = userData && (!userData.email || !userData.address || !userData.birthDate || !userData.experience || !userData.photo);

    return (
        <div className="min-h-screen bg-[#F8F9FD] dark:bg-[#0D1117] pb-32 transition-colors duration-300">
            {/* Glossy Header Area */}
            <div className="bg-[#1A1F2B] dark:bg-black pt-12 px-6 pb-20 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="relative z-10 flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center overflow-hidden border-2 border-emerald-500/30 shadow-xl p-0.5 group transition-transform hover:scale-105">
                                {userData?.photo ? (
                                    <img src={getImageUrl(userData.photo)} alt="Profile" className="w-full h-full object-cover rounded-[1.3rem]" />
                                ) : (
                                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center">
                                        <span className="text-2xl font-black text-white">{userData?.firstName?.[0]}</span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-[#1A1F2B] rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[3px] text-emerald-500/80 mb-0.5">Authorized Trainer</p>
                            <h1 className="text-2xl font-black text-white leading-none tracking-tight">
                                {userData?.firstName || 'Trainer'}
                            </h1>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/trainer/profile')}
                        className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        <Clock size={22} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Gym Identity Card */}
                <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.2rem] p-6 shadow-2xl">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
                            <Briefcase size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-lg tracking-tight uppercase italic">{gymDetails?.name || 'V-10 Fitness'}</h2>
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">{gymDetails?.address || 'Premium Branch'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Live Members</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-white text-lg font-black">{stats?.activeMembersCount || '0'}</span>
                            </div>
                        </div>
                        <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Shift Hours</p>
                            <span className="text-white text-lg font-black">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Action Grid */}
            <div className="px-6 -mt-8 relative z-20 space-y-6">

                {/* Profile Incomplete Banner */}
                {isProfileIncomplete && (
                    <div
                        onClick={() => navigate('/trainer/profile/edit')}
                        className="bg-white dark:bg-[#1A1F2B] rounded-[2.5rem] p-5 shadow-xl border border-gray-100 dark:border-gray-800/50 flex items-center gap-4 group cursor-pointer active:scale-98 transition-all overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
                        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <User size={24} className="text-amber-600 dark:text-amber-500" />
                        </div>
                        <div className="flex-1 pr-6">
                            <h4 className="text-gray-900 dark:text-white font-black text-[13px] mb-0.5 uppercase tracking-tight">Complete Profile</h4>
                            <p className="text-gray-400 text-[10px] font-bold leading-tight">Add exp & photo to attract more members</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300">
                            →
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {/* Attendance Action */}
                    <div
                        onClick={() => {
                            if (stats?.userStatus?.type !== 'checkout') navigate('/trainer/scan');
                        }}
                        className={`${getAttendanceCardStyle()} p-6 rounded-[2.2rem] flex flex-col justify-between h-48 shadow-2xl active:scale-95 transition-all group relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-125"></div>
                        <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform shadow-lg border border-white/10">
                            <QrCode size={28} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-black text-2xl leading-none mb-2 tracking-tighter uppercase italic">{attendanceInfo.title}</h3>
                            <p className="text-[9px] uppercase font-black tracking-[0.2em] opacity-80">{attendanceInfo.subtitle}</p>
                        </div>
                    </div>

                    {/* Quick Stats / Result Action */}
                    <div
                        onClick={() => navigate('/trainer/story/add')}
                        className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2.2rem] flex flex-col justify-between h-48 cursor-pointer shadow-xl border border-gray-100 dark:border-gray-800/50 active:scale-95 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl transition-transform group-hover:scale-125"></div>
                        <div className="bg-emerald-500/10 dark:bg-emerald-500/20 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                            <ImagePlus size={28} className="text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-black text-2xl leading-none mb-2 dark:text-white tracking-tighter uppercase italic text-gray-900">Post<br />Result</h3>
                            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-400">Share Success Story</p>
                        </div>
                    </div>
                </div>

                {/* My Stories Tracker (Full Width) */}
                <div
                    onClick={() => navigate('/trainer/stories')}
                    className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer shadow-xl border border-gray-100 dark:border-gray-800/50 active:scale-98 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-[1.8rem] flex items-center justify-center group-hover:rotate-6 transition-transform shadow-inner">
                            <Trophy size={32} className="text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-gray-900 dark:text-white leading-none mb-1 tracking-tight">Success Tracker</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                <span className="text-amber-600 dark:text-amber-500">{stats?.storyCount || '0'}</span> Results Achieved
                            </p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300">
                        <ChevronRight size={18} strokeWidth={3} />
                    </div>
                </div>

                {/* Performance Tip / Support */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 p-6 rounded-[2.5rem] border border-emerald-500/10 text-center relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[3px] text-emerald-600/60 leading-none">Management Notice</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold px-4 leading-relaxed italic">"Keep motivating members for consistent attendance. Consistency leads to results."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerHome;
