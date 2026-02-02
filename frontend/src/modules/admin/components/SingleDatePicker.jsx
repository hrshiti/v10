import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const SingleDatePicker = ({ isDarkMode, onSelect, value, placeholder = "dd-mm-yyyy" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    // Custom Dropdown states
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const monthRef = useRef(null);
    const yearRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (monthRef.current && !monthRef.current.contains(event.target)) {
                setIsMonthOpen(false);
            }
            if (yearRef.current && !yearRef.current.contains(event.target)) {
                setIsYearOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const handleDateClick = (day) => {
        const selectedDate = new Date(viewYear, viewMonth, day);
        const formattedDate = `${String(day).padStart(2, '0')}-${String(viewMonth + 1).padStart(2, '0')}-${viewYear}`;
        onSelect(formattedDate);
        setIsOpen(false);
    };

    const isSelected = (day) => {
        if (!value) return false;
        const [d, m, y] = value.split('-').map(Number);
        return d === day && m === viewMonth + 1 && y === viewYear;
    };

    const renderMonth = () => {
        const daysInMonth = getDaysInMonth(viewMonth, viewYear);
        const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return (
            <div className="grid grid-cols-7 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-center text-[12px] font-bold text-gray-500 py-2">{d}</div>
                ))}
                {days.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} className="h-9" />;
                    const selected = isSelected(day);
                    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

                    return (
                        <div
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`h-9 flex items-center justify-center text-[13px] font-medium cursor-pointer rounded-lg transition-all
                                ${selected ? 'bg-[#f97316] text-white font-bold' : isToday ? 'text-[#f97316] border border-[#f97316]/30' : 'hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-white/5'}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[180px] cursor-pointer shadow-sm transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
            >
                <Calendar size={18} className="text-gray-400" />
                <span className="text-[14px] font-bold">{value || placeholder}</span>
                <ChevronDown size={14} className={`ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 mt-2 w-[320px] shadow-2xl rounded-xl border p-4 z-[999] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}
                >
                    {/* Header with Custom Selects (Image 2 Style) */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1" ref={monthRef}>
                            <div
                                onClick={() => setIsMonthOpen(!isMonthOpen)}
                                className={`px-4 py-2.5 border rounded-lg text-[14px] font-bold flex items-center justify-between cursor-pointer transition-all ${isDarkMode
                                    ? 'bg-[#1a1a1a] border-white/10 text-gray-400'
                                    : 'bg-white border-gray-200 text-gray-400 hover:border-[#f97316]'}`}
                            >
                                <span>{months[viewMonth]}</span>
                            </div>
                            {isMonthOpen && (
                                <div className={`absolute top-full left-0 w-full mt-1 max-h-[220px] overflow-y-auto rounded-lg shadow-2xl border z-[1001] custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                    {months.map((m, i) => (
                                        <div
                                            key={i}
                                            onClick={() => { setViewMonth(i); setIsMonthOpen(false); }}
                                            className={`px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-colors ${i === viewMonth ? 'text-[#f97316] bg-orange-50' : (isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-orange-50 hover:text-[#f97316]')}`}
                                        >
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative w-[110px]" ref={yearRef}>
                            <div
                                onClick={() => setIsYearOpen(!isYearOpen)}
                                className={`px-4 py-2.5 border rounded-lg text-[14px] font-bold flex items-center justify-between cursor-pointer transition-all ${isDarkMode
                                    ? 'bg-[#1a1a1a] border-white/10 text-gray-400'
                                    : 'bg-white border-gray-200 text-gray-400 hover:border-[#f97316]'}`}
                            >
                                <span>{viewYear}</span>
                            </div>
                            {isYearOpen && (
                                <div className={`absolute top-full left-0 w-full mt-1 max-h-[220px] overflow-y-auto rounded-lg shadow-2xl border z-[1001] custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                    {Array.from({ length: 31 }, (_, i) => today.getFullYear() - 15 + i).map(y => (
                                        <div
                                            key={y}
                                            onClick={() => { setViewYear(y); setIsYearOpen(false); }}
                                            className={`px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-colors ${y === viewYear ? 'text-[#f97316] bg-orange-50' : (isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-orange-50 hover:text-[#f97316]')}`}
                                        >
                                            {y}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    {renderMonth()}
                </div>
            )}
        </div>
    );
};

export default SingleDatePicker;
