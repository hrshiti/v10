import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Calendar, ChevronDown } from 'lucide-react';

// Custom Date Picker Component with Month/Year Dropdowns
const CustomDatePicker = ({ value, onChange, isDarkMode, placeholder = 'dd-mm-yyyy' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const pickerRef = useRef(null);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

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

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleDateClick = (day) => {
        const dateString = `${String(day).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
        onChange(dateString);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={pickerRef}>
            <div className={`w-full px-4 py-3 border rounded-lg flex items-center gap-2 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-300'}`}>
                <Calendar
                    size={18}
                    className="text-gray-400 cursor-pointer shrink-0"
                    onClick={() => setIsOpen(!isOpen)}
                />
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val);
                        if (val.match(/^\d{2}-\d{2}-\d{4}$/)) {
                            const [d, m, y] = val.split('-');
                            // Standard year check
                            if (y.length === 4) {
                                const dateObj = new Date(y, m - 1, d);
                                if (!isNaN(dateObj.getTime())) setCurrentDate(dateObj);
                            }
                        }
                    }}
                    placeholder={placeholder || 'DD-MM-YYYY'}
                    className={`flex-1 bg-transparent border-none outline-none text-[14px] ${isDarkMode ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
                <ChevronDown
                    size={16}
                    className={`text-gray-400 cursor-pointer ml-auto shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-2xl border z-50 w-[320px] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    <div className="flex gap-2 mb-4">
                        <select
                            value={months[currentDate.getMonth()]}
                            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), months.indexOf(e.target.value), 1))}
                            className={`w-1/2 p-2 rounded border text-sm font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'
                                }`}
                        >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select
                            value={currentDate.getFullYear()}
                            onChange={(e) => setCurrentDate(new Date(e.target.value, currentDate.getMonth(), 1))}
                            className={`w-1/2 p-2 rounded border text-sm font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'
                                }`}
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="text-center text-xs font-bold text-gray-500">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                        {days.map(d => (
                            <div
                                key={d}
                                onClick={() => handleDateClick(d)}
                                className={`h-8 flex items-center justify-center text-sm rounded cursor-pointer font-medium ${isDarkMode
                                    ? 'text-gray-300 hover:bg-[#f97316] hover:text-white'
                                    : 'text-gray-700 hover:bg-[#f97316] hover:text-white'
                                    }`}
                            >
                                {d}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Custom Multi-Select Dropdown with Checkboxes
const CustomMultiSelect = ({ options, value = [], onChange, isDarkMode, placeholder = "Select" }) => {
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

    const handleSelect = (option) => {
        const newValue = value.includes(option)
            ? value.filter(item => item !== option)
            : [...value, option];
        onChange(newValue);
    };

    const displayText = value.length > 0 ? value.join(', ') : placeholder;

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 border rounded-lg text-[14px] flex justify-between items-center cursor-pointer transition-all ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : isOpen ? 'bg-white border-[#f97316]' : 'bg-white border-gray-300'
                    }`}
            >
                <span className={`font-medium truncate ${value.length > 0 ? (isDarkMode ? 'text-white' : 'text-[#f97316]') : 'text-gray-400'}`}>
                    {displayText}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#f97316]' : 'text-gray-400'}`} />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`px-4 py-2.5 text-[14px] font-medium cursor-pointer flex items-center gap-3 transition-colors ${isDarkMode
                                ? 'text-gray-300 hover:bg-white/5'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(option) ? 'bg-[#f97316] border-[#f97316]' : 'border-gray-300'
                                }`}>
                                {value.includes(option) && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Custom Single Select Dropdown
const CustomSelect = ({ options, value, onChange, isDarkMode, placeholder = "Select" }) => {
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
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 border rounded-lg text-[14px] flex justify-between items-center cursor-pointer transition-all ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : isOpen ? 'bg-white border-[#f97316]' : 'bg-white border-gray-300'
                    }`}
            >
                <span className={`font-medium truncate ${value ? (isDarkMode ? 'text-white' : 'text-[#f97316]') : 'text-gray-400'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#f97316]' : 'text-gray-400'}`} />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                                ? 'text-gray-300 hover:bg-white/5'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const EditEmployeeModal = ({ isOpen, onClose, isDarkMode, employeeData }) => {
    const [formData, setFormData] = useState({
        firstName: employeeData?.name?.split(' ')[0] || 'PARI',
        lastName: employeeData?.name?.split(' ')[1] || 'PANDYA',
        mobile: employeeData?.mobile || '9586638773',
        email: 'pandyapari2004@gmail.com',
        gender: 'Female',
        marital: 'Single',
        birthDate: '',
        anniversaryDate: '',
        trainerCategory: '',
        trainerSubCategory: '',
        language: [],
        gymRole: [],
        gymActivities: [],
        bio: '',
        personalTrainingCharges: '',
        showPackageCharges: '',
        address: 'ctm',
        country: '',
        state: '',
        city: '',
        employeeType: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className={`w-full max-w-2xl my-8 rounded-lg shadow-2xl transition-all ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                {/* Header */}
                <div className={`p-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-100/50 border-gray-100'}`}>
                    <div className="flex items-center gap-2">
                        <div className="bg-black text-white p-1 rounded-md">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                        <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Employee</h2>
                    </div>
                    <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Personal Info */}
                    <h3 className={`text-[15px] font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>Personal Info</h3>

                    {/* Profile Upload */}
                    <div className="flex justify-center mb-8">
                        <input
                            type="file"
                            id="edit-employee-photo-upload"
                            className="hidden"
                            accept="image/*"
                        />
                        <label
                            htmlFor="edit-employee-photo-upload"
                            className={`w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${isDarkMode ? 'border-white/20 hover:bg-white/5' : 'border-gray-300'}`}
                        >
                            <Upload size={24} className="text-gray-400 mb-1" />
                            <span className={`text-[13px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload</span>
                        </label>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>First Name*</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Last Name*</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Mobile Number*</label>
                            <input
                                type="text"
                                value={formData.mobile}
                                onChange={(e) => handleChange('mobile', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Email Address*</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>
                    </div>

                    {/* Radio Groups */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block text-[13px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Gender*</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={formData.gender === 'Male'}
                                        onChange={() => handleChange('gender', 'Male')}
                                        className="w-5 h-5 accent-[#f97316]"
                                    />
                                    <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Male</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={formData.gender === 'Female'}
                                        onChange={() => handleChange('gender', 'Female')}
                                        className="w-5 h-5 accent-[#f97316]"
                                    />
                                    <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Female</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Marital Status</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="marital"
                                        checked={formData.marital === 'Single'}
                                        onChange={() => handleChange('marital', 'Single')}
                                        className="w-5 h-5 accent-[#f97316]"
                                    />
                                    <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Single</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="marital"
                                        checked={formData.marital === 'Married'}
                                        onChange={() => handleChange('marital', 'Married')}
                                        className="w-5 h-5 accent-[#f97316]"
                                    />
                                    <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Married</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Date Pickers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Birth Date*</label>
                            <CustomDatePicker
                                value={formData.birthDate}
                                onChange={(date) => handleChange('birthDate', date)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Anniversary Date</label>
                            <CustomDatePicker
                                value={formData.anniversaryDate}
                                onChange={(date) => handleChange('anniversaryDate', date)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Trainer Category</label>
                            <CustomSelect
                                options={['Gym & Strength Training', 'Mind-Body & Wellness', 'Dance & Group Fitness', 'Personal Training, Sm...']}
                                value={formData.trainerCategory}
                                onChange={(val) => handleChange('trainerCategory', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Select Category"
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Trainer Sub Category</label>
                            <CustomSelect
                                options={['Weightlifting', 'Cardio', 'CrossFit', 'Functional Training']}
                                value={formData.trainerSubCategory}
                                onChange={(val) => handleChange('trainerSubCategory', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Select Sub Category"
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Language*</label>
                            <CustomMultiSelect
                                options={['Hindi', 'English', 'Gujarati', 'Marathi', 'Tamil', 'Telugu']}
                                value={formData.language}
                                onChange={(val) => handleChange('language', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Select Languages"
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Gym Role*</label>
                            <CustomMultiSelect
                                options={['Branch Manager', 'Diet Consultant', 'Trainer', 'Receptionist', 'Sales Consultant', 'Gym Owner']}
                                value={formData.gymRole}
                                onChange={(val) => handleChange('gymRole', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Receptionist, Sales ..."
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Gym Activities</label>
                        <CustomMultiSelect
                            options={['Personal Training', 'Group Classes', 'Massage', 'Pilates', 'Yoga', 'Cardio']}
                            value={formData.gymActivities}
                            onChange={(val) => handleChange('gymActivities', val)}
                            isDarkMode={isDarkMode}
                            placeholder="Personal Training, G..."
                        />
                    </div>

                    <div className="mb-6">
                        <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Bio</label>
                        <textarea
                            placeholder="Type your bio..."
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            rows={4}
                            className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 placeholder:text-gray-400'}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Personal Training Charges</label>
                            <input
                                type="text"
                                placeholder="Training charges"
                                value={formData.personalTrainingCharges}
                                onChange={(e) => handleChange('personalTrainingCharges', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 placeholder:text-gray-400'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Show package charges</label>
                            <CustomSelect
                                options={['Yes', 'No']}
                                value={formData.showPackageCharges}
                                onChange={(val) => handleChange('showPackageCharges', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Select"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Residential Address*</label>
                        <textarea
                            placeholder="Type your Address here..."
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 placeholder:text-gray-400'}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Country*</label>
                            <CustomSelect
                                options={['India', 'USA', 'UK', 'Canada', 'Australia']}
                                value={formData.country}
                                onChange={(val) => handleChange('country', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Select Country"
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>State*</label>
                            <CustomSelect
                                options={['Gujarat', 'Maharashtra', 'Karnataka', 'Delhi', 'Rajasthan']}
                                value={formData.state}
                                onChange={(val) => handleChange('state', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Select State"
                            />
                        </div>
                        <div>
                            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>City*</label>
                            <CustomSelect
                                options={['Ahmedabad', 'Surat', 'Mumbai', 'Pune', 'Bangalore', 'Delhi']}
                                value={formData.city}
                                onChange={(val) => handleChange('city', val)}
                                isDarkMode={isDarkMode}
                                placeholder="Select City"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Employee Type*</label>
                        <CustomSelect
                            options={['Full Time', 'Shift Time', 'Part Time', 'Contract']}
                            value={formData.employeeType}
                            onChange={(val) => handleChange('employeeType', val)}
                            isDarkMode={isDarkMode}
                            placeholder="Select"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <button
                        onClick={onClose}
                        className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEmployeeModal;
