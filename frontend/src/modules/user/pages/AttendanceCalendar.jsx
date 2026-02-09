import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const AttendanceCalendar = () => {
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch(`${API_BASE_URL}/api/user/attendance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAttendanceLogs(data);
            }
        } catch (err) {
            console.error('Error fetching attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const isPresent = (day) => {
        const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
        return attendanceLogs.some(log => new Date(log.date).toDateString() === dateStr);
    };

    const getLogForDay = (day) => {
        const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
        return attendanceLogs.find(log => new Date(log.date).toDateString() === dateStr);
    };

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const monthLogs = attendanceLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === currentMonth.getMonth() && logDate.getFullYear() === currentMonth.getFullYear();
    });

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#121212] min-h-screen pb-24 transition-colors duration-300">
            {/* Header */}
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-6 px-6 pb-14 rounded-b-[2.5rem] shadow-lg relative overflow-hidden transition-colors duration-300 text-center z-0">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 top-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all z-10"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col items-center relative z-0">
                    <div className="p-3 bg-orange-500 rounded-[1.2rem] mb-2 shadow-lg shadow-orange-500/20">
                        <CalendarIcon size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-tight">Attendance Logs</h1>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                        Track your daily consistency
                    </p>
                </div>
            </div>

            {/* Attendance Summary Cards */}
            <div className="px-5 -mt-10 mb-6 grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white dark:bg-[#1A1F2B] p-4 rounded-[1.8rem] shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
                    <span className="text-2xl font-black text-emerald-500">{monthLogs.length}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">This Month</span>
                </div>
                <div className="bg-white dark:bg-[#1A1F2B] p-4 rounded-[1.8rem] shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
                    <span className="text-2xl font-black text-orange-500">{attendanceLogs.length}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Visits</span>
                </div>
            </div>

            {/* Calendar UI */}
            <div className="px-5 space-y-5">
                <div className="bg-white dark:bg-[#1A1F2B] rounded-[2rem] p-5 shadow-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 bg-gray-50 dark:bg-white/5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
                            </button>
                            <button onClick={nextMonth} className="p-2 bg-gray-50 dark:bg-white/5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-6 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                            <span key={`${day}-${idx}`} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                        ))}

                        {[...Array(firstDayOfMonth)].map((_, i) => (
                            <div key={`empty-${i}`}></div>
                        ))}

                        {[...Array(totalDays)].map((_, i) => {
                            const day = i + 1;
                            const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const now = new Date();
                            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                            const present = isPresent(day);
                            const isToday = d.toDateString() === now.toDateString();
                            const isPast = d < todayStart;
                            const isAbsent = isPast && !present;

                            return (
                                <div key={day} className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[13px] font-black transition-all relative
                                            ${present
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                : isAbsent
                                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    : isToday
                                                        ? 'bg-orange-500/10 text-orange-500 border-2 border-orange-500/50'
                                                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {day}
                                        {present && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-[#1A1F2B] rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-sm">
                                                <CheckCircle2 size={8} className="text-emerald-500" />
                                            </div>
                                        )}
                                        {isAbsent && (
                                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Logs List */}
                <div className="space-y-4 mb-20">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Recent Activity</h3>
                    {monthLogs.length > 0 ? (
                        monthLogs.slice(0, 5).map((log, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#1A1F2B] p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all hover:shadow-md">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                    <Clock size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">
                                        {new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                            <Clock size={10} />
                                            In: {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {log.checkOut && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                <Clock size={10} />
                                                Out: {new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-tighter border border-emerald-500/20">
                                        Present
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-[#1A1F2B] p-10 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-bold text-gray-400">No attendance records for this month</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceCalendar;
