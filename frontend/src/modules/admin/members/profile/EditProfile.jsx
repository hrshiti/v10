import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, ChevronDown, CheckCircle2, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

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

    const handleInputChange = (e) => {
        const newVal = e.target.value;
        onChange(newVal);

        // Try to update calendar view if valid date
        if (newVal && newVal.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const [d, m, y] = newVal.split('-').map(num => parseInt(num, 10));
            if (d && m && y) {
                const dateObj = new Date(y, m - 1, d);
                if (!isNaN(dateObj.getTime())) {
                    setCurrentDate(dateObj);
                }
            }
        }
    };

    return (
        <div className="relative w-full" ref={pickerRef}>
            <div className={`w-full px-4 py-3 border rounded-lg flex items-center gap-3 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-300'}`}>
                <Calendar
                    size={18}
                    className="text-gray-400 cursor-pointer shrink-0"
                    onClick={() => setIsOpen(!isOpen)}
                />
                <input
                    type="text"
                    value={value || ''}
                    onChange={handleInputChange}
                    placeholder={placeholder || 'DD-MM-YYYY'}
                    className={`flex-1 bg-transparent border-none outline-none text-[14px] font-bold w-full ${isDarkMode ? 'text-white placeholder:text-gray-600' : 'text-gray-700 placeholder:text-gray-400'}`}
                />
                <ChevronDown
                    size={14}
                    className="text-gray-400 cursor-pointer ml-auto shrink-0"
                    onClick={() => setIsOpen(!isOpen)}
                />
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
    const { memberData, memberName, id, memberMobile, isLoading, refreshProfile } = context || {};

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        clientId: '',
        emergencyName: '',
        emergencyNumber: '',
        gender: 'Male',
        maritalStatus: 'Single',
        birthDate: '',
        anniversaryDate: '',
        address: '',
        commitmentDate: ''
    });

    useEffect(() => {
        if (memberData) {
            setFormData({
                name: `${memberData.firstName || ''} ${memberData.lastName || ''}`.trim(),
                mobile: memberData.mobile || '',
                email: memberData.email || '',
                clientId: memberData.memberId || id || '',
                emergencyName: memberData.emergencyContact?.name || '',
                emergencyNumber: memberData.emergencyContact?.number || '',
                gender: memberData.gender || 'Male',
                maritalStatus: memberData.maritalStatus || 'Single',
                birthDate: memberData.dob ? new Date(memberData.dob).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
                anniversaryDate: memberData.anniversaryDate ? new Date(memberData.anniversaryDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
                address: memberData.address || '',
                commitmentDate: memberData.commitmentDate ? new Date(memberData.commitmentDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''
            });
        }
    }, [memberData, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.mobile) {
            alert('Name and Mobile Number are required');
            return;
        }

        setIsSaving(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const nameParts = formData.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            // Handle Birth Date Parsing
            let dob = null;
            if (formData.birthDate) {
                const parts = formData.birthDate.split('-');
                dob = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }

            const payload = {
                firstName,
                lastName,
                mobile: formData.mobile,
                email: formData.email,
                gender: formData.gender,
                dob: dob,
                address: formData.address,
                emergencyContact: {
                    name: formData.emergencyName,
                    number: formData.emergencyNumber
                },
                commitmentDate: formData.commitmentDate ? new Date(formData.commitmentDate.split('-').reverse().join('-')) : null
            };

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowSuccess(true);
                refreshProfile(); // Trigger re-fetch in layout
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                const err = await res.json();
                alert(err.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Error updating member');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                <p className={`text-lg font-bold animate-pulse ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading Profile Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-sm shrink-0">
                    {memberData?.photo ? (
                        <img src={memberData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                    )}
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

                    {/* Financial Status Section */}
                    <div className="col-span-1 md:col-span-2 mt-4">
                        <div className={`p-6 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                            <h3 className={`text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <CreditCard size={18} className="text-[#f97316]" />
                                Financial Status & commitment
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Outstanding Due</label>
                                    <div className={`px-4 py-3 rounded-lg border font-black text-lg ${memberData?.dueAmount > 0 ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'}`}>
                                        ₹{memberData?.dueAmount || 0}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Commitment Date to Pay Due</label>
                                    <CustomDatePicker
                                        value={formData.commitmentDate}
                                        onChange={(date) => setFormData(p => ({ ...p, commitmentDate: date }))}
                                        placeholder="dd-mm-yyyy"
                                        isDarkMode={isDarkMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Submit Button */}
                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className={`px-10 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-3 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving Changes...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>

            {/* Success Notification */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-green-400/50 backdrop-blur-md">
                        <div className="bg-white/20 p-2 rounded-full">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="font-black text-[15px]">Profile Updated!</p>
                            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Member details saved successfully</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
