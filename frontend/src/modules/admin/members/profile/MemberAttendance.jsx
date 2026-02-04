import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronDown, Dumbbell, User } from 'lucide-react';

const MemberAttendance = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const {
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo
    } = context || {};
    const [activeTab, setActiveTab] = useState('general');
    const [month, setMonth] = useState('February');
    const [year, setYear] = useState('2026');

    const daysInMonth = 28; // February 2026
    const startDay = 0; // Starts on Sunday for Feb 2026? Actually Feb 1, 2026 is Sunday.
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

    const CustomSelect = ({ value, onChange, options }) => (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-2 rounded-lg border text-sm font-medium outline-none transition-all ${isDarkMode
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
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Attendance History</h2>

            {/* Info Card */}
            <div className={`rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Mobile Number</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberMobile}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Email ID</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmail}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">DOB</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberDOB}</p>
                    </div>
                </div>
                <div className="border-t dark:border-white/10 border-gray-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Anniversary Date</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberAnniversary}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact Name</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyName}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact No</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyNo}</p>
                    </div>
                </div>
            </div>

            {/* Attendance Content */}
            <div className={`rounded-xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                {/* Card Header */}
                <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{month}</h3>
                    <div className="flex items-center gap-3">
                        <CustomSelect
                            value={month}
                            onChange={setMonth}
                            options={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}
                        />
                        <CustomSelect
                            value={year}
                            onChange={setYear}
                            options={['2024', '2025', '2026', '2027']}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-5 border-b dark:border-white/10 border-gray-100 flex gap-8">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === 'general'
                            ? 'text-[#f97316]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <Dumbbell size={16} />
                        General Training
                        {activeTab === 'general' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f97316] rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === 'personal'
                            ? 'text-[#f97316]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <User size={16} />
                        Personal Training
                        {activeTab === 'personal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f97316] rounded-full" />}
                    </button>
                </div>

                {/* Summary */}
                <div className="p-5 flex gap-4">
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 px-4 py-1.5 rounded-full border border-green-100 dark:border-green-500/20">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">Present Days (0)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-500/20">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">Absent Days (3)</span>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className={`border-y dark:border-white/10 border-gray-100 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <th key={day} className="py-4 px-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weeks.map((week, widx) => (
                                <tr key={widx} className="border-b dark:border-white/5 border-gray-50 last:border-0">
                                    {week.map((day, didx) => (
                                        <td
                                            key={didx}
                                            className={`h-24 sm:h-32 border-r dark:border-white/5 border-gray-50 last:border-r-0 transition-all cursor-pointer group hover:bg-[#ff8c42] ${day === 3 ? 'bg-[#ff8c42]' : ''
                                                }`}
                                        >
                                            {day && (
                                                <div className="h-full w-full flex items-center justify-center relative">
                                                    <span className={`text-lg font-bold transition-all group-hover:text-white ${day === 3 ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-800')
                                                        }`}>
                                                        {day}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MemberAttendance;
