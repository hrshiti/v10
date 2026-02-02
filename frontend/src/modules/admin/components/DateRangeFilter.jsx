import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

const DateRangeFilter = ({ isDarkMode, onApply, selectedRangeLabel, align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // View State: The left month/year
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    // Custom Dropdown states
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    // Sidebar Active State
    const [activeSidebar, setActiveSidebar] = useState(selectedRangeLabel || 'Today');

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

    const handleDateClick = (day, month, year) => {
        const clickedDate = new Date(year, month, day);
        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
            setActiveSidebar('');
        } else {
            if (clickedDate < startDate) {
                setEndDate(startDate);
                setStartDate(clickedDate);
            } else {
                setEndDate(clickedDate);
            }
            setActiveSidebar('');
        }
    };

    const isDateSelected = (day, month, year) => {
        const date = new Date(year, month, day);
        if (!startDate) return false;
        if (endDate) return date >= startDate && date <= endDate;
        return date.getTime() === startDate.getTime();
    };

    const isEndpoint = (day, month, year) => {
        const date = new Date(year, month, day);
        if (!startDate) return false;
        if (endDate) return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
        return date.getTime() === startDate.getTime();
    };

    const setPredefinedRange = (type) => {
        setActiveSidebar(type);
        const now = new Date();
        let s = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let e = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (type) {
            case 'Today':
                break;
            case 'Yesterday':
                s.setDate(s.getDate() - 1);
                e.setDate(e.getDate() - 1);
                break;
            case 'Last Week':
                s.setDate(s.getDate() - 7);
                break;
            case 'Last Months':
                s.setMonth(s.getMonth() - 1);
                break;
            case 'This Year':
                s = new Date(now.getFullYear(), 0, 1);
                e = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                break;
        }
        setStartDate(s);
        setEndDate(e);
        setViewMonth(s.getMonth());
        setViewYear(s.getFullYear());
    };

    useEffect(() => {
        if (!startDate && selectedRangeLabel) {
            setPredefinedRange(selectedRangeLabel);
        } else if (!startDate) {
            setPredefinedRange('Today');
        }
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    };

    const handleApply = () => {
        if (onApply) {
            onApply({
                startDate: startDate || new Date(),
                endDate: endDate || startDate || new Date(),
                label: activeSidebar
            });
        }
        setIsOpen(false);
    };

    const handleClear = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        setStartDate(start);
        setEndDate(start);
        setActiveSidebar('Today');
        if (onApply) {
            onApply({
                startDate: start,
                endDate: start,
                label: 'Today'
            });
        }
        setIsOpen(false);
    };

    // Right month logic
    const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    const renderMonth = (m, y) => {
        const daysInMonth = getDaysInMonth(m, y);
        const firstDay = getFirstDayOfMonth(m, y);
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return (
            <div className="flex-1">
                <div className="grid grid-cols-7 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className={`text-center text-[13px] font-bold py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{d}</div>
                    ))}
                    {days.map((day, idx) => {
                        if (day === null) return <div key={`empty-${idx}`} className="h-10" />;
                        const selected = isDateSelected(day, m, y);
                        const endpoint = isEndpoint(day, m, y);
                        return (
                            <div
                                key={day}
                                onClick={() => handleDateClick(day, m, y)}
                                className={`h-10 flex items-center justify-center text-[13px] font-medium cursor-pointer rounded-md transition-all
                                    ${endpoint ? 'bg-[#f97316] text-white font-bold scale-105 shadow-sm' : selected ? (isDarkMode ? 'bg-[#f97316]/20 text-[#f97316]' : 'bg-orange-50 text-[#f97316]') : (isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-100 text-gray-700')}`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex items-center gap-3" ref={containerRef}>
            {/* The Main Trigger Box */}
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-3 px-4 py-2 border rounded-lg min-w-[280px] cursor-pointer shadow-sm transition-all h-[42px] ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-700'
                        } ${isOpen ? 'border-[#f97316] ring-1 ring-[#f97316]/20' : ''}`}
                >
                    <Calendar size={18} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className="text-[14px] font-bold">
                        {startDate ? `${formatDate(startDate)} - ${formatDate(endDate || startDate)}` : 'dd-mm-yyyy'}
                    </span>
                    <ChevronDown size={16} className={`ml-auto transition-transform ${isOpen ? 'rotate-180 text-[#f97316]' : 'text-gray-400'}`} />
                </div>

                {/* The Dropdown */}
                {isOpen && (
                    <div className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-[720px] shadow-2xl rounded-xl border flex overflow-hidden z-[1000] animation-fadeIn ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}
                    >
                        {/* Sidebar Presets */}
                        <div className={`w-[170px] border-r py-4 flex flex-col ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                            {['Today', 'Yesterday', 'Last Week', 'Last Months', 'This Year'].map(item => (
                                <button
                                    key={item}
                                    onClick={() => setPredefinedRange(item)}
                                    className={`relative text-left px-6 py-3 text-[14px] font-bold transition-all ${activeSidebar === item
                                        ? (isDarkMode ? 'text-[#f97316] bg-white/5' : 'text-[#f97316] bg-orange-50/50')
                                        : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:bg-gray-50')
                                        }`}
                                >
                                    {item}
                                    {activeSidebar === item && (
                                        <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#f97316]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Calendar Content */}
                        <div className="flex-1 p-6">
                            {/* Month/Year Navigation */}
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <div className="relative" ref={monthRef}>
                                    <div
                                        onClick={() => setIsMonthOpen(!isMonthOpen)}
                                        className={`w-[150px] px-4 py-2 border rounded-lg text-[14px] font-bold cursor-pointer flex items-center justify-between transition-all ${isDarkMode
                                            ? 'bg-[#1a1a1a] border-white/10 text-gray-300'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-[#f97316]'}`}
                                    >
                                        <span>{months[viewMonth]}</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </div>
                                    {isMonthOpen && (
                                        <div className={`absolute top-full left-0 mt-1 w-full max-h-[250px] overflow-y-auto rounded-lg shadow-2xl border z-[1001] custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
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

                                <div className="relative" ref={yearRef}>
                                    <div
                                        onClick={() => setIsYearOpen(!isYearOpen)}
                                        className={`w-[100px] px-4 py-2 border rounded-lg text-[14px] font-bold cursor-pointer flex items-center justify-between transition-all ${isDarkMode
                                            ? 'bg-[#1a1a1a] border-white/10 text-gray-300'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-[#f97316]'}`}
                                    >
                                        <span>{viewYear}</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </div>
                                    {isYearOpen && (
                                        <div className={`absolute top-full left-0 w-full mt-1 max-h-[250px] overflow-y-auto rounded-lg shadow-2xl border z-[1001] custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
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

                            {/* Dual Calendars */}
                            <div className="flex gap-10">
                                {renderMonth(viewMonth, viewYear)}
                                {renderMonth(rightMonth, rightYear)}
                            </div>

                            {/* Dropdown Footer Buttons */}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`px-8 py-2 rounded-lg text-[14px] font-bold transition-all ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="px-10 py-2 bg-[#f97316] text-white rounded-lg text-[14px] font-bold shadow-lg hover:bg-[#ea580c] active:scale-95 transition-all"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* External Header Buttons (Matching Image 1) */}
            <button
                onClick={handleApply}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white px-9 py-2 rounded-lg text-[14px] font-bold transition-all shadow-md active:scale-95 h-[42px] flex items-center justify-center min-w-[100px]"
            >
                Apply
            </button>
            <button
                onClick={handleClear}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white px-9 py-2 rounded-lg text-[14px] font-bold transition-all shadow-md active:scale-95 h-[42px] flex items-center justify-center min-w-[100px]"
            >
                Clear
            </button>
        </div>
    );
};

export default DateRangeFilter;
