import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Upload, Plus, ArrowLeft, Check, History, CreditCard, Receipt } from 'lucide-react';

import { API_BASE_URL } from '../../../../config/api';

const RenewPlan = () => {
    const context = useOutletContext();
    const location = useLocation();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { id, memberName, memberId, memberMobile, memberEmail, memberData } = context || {};

    const [activeTab, setActiveTab] = useState(location.state?.category || 'General Training');
    const tabs = ['General Training', 'Personal Training', 'Complete Fitness', 'Group EX'];

    const [packages, setPackages] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSubscription, setCurrentSubscription] = useState(null);

    const [form, setForm] = useState({
        clientId: memberId || '',
        mobile: memberMobile || '',
        email: (memberEmail && memberEmail !== '-') ? memberEmail : '',
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
        surchargePercent: 0,
        payableAmount: 0,
        amountPaid: 0,
        splitPayment: { cash: 0, online: 0 },
        remainingAmount: 0,
        totalAmount: 0,
        comment: '',
        applyTaxes: false,
        taxPercentage: 0,
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
    const taxDropdownRef = useRef(null);
    const trainerDropdownRef = useRef(null);
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                const headers = { 'Authorization': `Bearer ${token}` };

                const [pkgRes, trainerRes, subRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/packages`, { headers }),
                    fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, { headers }),
                    fetch(`${API_BASE_URL}/api/admin/members/${id}/subscriptions`, { headers })
                ]);

                if (pkgRes.ok) setPackages(await pkgRes.json());
                if (trainerRes.ok) setTrainers(await trainerRes.json());

                if (subRes.ok) {
                    const subData = await subRes.json();
                    const activeSub = subData.find(s => s.status === 'Active') || subData[0];
                    if (activeSub) {
                        setCurrentSubscription(activeSub);
                        const expiryDate = activeSub.endDate || activeSub.expiryDate;
                        if (expiryDate) {
                            const expiry = new Date(expiryDate);
                            const nextDay = new Date(expiry);
                            nextDay.setDate(nextDay.getDate() + 1);

                            // If current plan is still active, start renewal from next day of expiry
                            if (new Date() < expiry) {
                                setForm(prev => ({
                                    ...prev,
                                    invoiceDate: nextDay.toISOString().split('T')[0]
                                }));
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const trainingPlans = packages.filter(pkg => {
        if (!pkg.active) return false;

        // Search filter
        if (searchQuery && !pkg.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        const tabLower = activeTab.toLowerCase();
        // General Training: type=general AND gym activity (excludes PT packages which also have gym activity)
        if (tabLower.includes('general')) return pkg.type === 'general' && pkg.activity === 'gym';
        // Personal Training: type=pt only
        if (tabLower.includes('personal')) return pkg.type === 'pt';
        // Complete Fitness: general type with non-gym activities (yoga, zumba, crossfit)
        if (tabLower.includes('complete')) return pkg.type === 'general' && ['yoga', 'zumba', 'crossfit'].includes(pkg.activity);
        // Group EX: any package with group activity types
        if (tabLower.includes('group')) return ['zumba', 'yoga', 'crossfit'].includes(pkg.activity);
        return false;
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
            if (trainerDropdownRef.current && !trainerDropdownRef.current.contains(event.target)) setShowTrainerDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                {(type === 'date' || label.includes('Date')) && (
                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                )}
            </div>
        </div>
    );

    const handleTaxSelect = (val) => {
        setForm({ ...form, taxPercentage: val });
        setShowTaxDropdown(false);
    };

    const planPrice = parseFloat(form.selectedPlansTotal || 0);
    const discount = parseFloat(form.totalDiscount || 0);
    const subtotal = Math.max(0, planPrice - discount);

    // Surcharge calculation (% matching AddMember)
    const surchargePercent = parseFloat(form.surchargePercent || 0);
    const surchargeAmount = (subtotal * surchargePercent) / 100;
    const amountBeforeTax = subtotal + surchargeAmount;

    const handleSubtotalChange = (val) => {
        const newSubtotal = Number(val) || 0;
        const newDiscount = Math.max(0, planPrice - newSubtotal);
        setForm(prev => ({
            ...prev,
            totalDiscount: newDiscount
        }));
    };

    const calculateTaxes = () => {
        const taxPercent = form.applyTaxes ? (parseFloat(form.taxPercentage || 0)) : 0;
        const taxAmount = (amountBeforeTax * taxPercent) / 100;
        const cgst = taxAmount / 2;
        const sgst = taxAmount / 2;
        return {
            cgst: cgst.toFixed(2),
            sgst: sgst.toFixed(2),
            total: taxAmount.toFixed(2),
            cgstPerc: (taxPercent / 2).toFixed(1),
            sgstPerc: (taxPercent / 2).toFixed(1)
        };
    };

    const taxes = calculateTaxes();
    const payableAmount = (amountBeforeTax + parseFloat(taxes.total)).toFixed(2);
    const amountPaid = parseFloat(form.amountPaid || 0);
    const remainingAmount = (parseFloat(payableAmount) - amountPaid).toFixed(2);

    // Auto-sync amountPaid with subtotal
    useEffect(() => {
        if (selectedPlan) {
            setForm(prev => ({ ...prev, amountPaid: subtotal }));
        }
    }, [subtotal, selectedPlan]);

    // Auto-sync split payment when amountPaid changes
    useEffect(() => {
        if (form.paymentMethod === 'Split') {
            const currentTotal = Number(form.splitPayment.cash) + Number(form.splitPayment.online);
            if (currentTotal !== Number(form.amountPaid)) {
                setForm(prev => ({
                    ...prev,
                    splitPayment: { cash: Number(prev.amountPaid), online: 0 }
                }));
            }
        }
    }, [form.amountPaid, form.paymentMethod]);

    const handleSubmit = async () => {
        if (isLoading) return;
        if (!selectedPlan || !id) {
            alert('Please select a plan');
            return;
        }

        // Validation: Trainer mandatory for Personal Training
        const isPT = activeTab === 'Personal Training' || selectedPlan.type === 'pt';
        if (isPT && !selectedTrainer) {
            alert('Trainer is mandatory for Personal Training. Please select a trainer on the plan card.');
            return;
        }

        setIsLoading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;

            const start = new Date(form.invoiceDate);
            const end = new Date(start);
            if (selectedPlan.durationType === 'Months') {
                end.setMonth(end.getMonth() + selectedPlan.durationValue);
            } else {
                end.setDate(end.getDate() + selectedPlan.durationValue);
            }

            const payload = {
                memberId: id,
                membershipType: isPT ? 'Personal Training' : 'General Training',
                packageName: selectedPlan.name,
                packageId: selectedPlan._id,
                duration: selectedPlan.durationValue,
                durationType: selectedPlan.durationType,
                durationMonths: selectedPlan.durationType === 'Months' ? selectedPlan.durationValue : 0,
                startDate: start,
                endDate: end,
                amount: payableAmount,
                subTotal: amountBeforeTax,
                taxAmount: form.applyTaxes ? taxes.total : 0,
                paidAmount: form.amountPaid,
                discount: discount,
                paymentMode: form.paymentMethod,
                splitPayment: form.paymentMethod === 'Split' ? form.splitPayment : { cash: 0, online: 0 },
                commitmentDate: form.commitmentDate,
                assignedTrainer: selectedTrainer,
                closedBy: adminInfo?._id,
                comment: form.comment
            };

            const res = await fetch(`${API_BASE_URL}/api/admin/members/renew`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Membership renewed successfully');
                navigate(-1);
            } else {
                const err = await res.json();
                alert(err.message || 'Error renewing membership');
            }
        } catch (error) {
            console.error('Error renewing membership:', error);
            alert('Failed to renew membership');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-4">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold">Back</span>
                </button>
                <div className="text-right">
                    <h1 className="text-[28px] font-black tracking-tight">MEMBERSHIP RENEWAL</h1>
                    <p className="text-orange-500 text-xs font-black uppercase tracking-[2px]">{memberName} • {memberId}</p>
                </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                <div className="lg:col-span-8 space-y-8">
                    {/* Active Plan Info Strip */}
                    {memberData && (
                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                    <History size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active Plan Expiry</p>
                                    <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {(() => {
                                            const dateVal = currentSubscription?.endDate || currentSubscription?.expiryDate;
                                            if (!dateVal) return 'N/A';
                                            const d = new Date(dateVal);
                                            return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-l dark:border-white/10 border-gray-100 pl-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Renewal Starts From</p>
                                    <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {new Date(form.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex-1 ml-4 border-l dark:border-white/10 border-gray-100 pl-4">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mb-2">Search Packages</p>
                                <div className="relative mt-1">
                                    <Plus size={14} className="absolute left-3 top-2.5 text-gray-400 rotate-45" />
                                    <input
                                        type="text"
                                        placeholder="Quick Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`pl-8 pr-4 py-1.5 rounded-lg text-xs font-bold outline-none border transition-all ${isDarkMode ? 'bg-black/20 border-white/10 text-white focus:border-orange-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NEW: Package Selection Table with Tabs */}
                    <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] shadow-2xl border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
                        {/* Tabs Header */}
                        <div className={`flex border-b overflow-x-auto custom-scrollbar-hide ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-4 text-[13px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${activeTab === tab
                                        ? 'border-orange-500 text-orange-500 bg-white/5'
                                        : 'border-transparent text-gray-400 hover:text-gray-500'
                                        }`}
                                >
                                    <Receipt size={16} />
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Package Selection Table */}
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className={`text-[11px] font-black uppercase tracking-wider border-b ${isDarkMode ? 'border-white/5 text-gray-500' : 'bg-[#fafafa] border-gray-100 text-gray-400'}`}>
                                            <th className="px-6 py-4 w-10"></th>
                                            <th className="px-6 py-4">Plan Name</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4">Trainer</th>
                                            <th className="px-6 py-4">Cost</th>
                                            <th className="px-6 py-4">Renewal Start</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-white/5 divide-gray-50">
                                        {trainingPlans.map(pkg => (
                                            <tr
                                                key={pkg._id}
                                                className={`group cursor-pointer transition-colors ${selectedPlan?._id === pkg._id ? (isDarkMode ? 'bg-orange-500/5' : 'bg-orange-50') : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50/50')}`}
                                                onClick={() => {
                                                    setSelectedPlan(pkg);
                                                    setForm(prev => ({
                                                        ...prev,
                                                        selectedPlansTotal: pkg.baseRate,
                                                        amountPaid: pkg.baseRate // Reset paid amount to full by default when changing plan
                                                    }));
                                                }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan?._id === pkg._id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                                        {selectedPlan?._id === pkg._id && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[14px] font-black text-gray-900 dark:text-gray-200">{pkg.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[13px] font-bold text-gray-500">{pkg.durationValue} {pkg.durationType}</span>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        disabled={selectedPlan?._id !== pkg._id}
                                                        className={`bg-white dark:bg-transparent border dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none appearance-none transition-all pr-8 relative disabled:opacity-30 ${isDarkMode ? 'text-white border-white/10' : 'text-gray-800 border-gray-200 shadow-sm'}`}
                                                        value={selectedPlan?._id === pkg._id ? selectedTrainer : ''}
                                                        onChange={(e) => setSelectedTrainer(e.target.value)}
                                                    >
                                                        <option value="">Select Trainer</option>
                                                        {trainers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-[14px] font-black text-gray-900 dark:text-gray-200">
                                                    ₹{pkg.baseRate}
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="date"
                                                        disabled={selectedPlan?._id !== pkg._id}
                                                        className={`bg-white dark:bg-transparent border dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none transition-all disabled:opacity-30 ${isDarkMode ? 'text-white cursor-pointer select-none' : 'text-gray-800 border-gray-200 shadow-sm'}`}
                                                        value={selectedPlan?._id === pkg._id ? form.invoiceDate : ''}
                                                        onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                                                        onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment & Financials */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Payment Mode Selection */}
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] shadow-2xl border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
                        <div className="flex flex-wrap gap-4 mb-6">
                            {['UPI / Online', 'Cash', 'Card', 'Cheque', 'Split'].map(mode => (
                                <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        className="hidden"
                                        name="paymentMethod"
                                        checked={form.paymentMethod === mode}
                                        onChange={() => setForm({ ...form, paymentMethod: mode })}
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.paymentMethod === mode ? 'border-orange-500' : 'border-gray-400'}`}>
                                        {form.paymentMethod === mode && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                    </div>
                                    <span className={`text-[13px] font-bold ${form.paymentMethod === mode ? 'text-orange-500' : 'text-gray-500'}`}>{mode}</span>
                                </label>
                            ))}
                        </div>

                        {form.paymentMethod === 'Split' && (
                            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-orange-500/5 border border-dashed border-orange-500/20 animate-in slide-in-from-top-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-500">Cash Part</label>
                                    <input
                                        type="number"
                                        className={`w-full bg-transparent border-b outline-none text-sm font-bold ${isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-800'}`}
                                        value={form.splitPayment.cash}
                                        onChange={(e) => {
                                            const cash = Number(e.target.value) || 0;
                                            const online = Math.max(0, Number(form.amountPaid) - cash);
                                            setForm({ ...form, splitPayment: { cash, online } });
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-500">Online Part</label>
                                    <input
                                        type="number"
                                        className={`w-full bg-transparent border-b outline-none text-sm font-bold ${isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-800'}`}
                                        value={form.splitPayment.online}
                                        onChange={(e) => {
                                            const online = Number(e.target.value) || 0;
                                            const cash = Math.max(0, Number(form.amountPaid) - online);
                                            setForm({ ...form, splitPayment: { cash, online } });
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[12px] font-black uppercase text-gray-400">Comment</label>
                            <textarea
                                className={`w-full p-4 rounded-xl border outline-none text-sm font-bold h-24 resize-none transition-all ${isDarkMode ? 'bg-black/20 border-white/10 focus:border-orange-500/50 text-white' : 'bg-gray-50 border-gray-100 focus:border-orange-500 text-gray-800'}`}
                                placeholder="Renewal notes..."
                                value={form.comment}
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Financial Calculations */}
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] shadow-2xl border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[13px] font-bold text-gray-500">
                                <span>Base Rate</span>
                                <span className="font-black text-gray-900 dark:text-gray-200">₹{(form.selectedPlansTotal || 0).toFixed(2)}</span>
                            </div>

                            <FinancialInput
                                label="Total Discount"
                                value={form.totalDiscount}
                                suffix="₹"
                                onChange={(val) => setForm({ ...form, totalDiscount: val })}
                                isDarkMode={isDarkMode}
                            />

                            <FinancialInput
                                label="Subtotal"
                                value={subtotal.toFixed(2)}
                                suffix="₹"
                                onChange={(val) => handleSubtotalChange(val)}
                                isDarkMode={isDarkMode}
                            />

                            <FinancialInput
                                label="Surcharges"
                                value={form.surchargePercent}
                                suffix="%"
                                onChange={(val) => setForm({ ...form, surchargePercent: val })}
                                isDarkMode={isDarkMode}
                            />

                            <div className="flex justify-between items-center pt-2 text-[14px] font-black uppercase tracking-tight">
                                <span>Payable Amount</span>
                                <span className="text-orange-500">₹{payableAmount}</span>
                            </div>

                            {/* Taxes Block */}
                            <div className={`mt-4 rounded-xl border p-4 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded accent-orange-500"
                                            checked={form.applyTaxes}
                                            onChange={(e) => setForm({ ...form, applyTaxes: e.target.checked })}
                                        />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Apply Taxes*</span>
                                    </label>
                                    <div className="flex gap-1">
                                        {[5, 12, 18].map(perc => (
                                            <button
                                                key={perc}
                                                type="button"
                                                onClick={() => setForm({ ...form, taxPercentage: perc, applyTaxes: true })}
                                                className={`px-2 py-1 rounded text-[10px] font-black transition-all ${form.taxPercentage === perc && form.applyTaxes
                                                    ? 'bg-orange-500 text-white'
                                                    : (isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-white border border-gray-200 text-gray-600')
                                                    }`}
                                            >
                                                {perc}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 text-[11px] font-bold text-gray-500">
                                    <div className="flex justify-between">
                                        <span>CGST ({taxes.cgstPerc}%)</span>
                                        <span>₹{taxes.cgst}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SGST ({taxes.sgstPerc}%)</span>
                                        <span>₹{taxes.sgst}</span>
                                    </div>
                                    <div className="flex justify-between mt-3 pt-3 border-t dark:border-white/5 border-gray-200 font-black text-gray-900 dark:text-gray-200">
                                        <span>Total Taxes (₹)</span>
                                        <span>₹{taxes.total}</span>
                                    </div>
                                </div>
                            </div>

                            <FinancialInput
                                label="Amount Paid (₹)"
                                value={form.amountPaid}
                                suffix="₹"
                                onChange={(val) => setForm({ ...form, amountPaid: val })}
                                highlight
                                isDarkMode={isDarkMode}
                            />

                            <div className={`p-4 rounded-xl flex justify-between items-center transition-all ${remainingAmount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                <span className="text-[10px] font-black uppercase tracking-wider">Remaining Amount</span>
                                <span className="text-sm font-black text-right">₹{remainingAmount}</span>
                            </div>

                            {remainingAmount > 0 && (
                                <div className="animate-in slide-in-from-top-2 duration-300 pt-2 space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400">Commitment Date*</label>
                                    <input
                                        type="date"
                                        required
                                        value={form.commitmentDate || ''}
                                        onChange={(e) => setForm({ ...form, commitmentDate: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !selectedPlan}
                                    className="w-full bg-[#f97316] text-white font-black uppercase tracking-[2px] text-[13px] py-4 rounded-xl shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={20} />
                                            Confirm Renewal
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

// Internal Helper Components
const FinancialInput = ({ label, value, suffix, onChange, readOnly, highlight, isDarkMode }) => {
    const handleChange = (e) => {
        if (!onChange) return;
        const val = e.target.value.replace(/[^0-9.]/g, ''); // Only allow numbers and decimal
        const numVal = parseFloat(val) || 0;
        onChange(Math.max(0, numVal)); // Prevent negative values
    };

    const displayValue = value === 0 ? '0' : value;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
                <div className={`flex rounded-lg border overflow-hidden transition-all ${highlight ? 'border-orange-500 ring-2 ring-orange-500/20' : (isDarkMode ? 'border-white/10' : 'border-gray-200')}`}>
                    <input
                        type="text"
                        inputMode="decimal"
                        readOnly={readOnly}
                        value={displayValue}
                        onChange={handleChange}
                        className={`w-24 px-3 py-2 text-right bg-transparent outline-none text-[13px] font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                    <div className={`px-2 py-2 flex items-center justify-center min-w-[32px] text-[12px] font-black ${highlight ? 'bg-orange-500 text-white' : (isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500')}`}>
                        {suffix}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RenewPlan;
