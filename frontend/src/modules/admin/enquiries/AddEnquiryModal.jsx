import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, PenLine, Calendar as CalendarIcon, ChevronDown, Check, Clock } from 'lucide-react';

// --- Helper Components ---

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

    return (
        <div className="relative" ref={dropdownRef}>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : 'bg-white'
                    } ${isOpen
                        ? 'border-[#f97316] text-[#f97316]'
                        : (isDarkMode ? 'border-white/10 text-white' : `border-gray-300 ${value ? 'text-gray-900' : 'text-gray-500'}`)
                    }`}
            >
                <span className={isOpen ? 'text-[#f97316]' : ''}>{value || placeholder}</span>
                <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
            </div>

            {isOpen && (
                <div className={`absolute z-50 w-full mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border transition-none custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    {options.map((option, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-3 text-[14px] cursor-pointer transition-colors border-b last:border-0 border-gray-50 dark:border-white/5 ${isDarkMode
                                ? 'text-gray-300 hover:bg-white/5'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                } ${value === option ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-orange-50 text-orange-600') : ''}`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MultiSelectDropdown = ({ label, placeholder, options, value = [], onChange, isDarkMode }) => {
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

    const handleToggle = (option) => {
        const newValue = value.includes(option)
            ? value.filter(item => item !== option)
            : [...value, option];
        onChange(newValue);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : 'bg-white'
                    } ${isOpen
                        ? 'border-[#f97316] text-[#f97316]'
                        : (isDarkMode ? 'border-white/10 text-white' : `border-gray-300 ${value.length > 0 ? 'text-gray-900' : 'text-gray-500'}`)
                    }`}
            >
                <span className={`${isOpen ? 'text-[#f97316]' : ''} truncate pr-2`}>
                    {value.length > 0 ? value.join(', ') : placeholder}
                </span>
                <ChevronDown size={16} className={`flex-shrink-0 ${isOpen ? 'text-[#f97316]' : 'text-gray-400'}`} />
            </div>

            {isOpen && (
                <div className={`absolute z-50 w-full mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border transition-none custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    {options.map((option, idx) => {
                        const isSelected = value.includes(option);
                        return (
                            <div
                                key={idx}
                                onClick={() => handleToggle(option)}
                                className={`px-4 py-3 text-[14px] cursor-pointer transition-colors border-b last:border-0 border-gray-50 dark:border-white/5 flex items-center gap-3 ${isDarkMode
                                    ? 'text-gray-300 hover:bg-white/5'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${isSelected
                                    ? 'bg-[#f97316] border-[#f97316]'
                                    : (isDarkMode ? 'border-gray-600' : 'border-gray-300')
                                    }`}>
                                    {isSelected && <Check size={14} className="text-white" />}
                                </div>
                                <span>{option}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const CustomDatePicker = ({ label, value, onChange, isDarkMode, withTime = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('calendar'); // calendar, months, years
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        if (value) {
            // Check if value includes time: "DD-MM-YYYY HH:mm"
            const parts = value.split(' ');
            const datePart = parts[0];
            const timePart = parts[1] || '';

            const [d, m, y] = datePart.split('-');
            if (d && m && y) {
                setCurrentDate(new Date(y, m - 1, d));
            }
            if (timePart) {
                setSelectedTime(timePart);
            }
        }
    }, [value]);

    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setView('calendar');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handleDateSelect = (day) => {
        const d = String(day).padStart(2, '0');
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const y = currentDate.getFullYear();

        let finalValue = `${d}-${m}-${y}`;

        if (withTime) {
            // For TimePicker mode, just update state, don't close yet if we want a "Apply" flow
            // But based on UX usually user picks date then time.
            // We'll mimic the picture: Date + Time section at bottom + Cancel/Apply buttons
            onChange(finalValue + (selectedTime ? ` ${selectedTime}` : '')); // Update parent immediately or on Apply only?
            // Since the image shows Cancel/Apply, we should strictly use internal state until Apply is clicked. 
            // However, for simplicity let's update parents but keep modal open.

            // Wait, the image shows "Time --:--". Let's handle local state truly.
        } else {
            onChange(finalValue);
            setIsOpen(false);
        }
    };

    // Internal state for the picker when open
    const [tempDate, setTempDate] = useState(null);
    const [tempTime, setTempTime] = useState('');

    useEffect(() => {
        if (isOpen) {
            const parts = (value || '').split(' ');
            setTempDate(parts[0] || ''); // stores "dd-mm-yyyy"
            setTempTime(parts[1] || '');
        }
    }, [isOpen]);

    const handleApply = () => {
        if (tempDate) {
            onChange(`${tempDate} ${tempTime}`.trim());
        }
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleDayClickInternal = (day) => {
        const d = String(day).padStart(2, '0');
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const y = currentDate.getFullYear();
        const dateStr = `${d}-${m}-${y}`;

        if (withTime) {
            setTempDate(dateStr);
        } else {
            onChange(dateStr);
            setIsOpen(false);
        }
    };

    const generateDays = () => {
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            // Check against tempDate if open, or value if closed/initial
            const currentCheck = withTime && isOpen ? tempDate : (value || '').split(' ')[0];

            const isSelected = currentCheck === `${String(i).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
            const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

            days.push(
                <button
                    key={i}
                    onClick={() => handleDayClickInternal(i)}
                    className={`h-9 w-9 flex items-center justify-center text-[13px] rounded-full transition-all ${isSelected
                        ? 'bg-[#f97316] text-white font-bold shadow-md'
                        : isToday
                            ? (isDarkMode ? 'text-orange-400 font-bold' : 'text-orange-600 font-bold')
                            : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100')
                        }`}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 100; i <= currentYear + 10; i++) {
            years.push(i);
        }
        return years.reverse();
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : `bg-white border-gray-300 ${value ? 'text-gray-900' : 'text-gray-500'}`
                    } ${isOpen ? 'border-[#f97316]' : ''}`}
            >
                <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
                    <span className={isOpen ? 'text-[#f97316]' : ''}>{value || 'dd-mm-yyyy'}</span>
                </div>
                <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
            </div>

            {isOpen && (
                <div className={`absolute z-50 mt-1 rounded-xl shadow-2xl border w-[320px] transition-none overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    <div className="p-4">
                        <div className="flex gap-2 mb-4">
                            <div
                                onClick={() => setView(view === 'months' ? 'calendar' : 'months')}
                                className={`flex-1 border rounded-lg px-3 py-2 text-[14px] font-medium cursor-pointer flex items-center justify-between transition-colors ${view === 'months' ? 'border-[#f97316] text-[#f97316]' : (isDarkMode ? 'border-white/10 text-white' : 'border-gray-300 text-gray-700')
                                    }`}
                            >
                                {months[currentDate.getMonth()]}
                            </div>
                            <div
                                onClick={() => setView(view === 'years' ? 'calendar' : 'years')}
                                className={`w-24 border rounded-lg px-3 py-2 text-[14px] font-medium cursor-pointer flex items-center justify-between transition-colors ${view === 'years' ? 'border-[#f97316] text-[#f97316]' : (isDarkMode ? 'border-white/10 text-white' : 'border-gray-300 text-gray-700')
                                    }`}
                            >
                                {currentDate.getFullYear()}
                            </div>
                        </div>

                        {view === 'calendar' && (
                            <>
                                <div className="grid grid-cols-7 mb-2">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                        <div key={day} className={`text-center text-[12px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-800'}`}>
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {generateDays()}
                                </div>
                            </>
                        )}

                        {view === 'months' && (
                            <div className="grid grid-cols-1 gap-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {months.map((month, idx) => (
                                    <button
                                        key={month}
                                        onClick={() => {
                                            setCurrentDate(new Date(currentDate.getFullYear(), idx, 1));
                                            setView('calendar');
                                        }}
                                        className={`text-left px-4 py-2 rounded text-[14px] transition-colors ${currentDate.getMonth() === idx
                                            ? 'bg-[#f97316] text-white'
                                            : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50')
                                            }`}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        )}

                        {view === 'years' && (
                            <div className="grid grid-cols-1 gap-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                                {generateYears().map(year => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            setCurrentDate(new Date(year, currentDate.getMonth(), 1));
                                            setView('calendar');
                                        }}
                                        className={`text-left px-4 py-2 rounded text-[14px] transition-colors ${currentDate.getFullYear() === year
                                            ? 'bg-[#f97316] text-white'
                                            : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50')
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer with Time Picker and Buttons (Only if withTime=true) */}
                    {withTime && view === 'calendar' && (
                        <div className={`p-4 border-t ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time</span>
                                <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-white ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-300'}`}>
                                    <input
                                        type="time"
                                        value={tempTime}
                                        onChange={(e) => setTempTime(e.target.value)}
                                        className={`bg-transparent outline-none text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                                    />
                                    <Clock size={16} className="text-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={handleCancel}
                                    className={`px-4 py-1.5 rounded-lg text-[13px] font-bold ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="px-6 py-1.5 rounded-lg text-[13px] font-bold bg-[#f97316] hover:bg-orange-600 text-white shadow-md active:scale-95"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


// --- Main Component ---

const AddEnquiryModal = ({ isOpen, onClose, isDarkMode }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [formData, setFormData] = useState({
        gender: '',
        maritalStatus: '',
        birthDate: '',
        anniversaryDate: '',
        commitmentDate: '',
        source: '',
        isExercising: '',
        hasHealthChallenges: '',
        fitnessGoal: '',
        gymService: [], // Array for multi-select
        trialStartDate: '',
        trialEndDate: '',
        assignTo: '',
        leadType: '',
        personalityType: '',
        referralMember: '',
    });

    if (!isOpen) return null;

    const inputClass = `w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none transition-none ${isDarkMode
        ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500'
        : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'
        }`;

    const labelClass = `block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`;

    const sectionTitleClass = `text-[15px] font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'
        }`;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Dummy Data
    const trainerOptions = [
        "Abdulla Pathan",
        "ANJALI KANWAR",
        "V10 FITNESS LAB",
        "Ravi Kumar",
        "Priya Singh",
        "Amit Patel",
        "Suresh Raina",
        "Deepak Chahar"
    ];

    const referralOptions = [
        "GIRDHAR BHAI",
        "RAHUL KUSHWAH",
        "ANURAG SINGH",
        "Sanjay Dutt",
        "Salman Khan",
        "Shahrukh Khan"
    ];

    const leadTypeOptions = ["Hot", "Warm", "Cold"];
    const personalityOptions = ["Gym Donor", "Gym Excuser", "Gym Goer"];

    // New Options based on latest images
    const fitnessGoalOptions = ["Looking Always fit", "Core Strengthening", "Kids Dance", "Weight Loss", "Muscle Gain"];
    const gymServiceOptions = [
        "Kick Boxing",
        "Fitness Workout",
        "Personal Training",
        "Yoga",
        "Massage",
        "Pilates"
    ];


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
            <div className={`relative bg-white dark:bg-[#1e1e1e] flex flex-col shadow-2xl transition-all duration-300 ${isFullScreen
                ? 'fixed inset-0 w-full h-full rounded-none'
                : 'w-full max-w-[800px] max-h-[90vh] rounded-xl'
                }`}>

                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-white/10 bg-[#1e1e1e]' : 'border-gray-100 bg-[#f8f9fa]'} rounded-t-xl`}>
                    <div className="flex items-center gap-3">
                        <PenLine size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
                        <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add Enquiry</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className={`p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-none ${isDarkMode ? 'text-white' : 'text-gray-600'}`}
                        >
                            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                        <button
                            onClick={onClose}
                            className={`p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-none ${isDarkMode ? 'text-white' : 'text-gray-600'}`}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

                    {/* Personal Info */}
                    <div className="mb-8">
                        <h3 className={sectionTitleClass}>Personal Info</h3>
                        <div className={`grid grid-cols-1 ${isFullScreen ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-x-6 gap-y-5`}>

                            <div>
                                <label className={labelClass}>First Name*</label>
                                <input type="text" placeholder="First Name" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Last Name*</label>
                                <input type="text" placeholder="Last Name" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Mobile Number*</label>
                                <input type="text" placeholder="Ex : 9988776655" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input type="email" placeholder="Ex : abc@gmail.com" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Landline Number</label>
                                <input type="text" placeholder="Ex : 0261-245678" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Gender*</label>
                                <div className="flex items-center gap-6 mt-2.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="w-5 h-5 accent-[#f97316]"
                                            checked={formData.gender === 'Male'}
                                            onChange={() => handleInputChange('gender', 'Male')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Male</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            className="w-5 h-5 accent-[#f97316]"
                                            checked={formData.gender === 'Female'}
                                            onChange={() => handleInputChange('gender', 'Female')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Female</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Marital Status</label>
                                <div className="flex items-center gap-6 mt-2.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="marital"
                                            className="w-5 h-5 accent-[#f97316]"
                                            checked={formData.maritalStatus === 'Single'}
                                            onChange={() => handleInputChange('maritalStatus', 'Single')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Single</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="marital"
                                            className="w-5 h-5 accent-[#f97316]"
                                            checked={formData.maritalStatus === 'Married'}
                                            onChange={() => handleInputChange('maritalStatus', 'Married')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Married</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <CustomDatePicker
                                    label="Birth Date"
                                    value={formData.birthDate}
                                    onChange={(val) => handleInputChange('birthDate', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div>
                                <CustomDatePicker
                                    label="Aniversary Date"
                                    value={formData.anniversaryDate}
                                    onChange={(val) => handleInputChange('anniversaryDate', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div className={isFullScreen ? '' : 'md:col-span-2'}>
                                <label className={labelClass}>Residential Address</label>
                                <textarea
                                    rows={3}
                                    placeholder="Type your Address here..."
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="mb-8">
                        <h3 className={sectionTitleClass}>Professional Info</h3>
                        <div className={`grid grid-cols-1 ${isFullScreen ? 'md:grid-cols-2 lg:grid-cols-2' : 'md:grid-cols-2'} gap-x-6 gap-y-5`}>
                            <div>
                                <label className={labelClass}>Occupation</label>
                                <input type="text" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Job Profile</label>
                                <input type="text" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Company Name</label>
                                <input type="text" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Contact Person</label>
                                <input type="text" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Contact Number</label>
                                <input type="text" placeholder="999XXXXXX09" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Gym Info */}
                    <div className="mb-8">
                        <h3 className={sectionTitleClass}>Gym Info</h3>
                        <div className={`grid grid-cols-1 ${isFullScreen ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-x-6 gap-y-5`}>

                            <div>
                                <CustomDatePicker
                                    label="Commitment Date"
                                    value={formData.commitmentDate}
                                    onChange={(val) => handleInputChange('commitmentDate', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div>
                                <CustomDropdown
                                    label="Where did you hear about us?"
                                    placeholder="Select"
                                    options={['Google or other search', 'Word of mouth', 'Article or Blog post', 'Social Media']}
                                    value={formData.source}
                                    onChange={(val) => handleInputChange('source', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Are you currently exercising?</label>
                                <div className="flex items-center gap-6 mt-2.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.isExercising === 'No' ? 'border-[#f97316]' : 'border-gray-400'}`}>
                                            {formData.isExercising === 'No' && <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="exercising"
                                            className="hidden"
                                            checked={formData.isExercising === 'No'}
                                            onChange={() => handleInputChange('isExercising', 'No')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.isExercising === 'Yes' ? 'border-[#f97316]' : 'border-gray-400'}`}>
                                            {formData.isExercising === 'Yes' && <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="exercising"
                                            className="hidden"
                                            checked={formData.isExercising === 'Yes'}
                                            onChange={() => handleInputChange('isExercising', 'Yes')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Yes</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Current Activities</label>
                                <input type="text" className={inputClass} />
                            </div>

                        </div>

                        {/* Full width textareas */}
                        <div className="mt-5 space-y-5">
                            <div>
                                <label className={labelClass}>Dropout Reason</label>
                                <textarea rows={3} placeholder="Describe the reason here..." className={`${inputClass} resize-none`} />
                            </div>

                            <div>
                                <label className={labelClass}>Any Health challenges?</label>
                                <div className="flex items-center gap-6 mt-2 mb-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.hasHealthChallenges === 'No' ? 'border-[#f97316]' : 'border-gray-400'}`}>
                                            {formData.hasHealthChallenges === 'No' && <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="health"
                                            className="hidden"
                                            checked={formData.hasHealthChallenges === 'No'}
                                            onChange={() => handleInputChange('hasHealthChallenges', 'No')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.hasHealthChallenges === 'Yes' ? 'border-[#f97316]' : 'border-gray-400'}`}>
                                            {formData.hasHealthChallenges === 'Yes' && <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="health"
                                            className="hidden"
                                            checked={formData.hasHealthChallenges === 'Yes'}
                                            onChange={() => handleInputChange('hasHealthChallenges', 'Yes')}
                                        />
                                        <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Yes</span>
                                    </label>
                                </div>
                                <textarea rows={3} placeholder="If Yes Please Describe Health Issue here..." className={`${inputClass} resize-none`} />
                            </div>
                        </div>

                        {/* Other Dropdowns Grid */}
                        <div className={`grid grid-cols-1 ${isFullScreen ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-x-6 gap-y-5 mt-6`}>
                            <div>
                                <CustomDropdown
                                    label="Fitness Goal"
                                    placeholder="Select"
                                    options={fitnessGoalOptions}
                                    value={formData.fitnessGoal}
                                    onChange={(val) => handleInputChange('fitnessGoal', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                            <div>
                                <MultiSelectDropdown
                                    label="Gym Services*"
                                    placeholder="Gym Services"
                                    options={gymServiceOptions}
                                    value={formData.gymService}
                                    onChange={(val) => handleInputChange('gymService', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        </div>

                        <div className="mt-6 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded accent-[#f97316] border-gray-300" />
                                <span className={`text-[14px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Book a Trial</span>
                            </label>
                        </div>

                        <div className={`grid grid-cols-1 ${isFullScreen ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-x-6 gap-y-5`}>
                            <div>
                                <CustomDatePicker
                                    label="Schedule Start Trial*"
                                    value={formData.trialStartDate}
                                    onChange={(val) => handleInputChange('trialStartDate', val)}
                                    isDarkMode={isDarkMode}
                                    withTime={true}
                                />
                            </div>
                            <div>
                                <CustomDatePicker
                                    label="Schedule End Trial*"
                                    value={formData.trialEndDate}
                                    onChange={(val) => handleInputChange('trialEndDate', val)}
                                    isDarkMode={isDarkMode}
                                    withTime={true}
                                />
                            </div>

                            <div>
                                <CustomDropdown
                                    label="Assign To"
                                    placeholder="Select Trainer"
                                    options={trainerOptions}
                                    value={formData.assignTo}
                                    onChange={(val) => handleInputChange('assignTo', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div>
                                <CustomDropdown
                                    label="Lead Type*"
                                    placeholder="Select"
                                    options={leadTypeOptions}
                                    value={formData.leadType}
                                    onChange={(val) => handleInputChange('leadType', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div>
                                <CustomDropdown
                                    label="Personality Type"
                                    placeholder="Select"
                                    options={personalityOptions}
                                    value={formData.personalityType}
                                    onChange={(val) => handleInputChange('personalityType', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div>
                                <CustomDropdown
                                    label="Member/Employee Referral"
                                    placeholder="Select"
                                    options={referralOptions}
                                    value={formData.referralMember}
                                    onChange={(val) => handleInputChange('referralMember', val)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Budget per month</label>
                                <input type="text" placeholder="Ex : ₹4000" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Other Referral</label>
                                <input type="text" placeholder="Ex : Rahul" className={inputClass} />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className={labelClass}>Remarks / Summary</label>
                            <textarea rows={3} placeholder="Describe the reason here..." className={`${inputClass} resize-none`} />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-white/10 bg-[#1e1e1e]' : 'border-gray-100 bg-white'} rounded-b-xl`}>
                    <button className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                        Submit
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddEnquiryModal;
