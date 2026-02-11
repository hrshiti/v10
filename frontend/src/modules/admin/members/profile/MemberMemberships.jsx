import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { MoreVertical, ChevronDown, ArrowLeftRight, Snowflake, Edit3, X, Maximize2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

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

const EditMembershipModal = ({ isOpen, onClose, membership, isDarkMode, onSuccess }) => {
    const [startDate, setStartDate] = useState(membership ? new Date(membership.startDate) : new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) setShowCalendar(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen || !membership) return null;

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const res = await fetch(`${API_BASE_URL}/api/admin/members/${membership.memberId}/change-start-date`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newStartDate: startDate })
            });
            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error changing start date:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <button onClick={onClose} className="hover:text-gray-900 text-gray-500"><X size={20} /></button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-bold text-gray-400">Package Name</p>
                            <p className={`text-[14px] font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{membership.packageName}</p>
                        </div>
                        <div className="space-y-1.5 relative">
                            <p className="text-[13px] font-bold text-gray-400">Start Date</p>
                            <div className="relative" ref={calendarRef}>
                                <div
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300'}`}
                                >
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <CalendarIcon size={16} className="text-gray-400" />
                                        <span>{startDate.toLocaleDateString('en-GB')}</span>
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
                    </div>
                </div>

                <div className="p-4 flex items-center justify-end rounded-b-xl border-t dark:border-white/10 border-gray-200">
                    <button
                        disabled={isSubmitting}
                        onClick={handleUpdate}
                        className="px-10 py-2.5 bg-[#f97316] text-white font-black rounded-lg shadow-lg active:scale-95"
                    >
                        {isSubmitting ? 'Updating...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddOnDaysModal = ({ isOpen, onClose, membership, isDarkMode, onSuccess }) => {
    const [days, setDays] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !membership) return null;

    const handleSubmit = async () => {
        if (!days) return;
        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const res = await fetch(`${API_BASE_URL}/api/admin/members/${membership.memberId}/extend`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ days: parseInt(days) })
            });
            if (res.ok) {
                onSuccess();
                onClose();
                setDays('');
            }
        } catch (error) {
            console.error('Error adding days:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className="p-4 py-3 border-b dark:border-white/10 border-gray-100 flex items-center justify-between">
                    <h3 className={`text-base font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Extend Membership</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-1.5">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Add on Days*</label>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            placeholder="e.g. 7"
                            className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                </div>
                <div className="p-6 flex items-center justify-end gap-3 border-t dark:border-white/10 border-gray-100">
                    <button onClick={onClose} className={`px-10 py-2.5 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Cancel</button>
                    <button
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="px-10 py-2.5 bg-[#f97316] text-white text-sm font-bold rounded-lg active:scale-95"
                    >
                        {isSubmitting ? 'Updating...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PayDueModal = ({ isOpen, onClose, membership, isDarkMode, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [commitmentDate, setCommitmentDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (membership && isOpen) {
            setAmount(membership.dueAmount || '');
        }
    }, [membership, isOpen]);

    if (!isOpen || !membership) return null;

    const remainingAfterPay = (membership.dueAmount - Number(amount)) > 0;

    const handleSubmit = async () => {
        if (!amount || amount <= 0) return;
        if (remainingAfterPay && !commitmentDate) {
            alert('Please select a new commitment date for the remaining balance');
            return;
        }

        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const res = await fetch(`${API_BASE_URL}/api/admin/members/subscriptions/${membership._id}/pay-due`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    paymentMode,
                    closedBy: adminInfo?._id,
                    commitmentDate: remainingAfterPay ? commitmentDate : null
                })
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await res.json();
                alert(err.message || 'Failed to record payment');
            }
        } catch (error) {
            console.error('Error paying due:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className="p-4 py-3 border-b dark:border-white/10 border-gray-100 flex items-center justify-between">
                    <h3 className={`text-base font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pay Due Balance</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 mb-4">
                        <div>
                            <p className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Current Due</p>
                            <p className="text-xl font-black text-orange-600">₹{membership.dueAmount}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Package</p>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{membership.packageName}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Amount to Pay*</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    max={membership.dueAmount}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white focus:border-orange-500/50' : 'bg-white border-gray-300 focus:border-orange-500'}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Payment Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Cash', 'UPI / Online', 'Debit / Credit Card', 'Cheque'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setPaymentMode(mode)}
                                        className={`py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-all ${paymentMode === mode
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300')
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {remainingAfterPay && (
                            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>New Commitment Date*</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={commitmentDate}
                                        onChange={(e) => setCommitmentDate(e.target.value)}
                                        onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                        className={`w-full px-4 py-3 rounded-lg border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white focus:border-orange-500/50' : 'bg-white border-gray-300 focus:border-orange-500'}`}
                                    />
                                </div>
                                <p className="text-[10px] text-orange-500 font-bold uppercase">Balance Remaining: ₹{(membership.dueAmount - Number(amount)).toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 flex items-center justify-end gap-3 border-t dark:border-white/10 border-gray-100">
                    <button onClick={onClose} className={`px-8 py-2.5 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Cancel</button>
                    <button
                        disabled={isSubmitting || !amount || amount <= 0}
                        onClick={handleSubmit}
                        className="px-8 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : 'Record Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MemberMemberships = () => {
    const { isDarkMode, memberData, refreshProfile } = useOutletContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const [activeTab, setActiveTab] = useState('Active Membership');
    const [activeMenu, setActiveMenu] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddOnModal, setShowAddOnModal] = useState(false);
    const [showPayDueModal, setShowPayDueModal] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const menuRef = useRef(null);

    const tabs = [
        { name: 'Active Membership' },
        { name: 'Upcoming Membership' },
        { name: 'Past Membership' },
    ];

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}/subscriptions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSubscriptions(data);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSubscriptions = subscriptions.filter(s => {
        if (activeTab === 'Active Membership') return s.status === 'Active';
        if (activeTab === 'Upcoming Membership') return s.status === 'Upcoming';
        if (activeTab === 'Past Membership') return s.status !== 'Active' && s.status !== 'Upcoming';
        return false;
    });

    const handleActionClick = (opt, item) => {
        setActiveMenu(null);
        setSelectedMembership(item);
        if (opt === 'Add-On Days') setShowAddOnModal(true);
        if (opt === 'Change Start Date') setShowEditModal(true);
        if (opt === 'Pay Due') setShowPayDueModal(true);
        if (opt === 'Renew') navigate(`/admin/members/profile/${id}/membership/renew`);

        if (opt === 'Freeze') navigate(`/admin/members/profile/${id}/membership/freeze`);
        if (opt === 'Upgrade') navigate(`/admin/members/profile/${id}/membership/upgrade`);
        if (opt === 'Resale') navigate(`/admin/members/profile/${id}/membership/resale`);
    };

    const renderTable = (data) => {
        const headers = ['Package Name', 'Duration', 'Trainer', 'Start Date', 'End Date', 'Paid Amount', 'Due', 'Status', 'Action'];

        return (
            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className={`text-[11px] font-black uppercase border-b ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                            {headers.map((h, i) => (
                                <th key={i} className="px-6 py-5 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {data.length > 0 ? data.map((item, idx) => (
                            <tr key={item._id} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'}`}>
                                <td className="px-6 py-6 uppercase">{item.packageName}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    {(item.duration || item.packageId?.durationValue || '-')} {(item.durationType || item.packageId?.durationType || 'Months')}
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap text-gray-400">
                                    {item.assignedTrainer ? `${item.assignedTrainer.firstName} ${item.assignedTrainer.lastName}` : '-'}
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">{new Date(item.startDate).toLocaleDateString('en-GB')}</td>
                                <td className="px-6 py-6 whitespace-nowrap">{new Date(item.endDate).toLocaleDateString('en-GB')}</td>
                                <td className="px-6 py-6 whitespace-nowrap">₹{Number(item.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-6 text-red-500 whitespace-nowrap">₹{Number(item.dueAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-6">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                                        item.status === 'Expired' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-right relative">
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
                                        <div ref={menuRef} className={`absolute right-10 top-0 w-48 rounded-md shadow-xl border z-50 py-1 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                                            {['Renew', 'Pay Due', 'Add-On Days', 'Change Start Date', 'Freeze', 'Upgrade'].map((opt, i) => (
                                                <div
                                                    key={i}
                                                    className={`px-4 py-3 text-[13px] font-bold cursor-pointer transition-all ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'} ${opt === 'Pay Due' && item.dueAmount <= 0 ? 'hidden' : ''}`}
                                                    onClick={() => handleActionClick(opt, item)}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-500 font-bold uppercase tracking-widest text-[11px]">No {activeTab.toLowerCase()} found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    if (isLoading && subscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold animate-pulse">Syncing Subscriptions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-between items-center">
                <h2 className={`text-[22px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Membership History</h2>
                <button
                    onClick={() => navigate(`/admin/members/profile/${id}/membership/renew`)}
                    className="bg-[#f97316] text-white px-8 py-3 rounded-xl text-[13px] font-black shadow-lg shadow-orange-500/20 active:scale-95 hover:bg-orange-600 transition-all uppercase tracking-wider"
                >
                    New Subscription
                </button>
            </div>

            {/* Premium Stats Grid */}
            <div className={`rounded-2xl border overflow-hidden grid grid-cols-1 md:grid-cols-3 ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className={`p-8 flex flex-col gap-3 ${isDarkMode ? 'border-r border-white/5' : 'border-r border-gray-100'}`}>
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-[2px]">Total Subscriptions</span>
                    <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{subscriptions.length}</span>
                </div>
                <div className={`p-8 flex flex-col gap-3 ${isDarkMode ? 'border-r border-white/5' : 'border-r border-gray-100'}`}>
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-[2px]">Active Since</span>
                    <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {subscriptions.length > 0
                            ? new Date(subscriptions[subscriptions.length - 1].startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                            : '--'}
                    </span>
                </div>
                <div className="p-8 flex flex-col gap-3">
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-[2px]">Investment</span>
                    <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-gray-400 mb-1">₹</span>
                        <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {subscriptions.reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs & Table Container */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                {/* Modern Tabs */}
                <div className="flex items-center gap-10 px-8 pt-6 border-b dark:border-white/5 border-gray-50">
                    {tabs.map(tab => {
                        const count = subscriptions.filter(s => {
                            if (tab.name === 'Active Membership') return s.status === 'Active';
                            if (tab.name === 'Upcoming Membership') return s.status === 'Upcoming';
                            if (tab.name === 'Past Membership') return s.status !== 'Active' && s.status !== 'Upcoming';
                            return false;
                        }).length;

                        return (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`pb-5 text-[12px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.name
                                    ? 'text-orange-500'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.name} ({count})
                                {activeTab === tab.name && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full shadow-[0_-4px_10px_rgba(249,115,22,0.4)]"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Enhanced Table */}
                <div className="p-2">
                    {renderTable(filteredSubscriptions)}
                </div>
            </div>

            <EditMembershipModal
                isOpen={showEditModal}
                membership={selectedMembership}
                onClose={() => setShowEditModal(false)}
                isDarkMode={isDarkMode}
                onSuccess={fetchSubscriptions}
            />

            <AddOnDaysModal
                isOpen={showAddOnModal}
                membership={selectedMembership}
                onClose={() => setShowAddOnModal(false)}
                isDarkMode={isDarkMode}
                onSuccess={fetchSubscriptions}
            />

            <PayDueModal
                isOpen={showPayDueModal}
                membership={selectedMembership}
                onClose={() => setShowPayDueModal(false)}
                isDarkMode={isDarkMode}
                onSuccess={() => {
                    fetchSubscriptions();
                    if (refreshProfile) refreshProfile();
                }}
            />
        </div>
    );

};

export default MemberMemberships;
