import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MoreVertical, ChevronDown, ArrowLeftRight, Snowflake, Edit3, X, Maximize2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2, Plus } from 'lucide-react';

const Calendar = ({ selectedDate, onSelect, isDarkMode }) => {
    const [viewDate, setViewDate] = useState(selectedDate || new Date());
    const [view, setView] = useState('days');

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrev = () => {
        if (view === 'days') setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
        else if (view === 'months') setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth()));
        else if (view === 'years') setViewDate(new Date(viewDate.getFullYear() - 10, viewDate.getMonth()));
    };

    const handleNext = () => {
        if (view === 'days') setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
        else if (view === 'months') setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth()));
        else if (view === 'years') setViewDate(new Date(viewDate.getFullYear() + 10, viewDate.getMonth()));
    };

    return (
        <div className={`p-4 w-72 rounded-xl border shadow-2xl animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => {
                        if (view === 'days') setView('months');
                        else if (view === 'months') setView('years');
                    }}
                    className={`text-sm font-bold hover:text-orange-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                    {view === 'days' && `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
                    {view === 'months' && viewDate.getFullYear()}
                    {view === 'years' && `${viewDate.getFullYear() - 5} - ${viewDate.getFullYear() + 4}`}
                </button>
                <div className="flex gap-1">
                    <button onClick={handlePrev} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400"><ChevronLeft size={16} /></button>
                    <button onClick={handleNext} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400"><ChevronRight size={16} /></button>
                </div>
            </div>

            {view === 'days' && (
                <div className="grid grid-cols-7 gap-1">
                    {days.map(d => <div key={d} className="text-[10px] font-bold text-gray-400 text-center py-2 uppercase">{d}</div>)}
                    {Array.from({ length: getFirstDayOfMonth(viewDate) }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: getDaysInMonth(viewDate) }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === viewDate.getMonth() && selectedDate?.getFullYear() === viewDate.getFullYear();
                        return (
                            <button
                                key={day}
                                onClick={() => onSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                                className={`text-[11px] font-bold h-8 w-8 rounded-lg transition-all flex items-center justify-center ${isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'}`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            )}

            {view === 'months' && (
                <div className="grid grid-cols-3 gap-2">
                    {months.map((m, i) => (
                        <button
                            key={m}
                            onClick={() => { setViewDate(new Date(viewDate.getFullYear(), i)); setView('days'); }}
                            className="text-[11px] font-bold py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-all"
                        >
                            {m}
                        </button>
                    ))}
                </div>
            )}

            {view === 'years' && (
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                        const year = viewDate.getFullYear() - 5 + i;
                        return (
                            <button
                                key={year}
                                onClick={() => { setViewDate(new Date(year, viewDate.getMonth())); setView('months'); }}
                                className="text-[11px] font-bold py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-all"
                            >
                                {year}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const EditMembershipModal = ({ isOpen, onClose, membership, isDarkMode }) => {
    const [startDate, setStartDate] = useState(new Date('2025-02-19'));
    const [showCalendar, setShowCalendar] = useState(false);
    const [trainer, setTrainer] = useState('');
    const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
    const calendarRef = useRef(null);
    const trainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) setShowCalendar(false);
            if (trainerRef.current && !trainerRef.current.contains(e.target)) setShowTrainerDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const trainers = ['Abdulla Pathan', 'ANJALI KANWAR', 'V10 FITNESS LAB'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                {/* Header */}
                <div className={`p-4 flex items-center justify-between rounded-t-xl ${isDarkMode ? 'bg-[#2a2a2a] border-b border-white/10' : 'bg-[#e5e5e5] border-b border-gray-300'}`}>
                    <div className="flex items-center gap-2">
                        <Edit3 size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
                        <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Membership</h3>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                        <button className="hover:text-gray-900"><Maximize2 size={18} /></button>
                        <button onClick={onClose} className="hover:text-gray-900"><X size={20} /></button>
                    </div>
                </div>

                <div className="p-8 space-y-8 pb-32">
                    <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Personal Info</h4>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-bold text-gray-500">Membership Name</p>
                            <p className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>GYM WORKOUT</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-bold text-gray-500">Duration</p>
                            <p className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>12 Months</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-bold text-gray-500">Sessions</p>
                            <p className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>360/360</p>
                        </div>
                        <div className="space-y-1.5 relative">
                            <p className="text-[13px] font-bold text-gray-500">Start Date</p>
                            <div className="relative" ref={calendarRef}>
                                <div
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon size={16} className="text-gray-400" />
                                        <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{startDate.toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
                                    </div>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>
                                {showCalendar && (
                                    <div className="absolute left-0 top-full mt-1 z-[110]">
                                        <Calendar
                                            selectedDate={startDate}
                                            onSelect={(date) => { setStartDate(date); setShowCalendar(false); }}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-bold text-gray-500">End Date</p>
                            <p className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>18 Feb, 2026</p>
                        </div>
                        <div className="space-y-1.5 relative">
                            <p className="text-[13px] font-bold text-gray-500">Trainer</p>
                            <div className="relative" ref={trainerRef}>
                                <div
                                    onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
                                    className={`flex items-center justify-between px-4 py-2 rounded-lg border cursor-pointer transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-orange-500 text-orange-500'}`}
                                >
                                    <span className="text-sm font-bold">{trainer || 'Select Trainer'}</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>
                                {showTrainerDropdown && (
                                    <div className={`absolute left-0 top-full mt-1 w-full rounded-xl shadow-xl border z-[110] py-1 bg-white dark:bg-[#1e1e1e] ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                        {trainers.map(t => (
                                            <div
                                                key={t}
                                                onClick={() => { setTrainer(t); setShowTrainerDropdown(false); }}
                                                className={`px-4 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                            >
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex items-center justify-end rounded-b-xl border-t dark:border-white/10 border-gray-100">
                    <button onClick={onClose} className="px-10 py-2.5 bg-[#f97316] text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteMembershipModal = ({ isOpen, onClose, isDarkMode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className="p-4 py-3 border-b dark:border-white/10 border-gray-100 flex items-center justify-between">
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delete Membership</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Remark*</label>
                        <textarea
                            placeholder="Remark..."
                            className={`w-full px-4 py-3 rounded-lg border text-sm h-32 resize-none outline-none ${isDarkMode ? 'bg-transparent border-white/10 text-white' : 'bg-white border-gray-200 focus:border-orange-500'}`}
                        />
                    </div>
                </div>
                <div className="p-6 flex items-center justify-end gap-3 pt-2">
                    <button onClick={onClose} className={`px-6 py-2.5 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Cancel</button>
                    <button onClick={onClose} className="px-6 py-2.5 bg-[#f97316] text-white text-sm font-bold rounded-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Submit</button>
                </div>
            </div>
        </div>
    );
};

const AddOnDaysModal = ({ isOpen, onClose, isDarkMode }) => {
    const [unit, setUnit] = useState('Days');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className="p-4 py-3 border-b dark:border-white/10 border-gray-100 flex items-center justify-between">
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}></h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-1.5">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Add on Days*</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white' : 'bg-white border-gray-300 focus:border-orange-500'}`}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Remark</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white' : 'bg-white border-gray-300 focus:border-orange-500'}`}
                        />
                    </div>
                    <div className="flex items-center gap-8">
                        {['Days', 'Months'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${unit === opt ? 'border-orange-500' : 'border-gray-400'}`}>
                                    {unit === opt && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                </div>
                                <input type="radio" className="hidden" name="addon-unit" checked={unit === opt} onChange={() => setUnit(opt)} />
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{opt}</span>
                            </label>
                        ))}
                    </div>
                    <p className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Add on By: <span className={isDarkMode ? 'text-gray-200' : 'text-black'}>Abdulla Pathan</span>
                    </p>
                </div>
                <div className="p-6 flex items-center justify-end gap-3 pt-2">
                    <button onClick={onClose} className={`px-10 py-2.5 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Cancel</button>
                    <button onClick={onClose} className="px-10 py-2.5 bg-[#f97316] text-white text-sm font-bold rounded-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Submit</button>
                </div>
            </div>
        </div>
    );
};

const MemberMemberships = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const {
        memberId,
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo
    } = context || {};

    const [activeTab, setActiveTab] = useState('Active Membership');
    const [activeMenu, setActiveMenu] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddOnModal, setShowAddOnModal] = useState(false);

    const menuRef = useRef(null);

    const tabs = [
        { name: 'Active Membership' },
        { name: 'Past Membership' },
        { name: 'Upcoming Membership' },
        { name: 'Transferred', icon: ArrowLeftRight },
        { name: 'Freeze', icon: Snowflake }
    ];

    // Dummy Data
    const memberships = [
        {
            id: '781552',
            name: 'GYM WORKOUT',
            duration: '12 Months',
            sessions: '360/360',
            startDate: '19 Feb, 2025',
            endDate: '18 Feb, 2026',
            addOnDays: '0',
            addOnRemark: '',
            trainer: 'Abdulla Pathan',
        }
    ];

    // Menu Options
    const menuOptions = [
        'Edit Membership',
        'Delete Membership',
        'Transfer',
        'Freeze',
        'Upgrade',
        'Renew',
        'Resale',
        'Add-On Days',
        'Print ID Card'
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleActionClick = (opt, item) => {
        setActiveMenu(null);
        if (opt === 'Edit Membership') {
            setShowEditModal(true);
        } else if (opt === 'Delete Membership') {
            setShowDeleteModal(true);
        } else if (opt === 'Transfer') {
            navigate('/admin/members/profile/membership/transfer');
        } else if (opt === 'Add-On Days') {
            setShowAddOnModal(true);
        } else if (opt === 'Resale') {
            navigate('/admin/members/profile/membership/resale');
        } else if (opt === 'Upgrade') {
            navigate('/admin/members/profile/membership/upgrade');
        } else if (opt === 'Freeze') {
            navigate('/admin/members/profile/membership/freeze');
        } else if (opt === 'Renew') {
            navigate('/admin/members/profile/membership/renew');
        }
    }

    const renderTable = (data, type) => {
        let headers = [];
        if (type === 'Transferred') {
            headers = ['Membership ID', 'Name', 'Duration', 'Sessions', 'Start Date', 'End Date', 'Assigned Trainer', 'User Name'];
        } else if (type === 'Freeze') {
            headers = ['Membership ID', 'Name', 'Duration', 'Sessions', 'Freeze Start Date', 'Freeze End Date', 'Freeze Frequency', 'Freeze Remark'];
        } else {
            headers = ['Membership ID', 'Name', 'Duration', 'Sessions', 'Start Date', 'End Date', 'Add On Days', 'Add On Days Remark', 'Assigned Trainer', 'Status', ''];
        }

        return (
            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className={`text-xs font-bold border-b ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
                            {headers.map((h, i) => (
                                <th key={i} className={`px-6 py-4 whitespace-nowrap ${h === '' ? 'w-10' : ''}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {data.length > 0 ? data.map((item, idx) => (
                            <tr key={idx} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'}`}>
                                {type === 'Transferred' ? (
                                    <>
                                        <td className="px-6 py-5">{item.id}</td>
                                        <td className="px-6 py-5">{item.name}</td>
                                        <td className="px-6 py-5">{item.duration}</td>
                                        <td className="px-6 py-5">{item.sessions}</td>
                                        <td className="px-6 py-5">{item.startDate}</td>
                                        <td className="px-6 py-5">{item.endDate}</td>
                                        <td className="px-6 py-5 text-blue-500">{item.trainer}</td>
                                        <td className="px-6 py-5">{item.userName || '--'}</td>
                                    </>
                                ) : type === 'Freeze' ? (
                                    <>
                                        <td className="px-6 py-5">{item.id}</td>
                                        <td className="px-6 py-5">{item.name}</td>
                                        <td className="px-6 py-5">{item.duration}</td>
                                        <td className="px-6 py-5">{item.sessions}</td>
                                        <td className="px-6 py-5">{item.freezeStart || '--'}</td>
                                        <td className="px-6 py-5">{item.freezeEnd || '--'}</td>
                                        <td className="px-6 py-5">{item.freezeFreq || '--'}</td>
                                        <td className="px-6 py-5">{item.freezeRemark || '--'}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-5">{item.id}</td>
                                        <td className="px-6 py-5">{item.name}</td>
                                        <td className="px-6 py-5">{item.duration}</td>
                                        <td className="px-6 py-5 text-gray-500">{item.sessions}</td>
                                        <td className="px-6 py-5">{item.startDate}</td>
                                        <td className="px-6 py-5">{item.endDate}</td>
                                        <td className="px-6 py-5">{item.addOnDays}</td>
                                        <td className="px-6 py-5">{item.addOnRemark}</td>
                                        <td className="px-6 py-5 text-blue-500">{item.trainer}</td>
                                        <td className="px-6 py-5"></td>
                                        <td className="px-6 py-5 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(activeMenu === idx ? null : idx);
                                                }}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <MoreVertical size={16} className="text-gray-500" />
                                            </button>

                                            {activeMenu === idx && (
                                                <div ref={menuRef} className={`absolute right-10 top-0 w-48 rounded-md shadow-xl border z-50 py-1 max-h-[250px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                                                    {menuOptions.map((opt, i) => (
                                                        <div
                                                            key={i}
                                                            className={`px-4 py-2.5 text-sm font-medium cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'
                                                                } ${i !== menuOptions.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                                                            onClick={() => handleActionClick(opt, item)}
                                                        >
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-400 font-normal italic">No Records Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Memberships</h2>

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

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-6 border-b dark:border-white/10 border-gray-200">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`pb-3 text-sm font-bold transition-colors relative flex items-center gap-2 ${activeTab === tab.name
                                ? 'text-orange-500'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            {Icon && <Icon size={16} />}
                            {tab.name}
                            {activeTab === tab.name && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Table Content */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="p-4 bg-white dark:bg-white/5 border-b dark:border-white/10 border-gray-100">
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {activeTab === 'Transferred' ? 'Active Membership' : activeTab === 'Freeze' ? 'Freeze Membership' : activeTab}
                    </h3>
                </div>

                {activeTab === 'Active Membership' && renderTable(memberships)}
                {activeTab === 'Past Membership' && renderTable([])}
                {activeTab === 'Upcoming Membership' && renderTable([])}
                {activeTab === 'Transferred' && renderTable([], 'Transferred')}
                {activeTab === 'Freeze' && renderTable([], 'Freeze')}
            </div>

            <EditMembershipModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                isDarkMode={isDarkMode}
            />

            <DeleteMembershipModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                isDarkMode={isDarkMode}
            />

            <AddOnDaysModal
                isOpen={showAddOnModal}
                onClose={() => setShowAddOnModal(false)}
                isDarkMode={isDarkMode}
            />

        </div>
    );
};

export default MemberMemberships;
