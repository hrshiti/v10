import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, ArrowLeft } from 'lucide-react';

const TransferMembership = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { memberName, memberId, memberMobile, memberEmail, memberDOB, memberAnniversary } = context || {};

    const [form, setForm] = useState({
        clientId: memberId || '23456',
        mobile: memberMobile || '9081815118',
        email: memberEmail !== '-' ? memberEmail : '',
        dob: memberDOB !== '-' ? memberDOB : '',
        anniversary: memberAnniversary !== '-' ? memberAnniversary : '',
        membershipName: 'GYM WORKOUT',
        duration: '12 Month',
        totalSessions: '360',
        sessionTransferred: '360',
        startDate: '2025-02-19',
        endDate: '2026-02-18',
        assignedTrainer: 'Abdulla Pathan',
        transferTo: '',
        paymentMethod: 'Online',
        comment: '',
        transferAmount: 0,
        subtotal: 0,
        surcharges: 0,
        payableAmount: 0,
        applyTaxes: false,
        taxPercentage: 0, // 0, 5, 18
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
    const taxDropdownRef = useRef(null);
    const trainerDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
            if (trainerDropdownRef.current && !trainerDropdownRef.current.contains(event.target)) setShowTrainerDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTaxSelect = (val) => {
        setForm({ ...form, taxPercentage: val });
        setShowTaxDropdown(false);
    };

    const calculateTaxes = () => {
        const subtotal = parseFloat(form.subtotal || 0);
        const surcharges = parseFloat(form.surcharges || 0);
        const base = subtotal + surcharges;
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

    const InputField = ({ label, value, placeholder, type = "text", required = false, onChange, readonly = false }) => (
        <div className="space-y-1.5 flex-1 min-w-[240px]">
            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    readOnly={readonly}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                        ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                        } ${readonly ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
                {type === 'date' && (
                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                )}
            </div>
        </div>
    );

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

            <h2 className={`text-xl font-bold px-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Transfer Membership ({memberId || '761552'})
            </h2>

            {/* Transfer Plan Section - Matching Image 5 */}
            <div className="space-y-6">
                <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transfer Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Client ID" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
                    <InputField label="Mobile Number" value={form.mobile} required onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                    <InputField label="Email Address" placeholder="Ex : abc@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <InputField label="Date of Birth" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                    <InputField label="Anniversary Date" type="date" value={form.anniversary} onChange={(e) => setForm({ ...form, anniversary: e.target.value })} />
                </div>
            </div>

            {/* Transfer Membership Section - Matching Image 4/5 */}
            <div className="space-y-6 pt-4">
                <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transfer Membership ({memberId || '761552'})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Membership Name" value={form.membershipName} readonly />
                    <InputField label="Duration" value={form.duration} readonly />
                    <InputField label="Total Sessions" value={form.totalSessions} readonly />
                    <InputField label="Session Transferred" value={form.sessionTransferred} onChange={(e) => setForm({ ...form, sessionTransferred: e.target.value })} />
                    <InputField label="Start Date" type="date" value={form.startDate} readonly />
                    <InputField label="End Date" type="date" value={form.endDate} readonly />

                    <div className="space-y-1.5 flex-1">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assigned Trainer</label>
                        <div className="relative" ref={trainerDropdownRef}>
                            <button
                                onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-all ${isDarkMode
                                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                            >
                                <span className={form.assignedTrainer ? '' : 'text-gray-400'}>{form.assignedTrainer || 'Select Trainer'}</span>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                            {showTrainerDropdown && (
                                <div className={`absolute left-0 top-full mt-1 w-full rounded-xl shadow-xl border z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                    {['Abdulla Pathan', 'ANJALI KANWAR', 'V10 FITNESS LAB'].map(opt => (
                                        <div
                                            key={opt}
                                            onClick={() => { setForm({ ...form, assignedTrainer: opt }); setShowTrainerDropdown(false); }}
                                            className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <InputField label="Transfer To" placeholder="Search Member" value={form.transferTo} onChange={(e) => setForm({ ...form, transferTo: e.target.value })} />
                </div>

                <div className="pt-2">
                    <button className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border text-sm font-bold transition-all ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-300' : 'border-gray-200 bg-white text-gray-700 shadow-sm'}`}>
                        <Plus size={16} />
                        Add New Member
                    </button>
                </div>
            </div>

            {/* Payment Row - Matching Image 3 */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t dark:border-white/10 border-gray-100`}>
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

                    <div className="space-y-2">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Comment</label>
                        <textarea
                            placeholder="Comment"
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm h-32 resize-none outline-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50' : 'bg-white border-gray-200 focus:border-orange-500'}`}
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    {[
                        { label: 'Transfer Amount', field: 'transferAmount' },
                        { label: 'Subtotal', value: form.subtotal, display: true },
                        { label: 'Surcharges', field: 'surcharges' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{row.label}</span>
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                    <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                    {row.display ? (
                                        <div className="w-28 px-3 py-2 text-sm font-bold">{row.value || '0'}</div>
                                    ) : (
                                        <input
                                            type="number"
                                            value={form[row.field]}
                                            onChange={(e) => setForm({ ...form, [row.field]: e.target.value, subtotal: row.field === 'transferAmount' ? e.target.value : form.subtotal })}
                                            className="w-28 px-3 py-2 bg-transparent outline-none text-sm font-bold"
                                        />
                                    )}
                                </div>
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>₹</div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Payable Amount</span>
                        <span className="text-lg font-black">₹{parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0)}</span>
                    </div>

                    {/* Tax Section - Matching Image 1 */}
                    <div className={`border rounded-xl p-5 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b dark:border-white/10 border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer group">
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
                                                onClick={() => handleTaxSelect(val)}
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
                    onClick={() => navigate(-1)}
                    className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase text-[15px] py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 tracking-wider"
                >
                    ₹{(parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0) + (form.applyTaxes ? parseFloat(taxes.total) : 0)).toFixed(2)} Submit
                </button>
            </div>
        </div>
    );
};

export default TransferMembership;
