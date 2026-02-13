import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronDown, Dumbbell, User } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const MemberAttendance = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const {
        id,
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo
    } = context || {};

    const [month, setMonth] = useState(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()));
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIdx = months.indexOf(month);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const start = new Date(parseInt(year), monthIdx, 1);
                start.setHours(0, 0, 0, 0);

                const end = new Date(parseInt(year), monthIdx + 1, 0);
                end.setHours(23, 59, 59, 999);

                const res = await fetch(`${API_BASE_URL}/api/admin/members/attendance?memberId=${id}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setAttendanceLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendance();
    }, [id, month, year]);

    const daysInMonth = new Date(parseInt(year), monthIdx + 1, 0).getDate();
    const startDay = new Date(parseInt(year), monthIdx, 1).getDay();

    const weeks = [];
    let week = Array(7).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
        const dayIdx = (startDay + i - 1) % 7;
        week[dayIdx] = i;
        if (dayIdx === 6 || i === daysInMonth) {
            weeks.push(week);
            week = Array(7).fill(null);
        }
    }

    const isPresent = (day) => {
        return attendanceLogs.some(log => {
            const logDate = new Date(log.date);
            return logDate.getDate() === day && logDate.getMonth() === monthIdx && logDate.getFullYear() === parseInt(year);
        });
    };

    const presentCount = attendanceLogs.length;
    const today = new Date();
    const isFutureMonth = new Date(parseInt(year), monthIdx) > today;
    const isCurrentMonth = today.getFullYear() === parseInt(year) && today.getMonth() === monthIdx;

    const daysToCount = isFutureMonth ? 0 : (isCurrentMonth ? today.getDate() : daysInMonth);
    const absentCount = Math.max(0, daysToCount - presentCount);

    const CustomSelect = ({ value, onChange, options }) => (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-[13px] font-black outline-none transition-all ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-700'
                    }`}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h2 className={`text-2xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance History</h2>

            {/* Premium Info Card */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/5 divide-gray-50 uppercase tracking-tight">
                    <div className="p-6 space-y-1">
                        <p className="text-[10px] text-gray-500 font-black">Mobile Number</p>
                        <p className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{memberMobile}</p>
                    </div>
                    <div className="p-6 space-y-1">
                        <p className="text-[10px] text-gray-500 font-black">Email ID</p>
                        <p className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{memberEmail}</p>
                    </div>
                    <div className="p-6 space-y-1">
                        <p className="text-[10px] text-gray-500 font-black">DOB</p>
                        <p className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{memberDOB}</p>
                    </div>
                </div>
                <div className="border-t dark:border-white/5 border-gray-50 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/5 divide-gray-50 uppercase tracking-tight">
                    <div className="p-6 space-y-1">
                        <p className="text-[10px] text-gray-500 font-black">Anniversary Date</p>
                        <p className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{memberAnniversary}</p>
                    </div>
                    <div className="p-6 space-y-1">
                        <p className="text-[10px] text-gray-500 font-black">Emergency Contact Name</p>
                        <p className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{memberEmergencyName}</p>
                    </div>
                    <div className="p-6 space-y-1">
                        <p className="text-[10px] text-gray-500 font-black">Emergency Contact No</p>
                        <p className={`text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{memberEmergencyNo}</p>
                    </div>
                </div>
            </div>

            {/* Attendance Main Container */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                {/* Header with Selects */}
                <div className="p-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{month}</h3>
                    <div className="flex items-center gap-4">
                        <CustomSelect value={month} onChange={setMonth} options={months} />
                        <CustomSelect value={year} onChange={setYear} options={['2024', '2025', '2026', '2027']} />
                    </div>
                </div>

                {/* Chips Summary */}
                <div className="p-8 py-6 flex gap-4">
                    <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[12px] font-black text-emerald-500 uppercase tracking-wider">Present Days ({presentCount})</span>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="px-8 pb-10">
                    <div className="grid grid-cols-7 gap-px dark:bg-white/5 bg-gray-100 rounded-xl overflow-hidden border dark:border-white/5 border-gray-100 shadow-inner">
                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day, i) => (
                            <div key={`${day}-${i}`} className={`py-4 text-center text-[11px] font-black text-gray-500 uppercase tracking-[2px] ${isDarkMode ? 'bg-[#181818]' : 'bg-gray-50'}`}>{day}</div>
                        ))}
                        {weeks.map((week, widx) => (
                            week.map((day, didx) => {
                                const present = day ? isPresent(day) : false;
                                const isDayBeforeToday = day && new Date(parseInt(year), monthIdx, day) < new Date().setHours(0, 0, 0, 0);
                                const isFuture = day && new Date(parseInt(year), monthIdx, day) > new Date();

                                let bgColor = isDarkMode ? 'bg-[#121212]' : 'bg-white';
                                let textColor = isDarkMode ? 'text-gray-300' : 'text-gray-800';

                                if (day) {
                                    if (present) {
                                        bgColor = 'bg-emerald-500/10';
                                        textColor = 'text-emerald-500';
                                    } else if (isDayBeforeToday) {
                                        bgColor = 'bg-red-500/10';
                                        textColor = 'text-red-500';
                                    }
                                }

                                return (
                                    <div
                                        key={`${widx}-${didx}`}
                                        className={`h-24 sm:h-32 transition-all p-3 flex flex-col items-center justify-center relative ${bgColor} ${day ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                                    >
                                        {day ? (
                                            <>
                                                <span className={`text-2xl font-black ${textColor} ${present ? 'scale-125' : ''}`}>
                                                    {day}
                                                </span>
                                                {present && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                                                    </div>
                                                )}
                                                {present ? (
                                                    <div className="mt-2 text-[10px] font-black text-emerald-500/80 uppercase tracking-tighter">Present</div>
                                                ) : isDayBeforeToday ? (
                                                    <div className="mt-2 text-[10px] font-black text-red-500/60 uppercase tracking-tighter">Absent</div>
                                                ) : null}
                                            </>
                                        ) : null}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default MemberAttendance;
