import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Info, ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';

// --- Shared Components (Copied from AddEnquiryModal for consistency) ---

const CustomDropdown = ({ label, placeholder, options, value, onChange, isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const labelClass = `block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div className="relative" ref={dropdownRef}>
            <label className={labelClass}>{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-none ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : isOpen ? 'border-[#f97316] text-[#f97316] bg-white' : 'bg-white border-gray-300 text-gray-500 shadow-sm'
                    }`}
            >
                <span className="text-[14px] font-bold">{value || placeholder}</span>
                <ChevronDown size={14} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                    {options.map(opt => (
                        <div
                            key={opt}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                            className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                                ? 'text-gray-300 hover:bg-white/5'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]'
                                }`}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CustomDatePicker = ({ label, value, onChange, isDarkMode, withTime = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('calendar'); // calendar, months, years
    const [currentDate, setCurrentDate] = useState(new Date());
    const [time, setTime] = useState({ hours: '12', minutes: '00', ampm: 'AM' });
    const pickerRef = useRef(null);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const formatDate = (day) => {
        const d = String(day).padStart(2, '0');
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const y = currentDate.getFullYear();
        return `${d}-${m}-${y}`;
    };

    const prevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        let finalValue = formatDate(day);

        if (withTime) {
            // Update value but keep open for time selection if desired, or handle accordingly
            onChange(`${finalValue} ${time.hours}:${time.minutes} ${time.ampm}`);
        } else {
            onChange(finalValue);
            setIsOpen(false);
        }
    };

    const generateDays = () => {
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
        const prevMonthDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
        const days = [];

        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, current: false });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, current: true });
        }
        const totalDisplayed = 42;
        const nextDays = totalDisplayed - days.length;
        for (let i = 1; i <= nextDays; i++) {
            days.push({ day: i, current: false });
        }
        return days.map((d, i) => (
            <div
                key={i}
                onClick={() => d.current && handleDateSelect(d.day)}
                className={`h-8 w-8 flex items-center justify-center rounded-lg text-[13px] font-bold cursor-pointer transition-all ${!d.current ? 'text-gray-300' :
                    i % 7 === 0 ? 'text-red-500 hover:bg-red-50' :
                        (value?.split(' ')[0] === formatDate(d.day) ? 'bg-[#f97316] text-white' : (isDarkMode ? 'text-white hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'))
                    }`}
            >
                {d.day}
            </div>
        ));
    };

    const labelClass = `block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <div className="relative" ref={pickerRef}>
            <label className={labelClass}>{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white shadow-none' : 'bg-white border-gray-300 text-gray-500 shadow-sm'}`}
            >
                <span className="text-[14px] font-bold">{value || 'dd-mm-yyyy'}</span>
                <CalendarIcon size={16} className="text-gray-400" />
            </div>

            {isOpen && (
                <div className={`absolute z-50 mt-1 rounded-xl shadow-2xl border w-[320px] transition-none overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <button onClick={prevMonth} className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2 flex-1">
                                <div
                                    onClick={() => setView(view === 'months' ? 'calendar' : 'months')}
                                    className={`flex-1 border rounded-lg px-2 py-2 text-[13px] font-bold cursor-pointer flex items-center justify-between transition-colors ${view === 'months' ? 'border-[#f97316] text-[#f97316]' : (isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-700')}`}
                                >
                                    {months[currentDate.getMonth()]}
                                </div>
                                <div
                                    onClick={() => setView(view === 'years' ? 'calendar' : 'years')}
                                    className={`w-20 border rounded-lg px-2 py-2 text-[13px] font-bold cursor-pointer flex items-center justify-between transition-colors ${view === 'years' ? 'border-[#f97316] text-[#f97316]' : (isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-700')}`}
                                >
                                    {currentDate.getFullYear()}
                                </div>
                            </div>
                            <button onClick={nextMonth} className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {view === 'calendar' && (
                            <>
                                <div className="grid grid-cols-7 mb-2">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                        <div key={day} className={`text-center text-[12px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-800'}`}>{day}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">{generateDays()}</div>
                            </>
                        )}

                        {view === 'months' && (
                            <div className="grid grid-cols-3 gap-2 py-2">
                                {months.map((m, idx) => (
                                    <div
                                        key={m}
                                        onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), idx, 1)); setView('calendar'); }}
                                        className={`px-2 py-3 rounded-lg text-[13px] font-bold cursor-pointer text-center transition-all ${currentDate.getMonth() === idx ? 'bg-[#f97316] text-white' : (isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50')}`}
                                    >
                                        {m.substring(0, 3)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === 'years' && (
                            <div className="grid grid-cols-3 gap-2 py-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                                {Array.from({ length: 151 }, (_, i) => currentDate.getFullYear() - 100 + i).map(y => (
                                    <div
                                        key={y}
                                        onClick={() => { setCurrentDate(new Date(y, currentDate.getMonth(), 1)); setView('calendar'); }}
                                        className={`px-2 py-3 rounded-lg text-[13px] font-bold cursor-pointer text-center transition-all ${currentDate.getFullYear() === y ? 'bg-[#f97316] text-white' : (isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50')}`}
                                    >
                                        {y}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const AddFollowUpModal = ({ isOpen, onClose, onSubmit, enquiryData, isDarkMode }) => {
    const [formData, setFormData] = useState({
        followUpDate: '',
        assignTo: '',
        type: '',
        convertibility: '',
        comments: ''
    });

    const trainerOptions = ['Abdulla Pathan', 'ANJALI KANWAR', 'PARI PANDYA'];
    const typeOptions = ['Call', 'Visit', 'Message'];
    const convertibilityOptions = ['Hot', 'Warm', 'Cold'];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative w-full max-w-[550px] max-h-[90vh] rounded-xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-300 ${isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`sticky top-0 z-10 flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-100 bg-[#f1f3f5]'}`}>
                    <div className="flex items-center gap-3">
                        <RotateCcw size={24} className="dark:text-white" />
                        <h2 className="text-[17px] font-black dark:text-white uppercase tracking-tight">Add to Follow Up</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Enquiry Properties Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-black uppercase dark:text-gray-200">Enquiry Properties</h3>
                            <Info size={18} className="text-gray-400" />
                        </div>

                        <div className={`border rounded-xl overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <div className="p-4 border-b dark:border-white/5">
                                <p className="font-black text-[16px] dark:text-white uppercase">{enquiryData?.name}</p>
                                <p className="text-[14px] text-gray-500 font-bold mt-1">Enquiry ID: {enquiryData?.id}</p>
                            </div>
                            <div className="divide-y dark:divide-white/5 font-bold text-[14px]">
                                <div className="p-4 flex justify-between">
                                    <span className="text-gray-700 dark:text-gray-400">Enquiry Date : {enquiryData?.date}</span>
                                </div>
                                <div className="p-4">
                                    <span className="text-gray-700 dark:text-gray-400">Remarks/Summary:</span>
                                </div>
                                <div className="p-4 flex gap-2">
                                    <span className="text-gray-700 dark:text-gray-400 min-w-[100px]">Handle by :</span>
                                    <span className="dark:text-white">{enquiryData?.handle}</span>
                                </div>
                                <div className="p-4 flex gap-2">
                                    <span className="text-gray-700 dark:text-gray-400 min-w-[100px]">Created by :</span>
                                    <span className="dark:text-white">489291</span>
                                </div>
                                <div className="p-4 flex items-center gap-2">
                                    <span className="text-gray-700 dark:text-gray-400 min-w-[100px]">Lead Type :</span>
                                    <span className={`px-3 py-1 rounded text-[11px] font-black uppercase text-white ${enquiryData?.type === 'Hot' ? 'bg-red-500' : 'bg-orange-500'
                                        }`}>
                                        {enquiryData?.type || 'Cold'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Follow Up Properties Section */}
                    <div className="space-y-6 pb-20">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-black uppercase dark:text-gray-200">Follow Up Properties</h3>
                            <Info size={18} className="text-gray-400" />
                        </div>

                        <div className="space-y-4">
                            <CustomDatePicker
                                label="Follow Up Date*"
                                value={formData.followUpDate}
                                onChange={(val) => handleInputChange('followUpDate', val)}
                                isDarkMode={isDarkMode}
                            />

                            <CustomDropdown
                                label="Assign To"
                                placeholder="Select Member"
                                options={trainerOptions}
                                value={formData.assignTo}
                                onChange={(val) => handleInputChange('assignTo', val)}
                                isDarkMode={isDarkMode}
                            />

                            <CustomDropdown
                                label="Type*"
                                placeholder="Select"
                                options={typeOptions}
                                value={formData.type}
                                onChange={(val) => handleInputChange('type', val)}
                                isDarkMode={isDarkMode}
                            />

                            <CustomDropdown
                                label="Convertibility*"
                                placeholder="Select"
                                options={convertibilityOptions}
                                value={formData.convertibility}
                                onChange={(val) => handleInputChange('convertibility', val)}
                                isDarkMode={isDarkMode}
                            />

                            <div>
                                <label className="block text-[14px] font-bold text-gray-700 dark:text-gray-300 mb-2">Comments*</label>
                                <textarea
                                    placeholder="Type your Comments here..."
                                    value={formData.comments}
                                    onChange={(e) => handleInputChange('comments', e.target.value)}
                                    className={`w-full h-24 p-4 border rounded-xl outline-none text-[14px] font-medium transition-all ${isDarkMode
                                        ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-[#f97316]'
                                        : 'bg-white border-gray-200 placeholder:text-gray-400 focus:border-[#f97316]'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`sticky bottom-0 left-0 right-0 p-4 border-t flex justify-between items-center transition-none z-10 ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'
                    }`}>
                    <div>
                        <p className="font-black text-[15px] dark:text-white">Abdulla Pathan</p>
                        <p className="text-[12px] text-gray-500 font-bold">Follow up Schedule by</p>
                    </div>
                    <button
                        onClick={() => onSubmit(formData)}
                        className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-black shadow-md active:scale-95 transition-all"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFollowUpModal;
