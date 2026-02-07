import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ImagePlus, QrCode, Clock, ArrowLeft, Briefcase, Trophy } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 pb-24">
            {/* Profile Incomplete Notification */}
            {isProfileIncomplete && (
                <div className="mb-6 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-3xl p-5 flex items-start gap-4 animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <User size={24} className="text-emerald-500" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-gray-900 dark:text-white font-black text-sm mb-1 uppercase tracking-tight">Profile Incomplete</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium leading-relaxed mb-3">Add your experience, birth date and photo to show your professional profile to members.</p>
                        <button
                            onClick={() => navigate('/trainer/profile/edit')}
                            className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                            Complete Profile →
                        </button>
                    </div>
                </div>
            )}

            {/* Top Navigation & Profile */}
            <div className="flex justify-between items-center mb-10 pt-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center overflow-hidden border-2 border-emerald-500 shadow-lg p-0.5">
                        {userData?.photo ? (
                            <img src={getImageUrl(userData.photo)} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <User size={28} className="text-emerald-600 dark:text-emerald-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Team Member</p>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                            {userData?.firstName || 'Trainer'}
                        </h1>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1A1F2B] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <Clock size={20} className="text-gray-400" />
                </div>
            </div>

            {/* Gym Info Card (Glassmorphism style) */}
            <div className="mb-8 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2.5rem] shadow-2xl group">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Briefcase size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-lg">{gymDetails?.name || 'V-10 Fitness'}</h2>
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest truncate max-w-[200px]">{gymDetails?.address || 'HQ Branch'}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-none">Support</p>
                            <p className="text-white text-xs font-bold">{gymDetails?.contactNumber || 'Contact Office'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-none">Members Active</p>
                            <p className="text-white text-lg font-black">{stats?.activeMembersCount || '0'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
                {/* Punch Card */}
                <div
                    onClick={() => {
                        if (stats?.userStatus?.type !== 'checkout') navigate('/trainer/scan');
                    }}
                    className={`${getAttendanceCardStyle()} p-6 rounded-[2rem] flex flex-col justify-between h-44 shadow-xl active:scale-95 transition-all group`}
                >
                    <div className="bg-white/20 w-fit p-3 rounded-2xl group-hover:rotate-12 transition-transform">
                        <QrCode size={28} />
                    </div>
                    <div>
                        <h3 className="font-black text-xl leading-tight mb-1 whitespace-pre-line tracking-tight">{attendanceInfo.title}</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest opacity-80">{attendanceInfo.subtitle}</p>
                    </div>
                </div>

                {/* Add Story Card */}
                <div
                    onClick={() => navigate('/trainer/story/add')}
                    className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2rem] flex flex-col justify-between h-44 cursor-pointer shadow-xl border border-gray-100 dark:border-gray-800 active:scale-95 transition-all group"
                >
                    <div className="bg-emerald-500/10 dark:bg-emerald-500/20 w-fit p-3 rounded-2xl group-hover:scale-110 transition-transform">
                        <ImagePlus size={28} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl leading-tight mb-1 dark:text-white tracking-tight">Share<br />Win</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400">Post Result</p>
                    </div>
                </div>
            </div>

            {/* My Stories Card (Full Width) */}
            <div
                onClick={() => navigate('/trainer/stories')}
                className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2rem] flex items-center justify-between cursor-pointer shadow-xl border border-gray-100 dark:border-gray-800 active:scale-98 transition-all group"
            >
                <div className="flex items-center gap-5">
                    <div className="bg-amber-500/10 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                        <Trophy size={28} className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-gray-900 dark:text-white leading-none mb-1">Success Lab</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stats?.storyCount || '0'} Stories Published</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-full">
                    <ArrowLeft size={16} className="text-gray-400 rotate-180" />
                </div>
            </div>

            {/* Support section */}
            <div className="mt-8 text-center bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">Need Help?</p>
                <p className="text-xs text-gray-500 font-medium">Contact management for shift changes</p>
            </div>
        </div>
    );
};

export default TrainerHome;
