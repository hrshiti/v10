import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Upload, Plus, ArrowLeft, Check, History } from 'lucide-react';

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
        surcharges: 0,
        payableAmount: 0,
        amountPaid: 0,
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

                const [pkgRes, trainerRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/packages`, { headers }),
                    fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, { headers })
                ]);

                if (pkgRes.ok) setPackages(await pkgRes.json());
                if (trainerRes.ok) setTrainers(await trainerRes.json());
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
        if (tabLower.includes('general')) return pkg.type === 'general' || pkg.activity === 'gym';
        if (tabLower.includes('personal')) return pkg.type === 'pt';
        if (tabLower.includes('complete')) return pkg.type === 'general';
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
    const baseSubtotal = (parseFloat(form.selectedPlansTotal || 0) + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0));
    const discountedSubtotal = baseSubtotal - parseFloat(form.totalDiscount || 0);
    const payableAmount = (discountedSubtotal + (form.applyTaxes ? parseFloat(taxes.total) : 0)).toFixed(2);
    const remainingAmount = (parseFloat(payableAmount) - parseFloat(form.amountPaid || 0)).toFixed(2);

    const handleSubmit = async () => {
        if (!selectedPlan || !id) {
            alert('Please select a plan');
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
                membershipType: activeTab === 'Personal Training' ? 'Personal Training' : 'General Training',
                packageName: selectedPlan.name,
                durationMonths: selectedPlan.durationValue,
                startDate: start,
                endDate: end,
                amount: payableAmount,
                subTotal: baseSubtotal,
                taxAmount: form.applyTaxes ? taxes.total : 0,
                paidAmount: form.amountPaid,
                discount: form.totalDiscount,
                paymentMode: form.paymentMethod,
                assignedTrainer: selectedTrainer,
                closedBy: adminInfo?._id
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
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                    </button>
                    <div>
                        <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-tight`}>Renew Membership</h2>
                        <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">{memberName} • {memberId}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Package Selection */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Categories and Search */}
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === tab
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : (isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100')
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-1 min-w-[200px]">
                                <Plus size={16} className="absolute left-3 top-2.5 text-gray-400 rotate-45" />
                                <input
                                    type="text"
                                    placeholder="Search packages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-bold outline-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-orange-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-orange-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Simple Grid of Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trainingPlans.map((plan) => (
                            <div
                                key={plan._id}
                                onClick={() => {
                                    setSelectedPlan(plan);
                                    setForm({ ...form, selectedPlansTotal: plan.baseRate });
                                }}
                                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${selectedPlan?._id === plan._id
                                    ? 'border-orange-500 bg-orange-500/5'
                                    : (isDarkMode ? 'bg-[#1e1e1e] border-white/5 hover:border-white/20' : 'bg-white border-gray-100 hover:border-orange-200 shadow-sm')
                                    }`}
                            >
                                {selectedPlan?._id === plan._id && (
                                    <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                        <Check size={14} strokeWidth={4} />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className={`text-xs font-black uppercase tracking-widest ${selectedPlan?._id === plan._id ? 'text-orange-500' : 'text-gray-400'}`}>
                                        {plan.activity}
                                    </p>
                                    <h4 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>{plan.name}</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-xl font-black ${selectedPlan?._id === plan._id ? 'text-orange-500' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                                            ₹{plan.baseRate}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">/ {plan.durationValue} {plan.durationType}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Previous Member Info (Simplified) */}
                    {memberData && (
                        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                <History size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active Plan</p>
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{memberData.packageName || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Summary & Payment */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border sticky top-6 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-lg'}`}>
                        <h3 className={`text-sm font-black uppercase tracking-wider mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Payment Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-500">Plan Amount</span>
                                <span>₹{(form.selectedPlansTotal || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-500">Discount (₹)</span>
                                <input
                                    type="number"
                                    value={form.totalDiscount}
                                    onChange={(e) => setForm({ ...form, totalDiscount: e.target.value })}
                                    className={`w-20 px-2 py-1 text-right rounded-lg border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>

                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Apply Taxes</span>
                                <input
                                    type="checkbox"
                                    checked={form.applyTaxes}
                                    onChange={(e) => setForm({ ...form, applyTaxes: e.target.checked })}
                                    className="w-4 h-4 rounded accent-orange-500"
                                />
                            </div>

                            <div className="pt-4 border-t dark:border-white/10 border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-black uppercase tracking-wider text-gray-400">Total Payable</span>
                                <span className="text-2xl font-black text-orange-500">₹{payableAmount}</span>
                            </div>

                            <div className="space-y-2 pt-4">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Payment Mode</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Online', 'Cash', 'Card', 'Other'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setForm({ ...form, paymentMethod: method })}
                                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${form.paymentMethod === method
                                                ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                                                : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600')
                                                }`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={isLoading || !selectedPlan}
                            onClick={handleSubmit}
                            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 text-[13px] uppercase tracking-wider disabled:opacity-30"
                        >
                            {isLoading ? 'Wait...' : 'Complete Renewal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RenewPlan;
