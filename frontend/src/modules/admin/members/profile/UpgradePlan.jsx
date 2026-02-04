import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowLeft, Check, Plus } from 'lucide-react';

const UpgradePlan = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { memberName, memberId, memberMobile, memberEmail } = context || {};

    const [form, setForm] = useState({
        clientId: memberId || '23456',
        mobile: memberMobile || '9081815118',
        email: memberEmail !== '-' ? memberEmail : '',
        emergencyName: '',
        emergencyNumber: '',
        gstin: '',
        firmName: '',
        firmEmployeeName: '',
        invoiceDate: '2026-02-03',
        firmAddress: '',

        packageName: 'GYM WORKOUT',
        duration: '12 Month',
        totalSessions: '360',
        startDate: '19-02-2025',
        endDate: '18-02-2026',
        assignedTrainer: 'Abdulla Pathan',
        paidAmount: 7000,

        paymentMethod: 'Online',
        comment: '',
        selectedPlansTotal: 0,
        totalDiscount: 0,
        subtotal: 0,
        surcharges: 0,
        applyTaxes: false,
        taxPercentage: 0,
    });

    const [activeTab, setActiveTab] = useState('General Training');
    const tabs = ['General Training'];

    const trainingPlans = [
        { name: 'GYM WORKOUT', duration: '1 Month', cost: 2500, trainer: 'Abdulla Pathan', startDate: '19-02-2025' },
        { name: 'GYM WORKOUT', duration: '3 Month', cost: 5000, trainer: 'Abdulla Pathan', startDate: '19-02-2025' },
        { name: 'GYM WORKOUT', duration: '6 Month', cost: 7000, trainer: 'Abdulla Pathan', startDate: '19-02-2025' },
        { name: 'GYM WORKOUT', duration: '12 Month', cost: 9000, trainer: 'Abdulla Pathan', startDate: '19-02-2025' },
        { name: 'Complementary', duration: '12 Month', cost: 0, trainer: 'Abdulla Pathan', startDate: '19-02-2025' },
    ];

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const taxDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        const upgradeAmount = Math.max(0, form.selectedPlansTotal - form.paidAmount);
        const base = upgradeAmount + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0) - parseFloat(form.totalDiscount || 0);
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
    const upgradeAmount = Math.max(0, form.selectedPlansTotal - form.paidAmount);
    const payableAmount = (upgradeAmount + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0) - parseFloat(form.totalDiscount || 0) + (form.applyTaxes ? parseFloat(taxes.total) : 0)).toFixed(2);

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

            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upgrade Plan</h2>

            <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InputField label="Client ID" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
                    <InputField label="Mobile Number" value={form.mobile} required onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                    <InputField label="Email Address" placeholder="Ex : abc@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <InputField label="Emergency Contact Name" placeholder="Contact Name" value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
                    <InputField label="Emergency Contact Number" placeholder="Ex : 9988776655" value={form.emergencyNumber} onChange={(e) => setForm({ ...form, emergencyNumber: e.target.value })} />
                    <InputField label="GSTIN No." placeholder="Ex : 123456789123456" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
                    <InputField label="Firm Name" placeholder="Contact Name" value={form.firmName} onChange={(e) => setForm({ ...form, firmName: e.target.value })} />
                    <InputField label="Firm Employee Name" placeholder="Firm Employee Name" value={form.firmEmployeeName} onChange={(e) => setForm({ ...form, firmEmployeeName: e.target.value })} />
                    <InputField label="Invoice Date" type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
                    <div className="space-y-1.5 flex-1">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Firm Address</label>
                        <textarea
                            placeholder="Type your Address here..."
                            value={form.firmAddress}
                            onChange={(e) => setForm({ ...form, firmAddress: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all h-24 resize-none ${isDarkMode
                                ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50'
                                : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500'
                                }`}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Existing Plan Details</h3>
                <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <InputField label="Package Name" value={form.packageName} readonly />
                        <InputField label="Duration" value={form.duration} readonly />
                        <InputField label="Total Sessions" value={form.totalSessions} readonly />
                        <InputField label="Start Date" value={form.startDate} readonly />
                        <InputField label="End Date" value={form.endDate} readonly />
                        <InputField label="Assigned Trainer" value={form.assignedTrainer} readonly />
                        <InputField label="Paid Amount" value={form.paidAmount} readonly />
                    </div>
                </div>
            </div>

            {/* Selection Table */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="p-4 border-b dark:border-white/10 border-gray-100">
                    <button className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'}`}>Clear Selected</button>
                </div>
                <div className="p-4 border-b dark:border-white/10 border-gray-100 flex gap-10">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-2 py-2 text-xs font-bold transition-all relative ${activeTab === tab ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Plus size={14} className="rotate-45" />
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full" />}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`text-[11px] font-bold border-b transition-all ${isDarkMode ? 'text-gray-400 border-white/10 bg-white/5' : 'text-gray-600 border-gray-100 bg-gray-50'}`}>
                                <th className="px-8 py-4">Name</th>
                                <th className="px-8 py-4">Duration</th>
                                <th className="px-8 py-4">Trainer</th>
                                <th className="px-8 py-4">Cost</th>
                                <th className="px-8 py-4">Start Date</th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {trainingPlans.map((plan, idx) => (
                                <tr key={idx} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-gray-50 hover:bg-gray-50 transition-colors'}`}>
                                    <td className="px-8 py-5 flex items-center gap-5">
                                        <div
                                            onClick={() => setForm({ ...form, selectedPlansTotal: plan.cost })}
                                            className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${form.selectedPlansTotal === plan.cost && plan.cost !== 0 ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}
                                        >
                                            {form.selectedPlansTotal === plan.cost && plan.cost !== 0 && <Check size={12} className="text-white" />}
                                        </div>
                                        {plan.name}
                                    </td>
                                    <td className="px-8 py-5">{plan.duration}</td>
                                    <td className="px-8 py-5">
                                        <div className={`flex items-center justify-between px-4 py-2 border rounded-lg w-48 ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-[#f9f9f9]'}`}>
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{plan.trainer}</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">{plan.cost}</td>
                                    <td className="px-8 py-5">
                                        <div className={`flex items-center justify-between px-3 py-2 border rounded-lg w-44 ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-[#f9f9f9]'}`}>
                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{plan.startDate}</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment & Summary */}
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
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Selected Plans Total</span>
                        <span className="text-lg font-bold">₹{form.selectedPlansTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Upgrad Amount (₹{form.selectedPlansTotal}- ₹{form.paidAmount})</span>
                        <span className="text-lg font-bold">₹{upgradeAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Total Discount</span>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="number"
                                    value={form.totalDiscount}
                                    onChange={(e) => setForm({ ...form, totalDiscount: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>₹</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Subtotal</span>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="number"
                                    value={form.subtotal}
                                    onChange={(e) => setForm({ ...form, subtotal: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>₹</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Surcharges</span>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="number"
                                    value={form.surcharges}
                                    onChange={(e) => setForm({ ...form, surcharges: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>%</div>
                        </div>
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
                                    <div className={`absolute left-0 top-full mt-1 w-32 rounded-xl shadow-xl border z-50 py-1 overflow-hidden animate-in fade-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
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
                                <span>₹{form.applyTaxes ? taxes.cgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>SGST ({form.applyTaxes ? taxes.sgstPerc : '0'}%)</span>
                                <span>₹{form.applyTaxes ? taxes.sgst : '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-black pt-5 mt-4 border-t border-dashed dark:border-white/10 border-gray-200">
                                <span className="text-gray-400">Total Taxes (₹)</span>
                                <span>₹{form.applyTaxes ? taxes.total : '0.00'}</span>
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
                    ₹{payableAmount} Submit
                </button>
            </div>
        </div>
    );
};

export default UpgradePlan;
