import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, PenLine, Calendar as CalendarIcon, ChevronDown, Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

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

    const prevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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
            <div className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none flex items-center gap-2 transition-none ${isDarkMode
                ? 'bg-[#1a1a1a] border-white/10'
                : 'bg-white border-gray-300'
                } ${isOpen ? 'border-[#f97316]' : ''}`}>

                <CalendarIcon
                    size={16}
                    className={`cursor-pointer shrink-0 ${isOpen ? 'text-[#f97316]' : 'text-gray-400'}`}
                    onClick={() => setIsOpen(!isOpen)}
                />

                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val);
                        const datePart = val.split(' ')[0];
                        if (datePart.match(/^\d{2}-\d{2}-\d{4}$/)) {
                            const [d, m, y] = datePart.split('-');
                            // Only update current date if we have a valid year (sanity check)
                            if (y.length === 4) {
                                const dateObj = new Date(y, m - 1, d);
                                if (!isNaN(dateObj.getTime())) setCurrentDate(dateObj);
                            }
                        }
                    }}
                    placeholder={withTime ? "dd-mm-yyyy HH:mm" : "dd-mm-yyyy"}
                    className={`flex-1 bg-transparent border-none outline-none font-semibold w-full ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                />

                <ChevronDown
                    size={16}
                    className={`cursor-pointer shrink-0 ml-auto ${isOpen ? 'text-[#f97316]' : 'text-gray-400'}`}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {isOpen && (
                <div className={`absolute z-50 mt-1 rounded-xl shadow-2xl border w-[320px] transition-none overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <button
                                onClick={prevMonth}
                                className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2 flex-1">
                                <div
                                    onClick={() => setView(view === 'months' ? 'calendar' : 'months')}
                                    className={`flex-1 border rounded-lg px-2 py-2 text-[13px] font-bold cursor-pointer flex items-center justify-between transition-colors ${view === 'months' ? 'border-[#f97316] text-[#f97316]' : (isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-700')
                                        }`}
                                >
                                    {months[currentDate.getMonth()]}
                                </div>
                                <div
                                    onClick={() => setView(view === 'years' ? 'calendar' : 'years')}
                                    className={`w-20 border rounded-lg px-2 py-2 text-[13px] font-bold cursor-pointer flex items-center justify-between transition-colors ${view === 'years' ? 'border-[#f97316] text-[#f97316]' : (isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-700')
                                        }`}
                                >
                                    {currentDate.getFullYear()}
                                </div>
                            </div>
                            <button
                                onClick={nextMonth}
                                className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                <ChevronRight size={18} />
                            </button>
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
                            <div className="grid grid-cols-3 gap-2 py-2">
                                {months.map((m, idx) => (
                                    <div
                                        key={m}
                                        onClick={() => {
                                            setCurrentDate(new Date(currentDate.getFullYear(), idx, 1));
                                            setView('calendar');
                                        }}
                                        className={`px-2 py-3 rounded-lg text-[13px] font-bold cursor-pointer text-center transition-all ${currentDate.getMonth() === idx
                                            ? 'bg-[#f97316] text-white shadow-md'
                                            : (isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]')
                                            }`}
                                    >
                                        {m.substring(0, 3)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === 'years' && (
                            <div className="grid grid-cols-3 gap-2 py-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {generateYears().map(year => (
                                    <div
                                        key={year}
                                        onClick={() => {
                                            setCurrentDate(new Date(year, currentDate.getMonth(), 1));
                                            setView('calendar');
                                        }}
                                        className={`px-2 py-3 rounded-lg text-[13px] font-bold cursor-pointer text-center transition-all ${currentDate.getFullYear() === year
                                            ? 'bg-[#f97316] text-white shadow-md'
                                            : (isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]')
                                            }`}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}

                        {withTime && view === 'calendar' && (
                            <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time</span>
                                    </div>
                                    <input
                                        type="time"
                                        value={tempTime}
                                        onChange={(e) => setTempTime(e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg border text-[13px] font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-800'
                                            }`}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className={`flex-1 py-2 rounded-lg text-[12px] font-bold border transition-colors ${isDarkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="flex-1 py-2 rounded-lg text-[12px] font-bold bg-[#f97316] text-white hover:bg-orange-600 shadow-md transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Main Component ---

const AddEnquiryModal = ({ isOpen, onClose, isDarkMode, initialData, onSuccess }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        emailAddress: '',
        landlineNumber: '',
        gender: '',
        maritalStatus: '',
        birthDate: '',
        anniversaryDate: '',
        residentialAddress: '',
        occupation: '',
        jobProfile: '',
        companyName: '',
        emergencyContactPerson: '',
        emergencyContactNumber: '',
        commitmentDate: '',
        source: '',
        isExercising: '',
        currentActivities: '',
        dropoutReason: '',
        hasHealthChallenges: '',
        healthIssueDescription: '',
        fitnessGoal: '',
        gymService: [], // Array for multi-select
        trialStartDate: '',
        trialEndDate: '',
        assignTo: '',
        leadType: '',
        personalityType: '',
        referralMember: '',
        budgetPerMonth: '',
        otherReferral: '',
        remarksSummary: '',
    });

    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const res = await fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setTrainers(data || []);
            } catch (error) {
                console.error('Error fetching trainers:', error);
            }
        };
        if (isOpen) fetchTrainers();
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                mobileNumber: initialData.mobile || '',
                emailAddress: initialData.email || '',
                landlineNumber: initialData.landline || '',
                gender: initialData.gender || 'Male',
                maritalStatus: initialData.maritalStatus || 'Single',
                birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0].split('-').reverse().join('-') : '',
                anniversaryDate: initialData.anniversaryDate ? new Date(initialData.anniversaryDate).toISOString().split('T')[0].split('-').reverse().join('-') : '',
                residentialAddress: initialData.address || '',
                occupation: initialData.occupation || '',
                jobProfile: initialData.jobProfile || '',
                companyName: initialData.companyName || '',
                emergencyContactPerson: initialData.emergencyContact?.name || '',
                emergencyContactNumber: initialData.emergencyContact?.number || '',
                commitmentDate: initialData.commitmentDate ? new Date(initialData.commitmentDate).toISOString().split('T')[0].split('-').reverse().join('-') : '',
                source: initialData.source || '',
                isExercising: initialData.isExercising || 'No',
                currentActivities: initialData.currentActivities || '',
                dropoutReason: initialData.dropoutReason || '',
                hasHealthChallenges: initialData.hasHealthChallenges || 'No',
                healthIssueDescription: initialData.healthIssueDescription || '',
                fitnessGoal: initialData.fitnessGoal || '',
                gymService: initialData.gymServices || [],
                trialStartDate: initialData.trialStartDate ? new Date(initialData.trialStartDate).toISOString().split('T')[0].split('-').reverse().join('-') : '',
                trialEndDate: initialData.trialEndDate ? new Date(initialData.trialEndDate).toISOString().split('T')[0].split('-').reverse().join('-') : '',
                assignTo: initialData.handleBy?._id || initialData.handleBy || '',
                leadType: initialData.leadType || 'Cold',
                personalityType: initialData.personalityType || '',
                referralMember: initialData.referralMember || '',
                budgetPerMonth: initialData.budgetPerMonth || '', // Assuming this exists in DB but not in model? 
                otherReferral: initialData.otherReferral || '',
                remarksSummary: initialData.remark || '',
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                mobileNumber: '',
                emailAddress: '',
                landlineNumber: '',
                gender: 'Male',
                maritalStatus: 'Single',
                birthDate: '',
                anniversaryDate: '',
                residentialAddress: '',
                occupation: '',
                jobProfile: '',
                companyName: '',
                emergencyContactPerson: '',
                emergencyContactNumber: '',
                commitmentDate: '',
                source: '',
                isExercising: 'No',
                currentActivities: '',
                dropoutReason: '',
                hasHealthChallenges: 'No',
                healthIssueDescription: '',
                fitnessGoal: '',
                gymService: [],
                trialStartDate: '',
                trialEndDate: '',
                assignTo: '',
                leadType: 'Cold',
                personalityType: '',
                referralMember: '',
                budgetPerMonth: '',
                otherReferral: '',
                remarksSummary: '',
            });
        }
    }, [initialData, isOpen]);

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

    // Dynamic Data
    const trainerOptions = trainers.map(t => ({ label: `${t.firstName} ${t.lastName}`, id: t._id }));
    const trainerLabels = trainerOptions.map(t => t.label);



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

    const formatToDBDate = (dateStr) => {
        if (!dateStr) return null;
        // Split date and time (if any)
        const parts = dateStr.split(' ');
        const datePart = parts[0];
        const timePart = parts[1] || '';

        // Handle DD-MM-YYYY format
        const dateSegments = datePart.split('-');
        if (dateSegments.length !== 3) return dateStr; // Return original if not in expected format

        const [d, m, y] = dateSegments;
        // Basic check for valid segments (especially for manual typing)
        if (d.length > 2 || m.length > 2 || y.length !== 4) return dateStr;

        let formatted = `${y}-${m}-${d}`;
        if (timePart) {
            // Ensure time is in 24h format HH:mm
            formatted += `T${timePart}`;
        }
        return formatted;
    };

    const handleSubmit = async () => {
        console.log('--- Submit Enquiry Started ---');
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) {
                console.error('Submit Error: No token found');
                alert('Session expired. Please login again.');
                return;
            }

            console.log('Form Data:', formData);

            // Basic Validation
            if (!formData.firstName || !formData.lastName || !formData.mobileNumber) {
                console.warn('Validation Failed: Missing required fields', {
                    firstName: !!formData.firstName,
                    lastName: !!formData.lastName,
                    mobileNumber: !!formData.mobileNumber
                });
                alert('Please fill at least First Name, Last Name and Mobile Number.');
                return;
            }

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobileNumber,
                email: formData.emailAddress,
                landline: formData.landlineNumber,
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                birthDate: formatToDBDate(formData.birthDate),
                anniversaryDate: formatToDBDate(formData.anniversaryDate),
                address: formData.residentialAddress,
                occupation: formData.occupation,
                jobProfile: formData.jobProfile,
                companyName: formData.companyName,
                emergencyContactName: formData.emergencyContactPerson,
                emergencyContactNumber: formData.emergencyContactNumber,
                commitmentDate: formatToDBDate(formData.commitmentDate),
                source: formData.source,
                isExercising: formData.isExercising,
                currentActivities: formData.currentActivities,
                dropoutReason: formData.dropoutReason,
                hasHealthChallenges: formData.hasHealthChallenges,
                healthIssueDescription: formData.healthIssueDescription,
                fitnessGoal: formData.fitnessGoal,
                gymServices: formData.gymService,
                trialStartDate: formatToDBDate(formData.trialStartDate),
                trialEndDate: formatToDBDate(formData.trialEndDate),
                assignTo: trainerOptions.find(t => t.label === formData.assignTo)?.id || null,
                leadType: formData.leadType,
                personalityType: formData.personalityType,
                referralMember: formData.referralMember,
                remark: formData.remarksSummary,
                status: initialData?.status || 'Open'
            };

            console.log('Submission Payload:', payload);

            const url = initialData
                ? `${API_BASE_URL}/api/admin/enquiries/${initialData._id}`
                : `${API_BASE_URL}/api/admin/enquiries`;

            const method = initialData ? 'PUT' : 'POST';
            console.log(`Request: ${method} ${url}`);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log('Response Status:', response.status);

            if (response.ok) {
                console.log('Submission Successful');
                onSuccess();
            } else {
                const errorData = await response.json();
                console.error('Submission Failed:', errorData);
                alert(errorData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('--- Submit Enquiry Fatal Error ---');
            console.error('Error Object:', error);
            console.error('Error Message:', error.message);
            alert('Failed to submit enquiry');
        }
    };


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
                        <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {initialData ? 'Edit Enquiry' : 'Add Enquiry'}
                        </h2>
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
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className={inputClass}
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Last Name*</label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className={inputClass}
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Mobile Number*</label>
                                <input
                                    type="text"
                                    placeholder="Ex : 9988776655"
                                    className={inputClass}
                                    value={formData.mobileNumber}
                                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Ex : abc@gmail.com"
                                    className={inputClass}
                                    value={formData.emailAddress}
                                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Landline Number</label>
                                <input
                                    type="text"
                                    placeholder="Ex : abc@gmail.com"
                                    className={inputClass}
                                    value={formData.landlineNumber}
                                    onChange={(e) => handleInputChange('landlineNumber', e.target.value)}
                                />
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
                                <label className={labelClass}>Birth Date</label>
                                <input
                                    type="text"
                                    placeholder="DD-MM-YYYY"
                                    className={inputClass}
                                    value={formData.birthDate || ''}
                                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Anniversary Date</label>
                                <input
                                    type="text"
                                    placeholder="DD-MM-YYYY"
                                    className={inputClass}
                                    value={formData.anniversaryDate || ''}
                                    onChange={(e) => handleInputChange('anniversaryDate', e.target.value)}
                                />
                            </div>

                            <div className={isFullScreen ? '' : 'md:col-span-2'}>
                                <label className={labelClass}>Residential Address</label>
                                <textarea
                                    rows={3}
                                    placeholder="Type your Address here..."
                                    className={`${inputClass} resize-none`}
                                    value={formData.residentialAddress}
                                    onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
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
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={formData.occupation}
                                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Job Profile</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={formData.jobProfile}
                                    onChange={(e) => handleInputChange('jobProfile', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Company Name</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={formData.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Contact Person</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={formData.emergencyContactPerson}
                                    onChange={(e) => handleInputChange('emergencyContactPerson', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Emergency Contact Number</label>
                                <input
                                    type="text"
                                    placeholder="999XXXXXX09"
                                    className={inputClass}
                                    value={formData.emergencyContactNumber}
                                    onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                                />
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
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={formData.currentActivities}
                                    onChange={(e) => handleInputChange('currentActivities', e.target.value)}
                                />
                            </div>

                        </div>

                        {/* Full width textareas */}
                        <div className="mt-5 space-y-5">
                            <div>
                                <label className={labelClass}>Dropout Reason</label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe the reason here..."
                                    className={`${inputClass} resize-none`}
                                    value={formData.dropoutReason}
                                    onChange={(e) => handleInputChange('dropoutReason', e.target.value)}
                                />
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
                                <textarea
                                    rows={3}
                                    placeholder="If Yes Please Describe Health Issue here..."
                                    className={`${inputClass} resize-none`}
                                    value={formData.healthIssueDescription}
                                    onChange={(e) => handleInputChange('healthIssueDescription', e.target.value)}
                                />
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
                                    options={trainerLabels}
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
                                <label className={labelClass}>Budget per month</label>
                                <input
                                    type="text"
                                    placeholder="Ex : ₹4000"
                                    className={inputClass}
                                    value={formData.budgetPerMonth}
                                    onChange={(e) => handleInputChange('budgetPerMonth', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Other Referral</label>
                                <input
                                    type="text"
                                    placeholder="Ex : Rahul"
                                    className={inputClass}
                                    value={formData.otherReferral}
                                    onChange={(e) => handleInputChange('otherReferral', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className={labelClass}>Remarks / Summary</label>
                            <textarea
                                rows={3}
                                placeholder="Describe the reason here..."
                                className={`${inputClass} resize-none`}
                                value={formData.remarksSummary}
                                onChange={(e) => handleInputChange('remarksSummary', e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-white/10 bg-[#1e1e1e]' : 'border-gray-100 bg-white'} rounded-b-xl`}>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                    >
                        Submit
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddEnquiryModal;
