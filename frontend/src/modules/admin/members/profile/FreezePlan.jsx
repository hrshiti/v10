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
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                    <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-orange-500 text-sm font-bold">Members Profile</span>
                </div>
            </div>

            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Freeze Plan</h2>

            <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InputField label="Client ID" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} readonly />
                    <InputField label="Mobile Number" value={form.mobile} required onChange={(e) => setForm({ ...form, mobile: e.target.value })} readonly />
                    <InputField label="Email Address" placeholder="Ex : abc@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} readonly />
                    <div className="hidden md:block" />

                    <InputField label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                    <InputField label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />

                    <div className="space-y-1.5 flex-1">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Freeze Remark</label>
                        <textarea
                            placeholder="Freeze Remark"
                            value={form.freezeRemark}
                            onChange={(e) => setForm({ ...form, freezeRemark: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all h-24 resize-none ${isDarkMode
                                ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50'
                                : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500'
                                }`}
                        />
                    </div>
                    <div className="space-y-1.5 flex-1">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Freeze Frequency</label>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{form.freezeFrequency}</p>
                    </div>

                    <div className="space-y-1.5 flex-1 col-span-full">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Membership End Date</label>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{form.membershipEndDate}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        {['Online', 'Wallet', 'Cheque', 'Cash', 'Other'].map(method => (
                            <label key={method} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.paymentMethod === method ? 'border-orange-500' : 'border-gray-400'}`}>
                                    {form.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                </div>
                                <input type="radio" className="hidden" name="payment" checked={form.paymentMethod === method} onChange={() => setForm({ ...form, paymentMethod: method })} />
                                <span className={`text-sm font-bold ${form.paymentMethod === method ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>{method}</span>
                            </label>
                        ))}
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Comment</label>
                        <textarea
                            placeholder="Comment"
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm h-32 resize-none outline-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50' : 'bg-white border-gray-200 focus:border-orange-500'}`}
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    {[
                        { label: 'Freeze Charge', field: 'freezeCharge' },
                        { label: 'Subtotal', field: 'subtotal' },
                        { label: 'Surcharges', field: 'surcharges' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{row.label}</span>
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                    <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                    <input
                                        type="number"
                                        value={form[row.field]}
                                        onChange={(e) => setForm({ ...form, [row.field]: e.target.value })}
                                        className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                    />
                                </div>
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>{row.label === 'Surcharges' ? '%' : '₹'}</div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Payable Amount</span>
                        <span className="text-lg font-black">₹{payableAmount}</span>
                    </div>

                    {/* Tax Section - Matching Image 1 */}
                    <div className={`border rounded-xl p-5 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b dark:border-white/10 border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.applyTaxes}
                                    onChange={(e) => setForm({ ...form, applyTaxes: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                                <span className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Apply Taxes*</span>
                            </label>

                            <div className="relative" ref={taxDropdownRef}>
                                <button
                                    onClick={() => setShowTaxDropdown(!showTaxDropdown)}
                                    className={`flex items-center justify-between px-4 py-2 border rounded-lg w-32 bg-white dark:bg-[#1a1a1a] transition-all font-bold text-sm ${form.taxPercentage > 0 ? 'border-orange-500 text-orange-500' : 'border-gray-200 text-gray-400'}`}
                                >
                                    <span>{form.taxPercentage ? `${form.taxPercentage}%` : 'Select Tax'}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${showTaxDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showTaxDropdown && (
                                    <div className={`absolute left-0 top-full mt-1 w-32 rounded-xl shadow-xl border z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                        {[5, 12, 18].map(val => (
                                            <div
                                                key={val}
                                                onClick={() => { setForm({ ...form, taxPercentage: val }); setShowTaxDropdown(false); }}
                                                className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {val}%
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>CGST ({form.applyTaxes ? taxes.cgstPerc : '0'}%)</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{form.applyTaxes ? taxes.cgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>SGST ({form.applyTaxes ? taxes.sgstPerc : '0'}%)</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{form.applyTaxes ? taxes.sgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-black pt-5 mt-4 border-t border-dashed dark:border-white/10 border-gray-200">
                                <span className="text-gray-400">Total Taxes (₹)</span>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>₹{form.applyTaxes ? taxes.total : '0.00'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Section - Now inside the form flow */}
            <div className={`mt-10 p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">I want to make payment and generate invoice</p>
                <button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase text-[15px] py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 tracking-wider disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : `₹${payableAmount} Submit`}
                </button>
            </div>
        </div>
    );
};

export default FreezePlan;
