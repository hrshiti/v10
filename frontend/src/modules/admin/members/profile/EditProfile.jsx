import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Calendar, ChevronDown } from 'lucide-react';

const CustomDatePicker = ({ value, onChange, placeholder, isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const pickerRef = useRef(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    // Years from 1950 to 2050
    const years = Array.from({ length: 100 }, (_, i) => 2050 - i);

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
        <div className="relative w-full" ref={pickerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 border rounded-lg text-[14px] flex items-center gap-3 cursor-pointer outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-700'
                    }`}
            >
                <Calendar size={18} className="text-gray-400" />
                <span className={value ? '' : 'text-gray-400'}>{value || placeholder || 'Select Date'}</span>
                <ChevronDown size={14} className="ml-auto text-gray-400" />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-2xl border z-50 w-[300px] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
                    }`}>
                    <div className="flex gap-2 mb-4">
                        <div className="relative w-1/2">
                            <select
                                value={months[currentDate.getMonth()]}
                                onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), months.indexOf(e.target.value), 1))}
                                className={`w-full p-2 rounded-lg border text-xs font-bold outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
                                    }`}
                            >
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="relative w-1/2">
                            <select
                                value={currentDate.getFullYear()}
                                onChange={(e) => setCurrentDate(new Date(e.target.value, currentDate.getMonth(), 1))}
                                className={`w-full p-2 rounded-lg border text-xs font-bold outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
                                    }`}
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-gray-500">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                        {days.map(d => (
                            <div
                                key={d}
                                onClick={() => handleDateClick(d)}
                                className={`h-7 flex items-center justify-center text-xs rounded cursor-pointer ${value && parseInt(value.split('-')[0]) === d && parseInt(value.split('-')[1]) === (currentDate.getMonth() + 1) && parseInt(value.split('-')[2]) === currentDate.getFullYear()
                                    ? 'bg-orange-500 text-white'
                                    : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600')
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

const EditProfile = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const { memberData, memberName, memberId, memberMobile } = context || {};
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    // Form State
    const [formData, setFormData] = useState({
        name: memberName || '',
        mobile: memberMobile || '',
        email: memberData?.email || '',
        clientId: memberId || '',
        emergencyName: memberData?.emergency_contact_name || '-',
        emergencyNumber: memberData?.emergency_contact_number || '-',
        gender: memberData?.gender || 'Male',
        maritalStatus: memberData?.marital_status || 'Single',
        birthDate: memberData?.dob || '',
        anniversaryDate: memberData?.anniversary_date || '',
        address: memberData?.address || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-yellow-400 flex items-center justify-center border-4 border-white shadow-sm">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.name}</h2>
                    <p className="text-sm text-gray-500">Client ID : {formData.clientId}</p>
                </div>
            </div>

            {/* Form */}
            <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'} shadow-sm`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Name */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mobile Number*</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Ex : abc@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>

                    {/* Client ID */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Client ID</label>
                        <input
                            type="text"
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>

                    {/* Emergency Contact Name */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Emergency Contact Name*</label>
                        <input
                            type="text"
                            name="emergencyName"
                            value={formData.emergencyName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>

                    {/* Emergency Contact Number */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Emergency Contact Number*</label>
                        <input
                            type="text"
                            name="emergencyNumber"
                            value={formData.emergencyNumber}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender*</label>
                        <div className="flex items-center gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                    className="accent-orange-500 w-4 h-4"
                                />
                                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Male</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                    className="accent-orange-500 w-4 h-4"
                                />
                                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Female</span>
                            </label>
                        </div>
                    </div>

                    {/* Marital Status */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marital Status</label>
                        <div className="flex items-center gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="maritalStatus"
                                    value="Single"
                                    checked={formData.maritalStatus === 'Single'}
                                    onChange={handleChange}
                                    className="accent-orange-500 w-4 h-4"
                                />
                                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Single</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="maritalStatus"
                                    value="Married"
                                    checked={formData.maritalStatus === 'Married'}
                                    onChange={handleChange}
                                    className="accent-orange-500 w-4 h-4"
                                />
                                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Married</span>
                            </label>
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Birth Date</label>
                        <CustomDatePicker
                            value={formData.birthDate}
                            onChange={(date) => setFormData(p => ({ ...p, birthDate: date }))}
                            placeholder="dd-mm-yyyy"
                            isDarkMode={isDarkMode}
                        />
                    </div>

                    {/* Anniversary Date */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Anniversary Date</label>
                        <CustomDatePicker
                            value={formData.anniversaryDate}
                            onChange={(date) => setFormData(p => ({ ...p, anniversaryDate: date }))}
                            placeholder="dd-mm-yyyy"
                            isDarkMode={isDarkMode}
                        />
                    </div>

                    {/* Residential Address */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Residential Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Type your Address here..."
                            rows="4"
                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        ></textarea>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditProfile;
