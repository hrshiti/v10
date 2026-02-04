import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MoreVertical, Maximize2, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, Edit3 } from 'lucide-react';

import { API_BASE_URL } from '../../../../config/api';

const Calendar = ({ selectedDate, onSelect, isDarkMode }) => {
    // Calendar component remains same
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
                    <button onClick={handlePrev} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"><ChevronLeft size={16} /></button>
                    <button onClick={handleNext} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"><ChevronRight size={16} /></button>
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

const EditInvoiceModal = ({ isOpen, onClose, invoice, isDarkMode }) => {
    // Modal component remains same
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) setShowCalendar(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className={`p-4 flex items-center justify-between rounded-t-xl ${isDarkMode ? 'bg-[#2a2a2a] border-b border-white/10' : 'bg-[#e5e5e5] border-b border-gray-300'}`}>
                    <div className="flex items-center gap-2">
                        <Edit3 size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
                        <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Invoice</h3>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                        <button className="hover:text-gray-900"><Maximize2 size={18} /></button>
                        <button onClick={onClose} className="hover:text-gray-900"><X size={20} /></button>
                    </div>
                </div>

                <div className="p-6 space-y-4 pb-64">
                    <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                        <span className={`text-[14px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Invoice No:</span>
                        <span className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{invoice?.invoiceNumber}</span>
                    </div>
                    <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                        <span className={`text-[14px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Membership ID:</span>
                        <span className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{invoice?.memberId?.memberId || '-'}</span>
                    </div>

                    <div className="space-y-2 relative">
                        <label className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>End Date*</label>
                        <div className="relative" ref={calendarRef}>
                            <div
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-orange-500' : 'bg-white border-gray-300 hover:border-orange-500'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <CalendarIcon size={18} className="text-gray-400" />
                                    <span className={`text-[14px] ${selectedDate ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}>
                                        {selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : 'dd-mm-yyyy'}
                                    </span>
                                </div>
                                <ChevronDown size={18} className="text-gray-400" />
                            </div>
                            {showCalendar && (
                                <div className="absolute left-0 top-full mt-2 z-[999]">
                                    <Calendar
                                        selectedDate={selectedDate}
                                        onSelect={(date) => { setSelectedDate(date); setShowCalendar(false); }}
                                        isDarkMode={isDarkMode}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`p-4 border-t flex items-center justify-end rounded-b-xl ${isDarkMode ? 'bg-[#2a2a2a] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <button className="bg-[#f97316] hover:bg-orange-600 active:scale-95 text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-orange-500/30 transition-all">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

const MemberPaymentHistory = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const {
        id,
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo,
        dueAmount
    } = context || {};

    const [activeActionRow, setActiveActionRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const actionRef = useRef({});

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token || !id) return;

                const response = await fetch(`${API_BASE_URL}/api/admin/sales/member/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                }
            } catch (error) {
                console.error('Error fetching payment history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeActionRow !== null) {
                if (actionRef.current[activeActionRow] && !actionRef.current[activeActionRow].contains(event.target)) {
                    setActiveActionRow(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeActionRow]);

    const handleViewInvoice = (invoiceId) => {
        navigate(`/admin/business/payments/invoice-detail?id=${invoiceId}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Payment History</h2>

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

            {/* Payments Table */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="p-4 bg-white dark:bg-white/5 border-b dark:border-white/10 border-gray-100">
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Payments History</h3>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`text-xs font-bold border-b ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
                                <th className="px-6 py-4 whitespace-nowrap">Invoice No</th>
                                <th className="px-6 py-4 whitespace-nowrap">Invoice Date</th>
                                <th className="px-6 py-4 whitespace-nowrap">Sub Total</th>
                                <th className="px-6 py-4 whitespace-nowrap">Discount</th>
                                <th className="px-6 py-4 whitespace-nowrap">Tax</th>
                                <th className="px-6 py-4 whitespace-nowrap">Net Amount</th>
                                <th className="px-6 py-4 whitespace-nowrap text-emerald-500">Paid</th>
                                <th className="px-6 py-4 whitespace-nowrap text-red-500">Balance</th>
                                <th className="px-6 py-4 whitespace-nowrap">Plan Type</th>
                                <th className="px-6 py-4 whitespace-nowrap text-center">status</th>
                                <th className="px-6 py-4 whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="11" className="px-6 py-10 text-center text-gray-400">Loading payment history...</td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="px-6 py-10 text-center text-gray-400">No payment records found</td>
                                </tr>
                            ) : payments.map((item, idx) => {
                                const netAmount = (item.subTotal || 0) + (item.taxAmount || 0) - (item.discountAmount || 0);
                                const balance = Math.max(0, netAmount - (item.amount || 0));
                                return (
                                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'} `}>
                                        <td className="px-6 py-5">{item.invoiceNumber}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">₹{(item.subTotal || 0).toFixed(2)}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">₹{(item.discountAmount || 0).toFixed(2)}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">₹{(item.taxAmount || 0).toFixed(2)}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">₹{netAmount.toFixed(2)}</td>
                                        <td className="px-6 py-5 whitespace-nowrap text-emerald-500">₹{(item.amount || 0).toFixed(2)}</td>
                                        <td className="px-6 py-5 text-red-500">₹{balance.toFixed(2)}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">{item.type}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-wider ${balance === 0 ? (isDarkMode ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30' : 'bg-[#22c55e] text-white shadow-sm') : (isDarkMode ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30' : 'bg-[#ef4444] text-white shadow-sm')}`}>
                                                {balance === 0 ? 'PAID' : 'DUE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right relative" ref={el => actionRef.current[idx] = el}>
                                            <button
                                                onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <MoreVertical size={16} className="text-gray-500" />
                                            </button>

                                            {activeActionRow === idx && (
                                                <div className={`absolute right-12 top-2 w-[140px] rounded-lg shadow-xl border z-50 overflow-hidden text-left animate-in fade-in slide-in-from-right-2 duration-150 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                                                    <div className="py-1">
                                                        <div
                                                            onClick={() => {
                                                                setActiveActionRow(null);
                                                                handleViewInvoice(item.invoiceNumber);
                                                            }}
                                                            className={`px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                                        >
                                                            View Invoice
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditInvoiceModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                invoice={selectedInvoice}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default MemberPaymentHistory;
