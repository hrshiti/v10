import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { ChevronDown, Upload, Trash2, Plus } from 'lucide-react';

const FreshSale = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const { memberName, memberId, memberMobile, memberEmail } = context || {};

    const [activeTab, setActiveTab] = useState('General Training');
    const tabs = ['General Training', 'Personal Training', 'Complete Fitness', 'Group EX'];

    const [form, setForm] = useState({
        clientId: memberId || '23456',
        mobile: memberMobile || '9081815118',
        email: memberEmail !== '-' ? memberEmail : '',
        emergencyName: '',
        emergencyNumber: '',
        adharNo: '',
        gstin: '',
        firmName: '',
        firmEmployeeName: '',
        firmAddress: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        paymentDate: '',
        vaccination: 'No',
        adharCard: 'No',
        paymentMethod: 'Online',
        selectedPlansTotal: 0,
        totalDiscount: 0,
        subtotal: 0,
        surcharges: 0,
        payableAmount: 0,
        amountPaid: 0,
        remainingAmount: 0,
        totalAmount: 0,
        comment: '',
        applyTaxes: false,
        taxPercentage: 0, // 0, 5, 18
        paymentSubMethod: 'NEFT', // NEFT, RTGS, IMPS, Google Pay, PhonePe, others
        bankName: '',
        chequeNumber: '',
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const [showPaymentSubDropdown, setShowPaymentSubDropdown] = useState(false);
    const taxDropdownRef = useRef(null);
    const paymentDropdownRef = useRef(null);
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);

    const trainingPlans = [
        { name: 'GYM WORKOUT', duration: '1 Month', cost: 2500 },
        { name: 'GYM WORKOUT', duration: '3 Month', cost: 5000 },
        { name: 'GYM WORKOUT', duration: '6 Month', cost: 7000 },
        { name: 'GYM WORKOUT', duration: '12 Month', cost: 9000 },
        { name: 'Complementary', duration: '12 Month', cost: 0 },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
            if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target)) setShowPaymentSubDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const InputField = ({ label, value, placeholder, type = "text", required = false, onChange }) => (
        <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                    }`}
            />
        </div>
    );

    const calculateTaxes = () => {
        const base = (parseFloat(form.selectedPlansTotal || 0) + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0)) - parseFloat(form.totalDiscount || 0);
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

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={() => window.history.back()} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                    <Plus size={20} className={`rotate-45 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-orange-500 text-sm font-bold">Members Profile</span>
                </div>
            </div>

            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fresh Sale</h2>

            {/* Basic Info Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <InputField label="Client ID" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
                <InputField label="Mobile Number" value={form.mobile} required onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                <InputField label="Email Address" placeholder="Ex : abc@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <InputField label="Emergency Contact Name" placeholder="Name" value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
                <InputField label="Emergency Contact Number" placeholder="0987654321" value={form.emergencyNumber} onChange={(e) => setForm({ ...form, emergencyNumber: e.target.value })} />
                <InputField label="Adhar No." placeholder="0987654321" value={form.adharNo} onChange={(e) => setForm({ ...form, adharNo: e.target.value })} />
                <InputField label="GSTIN No." placeholder="0987654321" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
                <InputField label="Firm Name" placeholder="Contact Name" value={form.firmName} onChange={(e) => setForm({ ...form, firmName: e.target.value })} />
                <InputField label="Firm Employee Name" placeholder="Name" value={form.firmEmployeeName} onChange={(e) => setForm({ ...form, firmEmployeeName: e.target.value })} />
            </div>

            <div className="space-y-1.5">
                <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Firm Address</label>
                <textarea
                    placeholder="Type your Address here..."
                    value={form.firmAddress}
                    onChange={(e) => setForm({ ...form, firmAddress: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all h-24 resize-none ${isDarkMode
                        ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                        }`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Invoice Date" value={form.invoiceDate} type="date" onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
                <InputField label="Payment Date" placeholder="dd-mm-yyyy" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
            </div>

            {/* Radio Options & Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-8">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vacination*</label>
                        <div className="flex items-center gap-4">
                            {['Yes', 'No'].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.vaccination === opt ? 'border-orange-500' : 'border-gray-400'}`}>
                                        {form.vaccination === opt && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                    </div>
                                    <input type="radio" className="hidden" name="vaccination" checked={form.vaccination === opt} onChange={() => setForm({ ...form, vaccination: opt })} />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-8">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Adhaar Card*</label>
                        <div className="flex items-center gap-4">
                            {['Yes', 'No'].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.adharCard === opt ? 'border-orange-500' : 'border-gray-400'}`}>
                                        {form.adharCard === opt && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                    </div>
                                    <input type="radio" className="hidden" name="adharCard" checked={form.adharCard === opt} onChange={() => setForm({ ...form, adharCard: opt })} />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="file" ref={fileInputRef1} className="hidden" />
                <div
                    onClick={() => fileInputRef1.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1e1e1e]' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                    <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                    <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                </div>
                <input type="file" ref={fileInputRef2} className="hidden" />
                <div
                    onClick={() => fileInputRef2.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1e1e1e]' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                    <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                    <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                </div>
            </div>

            {/* Plans Table */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="p-4 bg-gray-50 dark:bg-white/5 border-b dark:border-white/10 border-gray-100 flex items-center justify-between">
                    <div className="flex gap-4">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Plus size={14} />
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`text-xs font-bold border-b transition-all ${isDarkMode ? 'text-gray-400 border-white/10 bg-white/5' : 'text-gray-600 border-gray-100 bg-gray-50'}`}>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Trainer</th>
                                <th className="px-6 py-4">Cost</th>
                                <th className="px-6 py-4">Start Date</th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {trainingPlans.map((plan, idx) => (
                                <tr key={idx} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <div className={`w-4 h-4 rounded-full border-2 border-gray-300 cursor-pointer`} />
                                        {plan.name}
                                    </td>
                                    <td className="px-6 py-4">{plan.duration}</td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center justify-between px-3 py-1.5 border rounded-lg w-40 ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
                                            <span className="text-gray-400">Select Trainer</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{plan.cost}</td>
                                    <td className="px-6 py-4 text-center">
                                        <input type="date" className={`px-2 py-1 rounded border outline-none text-[11px] ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment & Totals */}
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

                    {/* Conditional Payment Fields */}
                    {(form.paymentMethod === 'Online' || form.paymentMethod === 'Wallet') && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment is done via</label>
                            <div className="relative" ref={paymentDropdownRef}>
                                <button
                                    onClick={() => setShowPaymentSubDropdown(!showPaymentSubDropdown)}
                                    className={`w-full max-w-[200px] flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-bold transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-orange-500' : 'bg-white border-orange-500 text-orange-500'}`}
                                >
                                    <span>{form.paymentSubMethod || 'Select'}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${showPaymentSubDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showPaymentSubDropdown && (
                                    <div className={`absolute left-0 top-full mt-1 w-48 rounded-xl shadow-xl border z-[60] py-1 overflow-hidden animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                        {['NEFT', 'RTGS', 'IMPS', 'Google Pay', 'PhonePe', 'others'].map(opt => (
                                            <div
                                                key={opt}
                                                onClick={() => { setForm({ ...form, paymentSubMethod: opt }); setShowPaymentSubDropdown(false); }}
                                                className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {form.paymentMethod === 'Cheque' && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                            <InputField label="Enter Bank Name" placeholder="Bank Name" required value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
                            <InputField label="Cheque number" placeholder="Cheque number" required value={form.chequeNumber} onChange={(e) => setForm({ ...form, chequeNumber: e.target.value })} />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Comment</label>
                        <textarea
                            placeholder="Comment"
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm h-32 resize-none outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600' : 'bg-white border-gray-200'}`}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Selected Plans Total', value: '₹0.00' },
                        { label: 'Total Discount', value: '₹0.00', editable: true },
                        { label: 'Subtotal', value: '₹0.00', editable: true },
                        { label: 'Surcharges', value: '₹0.00', editable: true },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase">{row.label}</span>
                            {row.editable ? (
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                                        <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                        <input type="text" value="0.00" className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold" readOnly />
                                    </div>
                                    <div className={`p-2 rounded-lg bg-[#6b7280] text-white`}>₹</div>
                                </div>
                            ) : (
                                <span className="text-lg font-bold">₹0.00</span>
                            )}
                        </div>
                    ))}

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Payable Amount</span>
                        <span className="text-lg font-bold">₹0.00</span>
                    </div>

                    <div className={`border rounded-xl p-5 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
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
                                    className={`flex items-center justify-between px-3 py-1.5 border rounded-lg w-32 bg-white dark:bg-[#1a1a1a] transition-all font-bold text-xs ${form.taxPercentage > 0 ? 'border-orange-500 text-orange-500' : 'border-gray-200 text-gray-400'}`}
                                >
                                    <span>{form.taxPercentage ? `${form.taxPercentage}%` : 'Select Tax'}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${showTaxDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showTaxDropdown && (
                                    <div className={`absolute left-0 top-full mt-1 w-32 rounded-lg shadow-xl border z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                        {[5, 12, 18].map(val => (
                                            <div
                                                key={val}
                                                onClick={() => { setForm({ ...form, taxPercentage: val }); setShowTaxDropdown(false); }}
                                                className={`px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {val}%
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300">
                                <span>CGST ({form.applyTaxes ? taxes.cgstPerc : '0'}%)</span>
                                <span>₹{form.applyTaxes ? taxes.cgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300">
                                <span>SGST ({form.applyTaxes ? taxes.sgstPerc : '0'}%)</span>
                                <span>₹{form.applyTaxes ? taxes.sgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold pt-5 mt-4 border-t border-dashed dark:border-white/10 border-gray-200">
                                <span className="text-gray-600 dark:text-gray-400">Total Taxes (₹)</span>
                                <span>₹{form.applyTaxes ? taxes.total : '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Amount Paid (₹)</span>
                        <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                            <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                            <input type="text" value="0.00" className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold" readOnly />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Remaining Amount</span>
                        <span className="text-lg font-bold">₹0.00</span>
                    </div>

                    <div className={`border rounded-xl p-6 flex flex-col items-start gap-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-xs font-bold text-gray-400">Total Amount</span>
                        <span className="text-4xl font-bold">₹0</span>
                    </div>
                </div>
            </div>

            {/* Submit Section - Now inside the form flow */}
            <div className={`mt-10 p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">I want to make payment and generate invoice</p>
                <button
                    onClick={() => window.history.back()}
                    className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase text-[15px] py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 tracking-wider"
                >
                    ₹0 Submit
                </button>
            </div>
        </div>
    );
};

export default FreshSale;
