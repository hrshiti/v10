import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowLeft, Check } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const FreezePlan = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { id, memberName, memberId: mId, memberMobile, memberEmail, endDate: mEndDate } = context || {};

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        clientId: mId || '',
        mobile: memberMobile || '',
        email: (memberEmail !== '-' && memberEmail) ? memberEmail : '',
        startDate: '',
        endDate: '',
        freezeRemark: '',
        freezeFrequency: '0/1',
        membershipEndDate: mEndDate ? new Date(mEndDate).toLocaleDateString('en-GB') : '-',
        paymentMethod: 'Online',
        comment: '',
        freezeCharge: 0,
        subtotal: 0,
        surcharges: 0,
        applyTaxes: false,
        taxPercentage: 0,
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const taxDropdownRef = useRef(null);

    useEffect(() => {
        const fetchCurrentSub = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token || !id) return;

                const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}/subscriptions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const subs = await res.json();
                    const current = subs.find(s => s.isCurrent);
                    if (current) {
                        setForm(prev => ({
                            ...prev,
                            membershipEndDate: new Date(current.endDate).toLocaleDateString('en-GB'),
                            freezeFrequency: `${current.freezeHistory?.length || 0}/1`
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching subscription:', error);
            }
        };
        fetchCurrentSub();
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        if (!form.startDate || !form.endDate) {
            alert('Please select start and end dates for freezing');
            return;
        }

        setIsLoading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const payload = {
                startDate: form.startDate,
                endDate: form.endDate,
                freezeCharge: form.freezeCharge,
                subTotal: (parseFloat(form.freezeCharge || 0) + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0)),
                taxAmount: form.applyTaxes ? taxes.total : 0,
                paymentMethod: form.paymentMethod,
                comment: form.freezeRemark || form.comment,
                closedBy: adminInfo?._id
            };

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}/freeze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Membership frozen successfully');
                navigate(-1);
            } else {
                const data = await res.json();
                alert(data.message || 'Error freezing membership');
            }
        } catch (error) {
            console.error('Error freezing membership:', error);
            alert('Failed to freeze membership');
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = ({ label, value, placeholder, type = "text", required = false, onChange, readonly = false }) => (
        <div className="space-y-1.5 flex-1 min-w-[300px]">
            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    readOnly={readonly}
                    onChange={onChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                        ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                        } ${readonly ? 'opacity-70 cursor-not-allowed bg-gray-50' : ''}`}
                />
                {(type === 'date' || label.includes('Date')) && <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />}
            </div>
        </div>
    );

    const calculateTaxes = () => {
        const base = parseFloat(form.freezeCharge || 0) + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0);
        const taxAmount = (base * form.taxPercentage) / 100;
        const cgst = taxAmount / 2;
        const sgst = taxAmount / 2;
        return {
            cgst: cgst.toFixed(2),
            sgst: sgst.toFixed(2),
            total: taxAmount.toFixed(2),
            cgstPerc: (form.taxPercentage / 2).toFixed(1),
            sgstPerc: (form.taxPercentage / 2).toFixed(1)
        };
    };

    const taxes = calculateTaxes();
    const payableAmount = (parseFloat(form.freezeCharge || 0) + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0) + (form.applyTaxes ? parseFloat(taxes.total) : 0)).toFixed(2);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                    </button>
                    <div>
                        <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-tight`}>Freeze Membership</h2>
                        <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">{memberName} • {mId}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Date Selection */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-sm'} space-y-6`}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Freeze Start Date</label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500'}`}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Freeze End Date</label>
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500'}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Freeze Remark</label>
                        <textarea
                            placeholder="Reason for freezing..."
                            value={form.freezeRemark}
                            onChange={(e) => setForm({ ...form, freezeRemark: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border text-sm font-bold h-32 resize-none outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500'}`}
                        />
                    </div>
                </div>

                {/* Right: Summary & Action */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-lg'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Membership End Date</span>
                            <span className="text-sm font-black text-orange-500">{form.membershipEndDate}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-500">Freeze Charge</span>
                                <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                    <span className="px-2 text-xs text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        value={form.freezeCharge}
                                        onChange={(e) => setForm({ ...form, freezeCharge: e.target.value })}
                                        className="w-20 px-2 py-1.5 bg-transparent outline-none text-sm font-bold text-right"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t dark:border-white/10 border-gray-100 flex flex-col items-center gap-2">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Payable Amount</p>
                                <p className="text-4xl font-black text-orange-500">₹{payableAmount}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {['Online', 'Cash'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setForm({ ...form, paymentMethod: method })}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase border tracking-wider transition-all ${form.paymentMethod === method
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                                            : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600')
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={isLoading || !form.startDate || !form.endDate}
                                onClick={handleSubmit}
                                className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-600/20 transition-all active:scale-95 text-[13px] uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Confirm Freeze'}
                            </button>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Freeze Frequency</span>
                        <span className="text-xs font-black text-gray-900 dark:text-white px-2 py-1 rounded bg-orange-500/10 text-orange-500">{form.freezeFrequency}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreezePlan;
