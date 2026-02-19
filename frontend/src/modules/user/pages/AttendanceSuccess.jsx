import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, CheckCircle, Calendar, Clock, RotateCcw, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '../../../config/api';

const AttendanceSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const scanType = location.state?.type || 'checkin';
    const scanMessage = location.state?.message || 'Attendance Marked!';
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const userDataStr = localStorage.getItem('userData');
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    const userName = userData ? `${userData.firstName} ${userData.lastName}` : 'Guest';
    const userPhoto = userData?.photo || null;

    const [stats, setStats] = useState({
        totalMembers: 0,
        activeMembers: 0,
        todayAttendance: 0
    });
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await fetch(`${API_BASE_URL}/api/user/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setStats(data);
            } catch (error) {
                console.error('Error fetching success stats:', error);
            }
        };

        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await fetch(`${API_BASE_URL}/api/user/attendance`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    // Just take last 3 and format for display
                    const formatted = data.slice(0, 3).map(item => ({
                        date: new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
                        status: item.status,
                        type: item.checkOut ? 'checkout' : 'checkin'
                    }));
                    setAttendanceHistory(formatted);
                }
            } catch (error) {
                console.error('Error fetching attendance history:', error);
            }
        };

        fetchStats();
        fetchHistory();

        // Trigger confetti on mount
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#10b981', '#34d399', '#059669']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#10b981', '#34d399', '#059669']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

        // Set Date and Time
        const now = new Date();
        setCurrentDate(now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }));
        setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans flex flex-col relative overflow-x-hidden text-white">

            {/* Background Glow */}
            <div className="absolute top-0 center w-full h-[50vh] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6 relative z-10">

                {/* Success Header */}
                <div className="mt-12 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                        className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] mb-6"
                    >
                        <CheckCircle size={48} className="text-white" strokeWidth={3} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-black text-center tracking-tight mb-2"
                    >
                        {scanMessage}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-sm font-medium"
                    >
                        You're all set for today's workout.
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Present Today</span>
                        </div>
                        <p className="text-2xl font-black text-white">{stats.todayAttendance}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={12} className="text-blue-400" />
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active in Gym</span>
                        </div>
                        <p className="text-2xl font-black text-white">{stats.activeInGym || 0}</p>
                    </motion.div>
                </div>

                {/* Profile Receipt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 bg-slate-800 rounded-3xl p-1 shadow-xl"
                >
                    <div className="bg-[#0f172a] rounded-[1.4rem] border border-slate-700/50 p-5 relative overflow-hidden">
                        {/* Decorative top pattern */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>

                        <div className="flex items-center gap-4 border-b border-slate-700/50 pb-5 mb-5">
                            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-emerald-500 to-blue-500 overflow-hidden flex items-center justify-center">
                                {userPhoto ? (
                                    <img
                                        src={userPhoto}
                                        className="w-full h-full rounded-full object-cover border-2 border-[#0f172a]"
                                        alt="User"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center border-2 border-[#0f172a]">
                                        <User size={24} className="text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">{userName}</h3>
                                <p className={`text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full inline-block mt-1 ${scanType === 'checkin' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                    ✓ {scanType === 'checkin' ? 'Checked In' : 'Checked Out'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar size={12} /> Date
                                </p>
                                <p className="text-sm font-semibold text-slate-200">{currentDate}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1.5">
                                    <Clock size={12} /> Time
                                </p>
                                <p className="text-sm font-semibold text-slate-200">{currentTime}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent History */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6"
                >
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Recent Activity</h3>
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 divide-y divide-slate-700/50">
                        {attendanceHistory.length > 0 ? (
                            attendanceHistory.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                            <RotateCcw size={14} className="text-slate-400" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-300">{item.date}</span>
                                    </div>
                                    <span className={`text-xs font-bold ${item.status === 'Present' ? 'text-emerald-400' : 'text-red-400'} bg-white/5 px-2 py-1 rounded-md`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-slate-500 text-sm">
                                No recent activity
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="flex-1"></div>

                {/* Home Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={() => navigate('/')}
                    className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold shadow-lg shadow-white/10 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 mb-4"
                >
                    <Home size={18} />
                    Go to Home
                </motion.button>

            </div>
        </div>
    );
};

export default AttendanceSuccess;
