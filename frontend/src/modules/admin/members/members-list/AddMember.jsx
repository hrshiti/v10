import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Calendar, Shield, Package, CreditCard, ChevronDown, CheckCircle, ArrowLeft, Receipt, DollarSign, Clock, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';
import SingleDatePicker from '../../components/SingleDatePicker';

// Date Helpers
const formatISOToDDMMYYYY = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

const formatDDMMYYYYToISO = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [d, m, y] = parts;
    return `${y}-${m}-${d}`;
};

const parseDDMMYYYY = (dateStr) => {
    const [d, m, y] = dateStr.split('-');
    return new Date(y, m - 1, d);
};

const SectionHeader = ({ icon: Icon, title, isDarkMode }) => (
    <div className="flex items-center gap-3 mb-6 pb-2 border-b dark:border-white/10 border-gray-100">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Icon size={20} />
        </div>
        <h3 className={`text-[17px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {title}
        </h3>
    </div>
);

const FormInput = ({ label, icon: Icon, isDarkMode, ...props }) => (
    <div className="space-y-2">
        <label className={`text-[13px] font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {label}
        </label>
        <div className="relative">
            {Icon && <Icon size={18} className="absolute left-4 top-3.5 text-gray-400" />}
            <input
                {...props}
                className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3 rounded-xl border outline-none transition-all text-[15px] font-bold ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500 shadow-sm'
                    }`}
            />
        </div>
    </div>
);

const AddMember = () => {
    const { isDarkMode } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const existingMember = location.state?.member;
    const isExistingMember = !!existingMember;

    const [packages, setPackages] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const [formData, setFormData] = useState({
        firstName: existingMember?.firstName || '',
        lastName: existingMember?.lastName || '',
        mobile: existingMember?.mobile || '',
        email: existingMember?.email || '',
        gender: existingMember?.gender || 'Male',
        dob: existingMember?.dob ? formatISOToDDMMYYYY(existingMember.dob) : '',
        address: existingMember?.address || '',
        emergencyContactName: existingMember?.emergencyContact?.name || '',
        emergencyContactNumber: existingMember?.emergencyContact?.number || '',
        packageName: '',
        packageId: '',
        duration: 0,
        durationType: 'Months',
        durationMonths: 1,
        startDate: formatISOToDDMMYYYY(new Date()),
        endDate: '',
        totalAmount: 0,
        paidAmount: 0,
        discount: 0,
        membershipType: 'General Training',
        assignedTrainer: '',
        closedBy: '',
        paymentMode: 'Cash',
        splitPayment: { cash: 0, online: 0 },
        commitmentDate: '',
        comment: '',
        surchargePercent: 0,
        applyTaxes: false,
        taxPercent: 0
    });

    const netPayable = Number(formData.totalAmount) - Number(formData.discount);
    const dueBalance = netPayable - Number(formData.paidAmount);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const headers = { 'Authorization': `Bearer ${token}` };
                const [pkgRes, trainerRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/packages`, { headers }),
                    fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, { headers })
                ]);

                const pkgData = await pkgRes.json();
                const trainerData = await trainerRes.json();

                setPackages(Array.isArray(pkgData) ? pkgData.filter(p => p.active) : []);
                setTrainers(Array.isArray(trainerData) ? trainerData : []);

                if (adminInfo?._id) {
                    setFormData(prev => ({ ...prev, closedBy: adminInfo._id }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handlePackageChange = (pkgId) => {
        const pkg = packages.find(p => p._id === pkgId);
        if (pkg) {
            setSelectedPackage(pkg);

            // Parse startDate from DD-MM-YYYY format
            let startDate;
            if (formData.startDate && formData.startDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
                startDate = parseDDMMYYYY(formData.startDate);
            } else {
                startDate = new Date();
            }

            const endDate = new Date(startDate);

            if (pkg.durationType === 'Months') {
                endDate.setMonth(endDate.getMonth() + pkg.durationValue);
            } else {
                endDate.setDate(endDate.getDate() + pkg.durationValue);
            }

            setFormData(prev => ({
                ...prev,
                packageName: pkg.name,
                packageId: pkg._id,
                duration: pkg.durationValue,
                durationType: pkg.durationType,
                durationMonths: pkg.durationType === 'Months' ? pkg.durationValue : 0,
                totalAmount: pkg.baseRate,
                paidAmount: pkg.baseRate,
                discount: 0,
                endDate: endDate && !isNaN(endDate.getTime()) ? endDate.toISOString().split('T')[0] : ''
            }));
        }
    };

    const handleStartDateChange = (dateStr) => {
        setFormData(prev => {
            const newFormData = { ...prev, startDate: dateStr };
            if (selectedPackage && dateStr && dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
                const startDate = parseDDMMYYYY(dateStr);
                const endDate = new Date(startDate);
                if (selectedPackage.durationType === 'Months') {
                    endDate.setMonth(endDate.getMonth() + selectedPackage.durationValue);
                } else {
                    endDate.setDate(endDate.getDate() + selectedPackage.durationValue);
                }
                // Validate endDate before calling toISOString
                if (endDate && !isNaN(endDate.getTime())) {
                    newFormData.endDate = endDate.toISOString().split('T')[0];
                }
            }
            return newFormData;
        });
    };

    const handleFinancialChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: Number(value) || 0
        }));
    };

    // Financial calculations
    const totalAmount = Number(formData.totalAmount) || 0;
    const discount = Number(formData.discount) || 0;
    const subtotal = Math.max(0, totalAmount - discount);
    const surchargePercent = Number(formData.surchargePercent) || 0;
    const surchargeAmount = (subtotal * surchargePercent) / 100;
    const amountBeforeTax = subtotal + surchargeAmount;

    const handleSubtotalChange = (val) => {
        const newSubtotal = Number(val) || 0;
        const newDiscount = Math.max(0, totalAmount - newSubtotal);
        setFormData(prev => ({
            ...prev,
            discount: newDiscount
        }));
    };

    // Tax logic
    const taxPercent = formData.applyTaxes ? (Number(formData.taxPercent) || 0) : 0;
    const taxAmount = (amountBeforeTax * taxPercent) / 100;
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;
    const payableAmount = amountBeforeTax + taxAmount;
    const remainingAmount = payableAmount - (Number(formData.paidAmount) || 0);


    // Auto-sync paidAmount with subtotal
    useEffect(() => {
        if (selectedPackage) {
            setFormData(prev => ({ ...prev, paidAmount: subtotal }));
        }
    }, [subtotal, !!selectedPackage]);

    // Auto-sync split payment when paidAmount changes
    useEffect(() => {
        if (formData.paymentMode === 'Split') {
            const currentTotal = formData.splitPayment.cash + formData.splitPayment.online;
            if (currentTotal !== formData.paidAmount) {
                setFormData(prev => ({
                    ...prev,
                    splitPayment: { cash: prev.paidAmount, online: 0 }
                }));
            }
        }
    }, [formData.paidAmount, formData.paymentMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!formData.packageId) {
            alert('Please select a membership package');
            return;
        }

        // Validation: Trainer mandatory for Personal Training
        if (formData.membershipType === 'Personal Training' && !formData.assignedTrainer) {
            alert('Please assign a trainer for Personal Training');
            return;
        }

        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) throw new Error('Authentication required');

            let url = `${API_BASE_URL}/api/admin/members`;
            let method = 'POST';
            let payload;

            if (isExistingMember) {
                // Existing Member -> Create Fresh Sale
                url = `${API_BASE_URL}/api/admin/members/sale`;
                payload = {
                    memberId: existingMember._id,
                    selectedPlans: [
                        {
                            packageId: formData.packageId,
                            name: formData.packageName,
                            membershipType: formData.membershipType,
                            durationValue: formData.duration,
                            durationType: formData.durationType,
                            cost: totalAmount, // Original plan cost
                            trainerId: formData.assignedTrainer || null,
                            startDate: formatDDMMYYYYToISO(formData.startDate)
                        }
                    ],
                    totalAmount: payableAmount,
                    subTotal: amountBeforeTax,
                    taxAmount: taxAmount,
                    paidAmount: Number(formData.paidAmount),
                    discount: Number(formData.discount),
                    paymentMethod: formData.paymentMode,
                    commitmentDate: formatDDMMYYYYToISO(formData.commitmentDate),
                    comment: formData.comment || `Resale: ${formData.packageName}`,
                    closedBy: formData.closedBy || adminInfo?._id,
                    splitPayment: formData.paymentMode === 'Split' ? formData.splitPayment : { cash: 0, online: 0 }
                };
            } else {
                // New Member -> Create Member
                payload = {
                    ...formData,
                    dob: formatDDMMYYYYToISO(formData.dob),
                    startDate: formatDDMMYYYYToISO(formData.startDate),
                    commitmentDate: formatDDMMYYYYToISO(formData.commitmentDate),
                    totalAmount: payableAmount,
                    subTotal: amountBeforeTax,
                    taxAmount: taxAmount
                };

                // Remove assignedTrainer if empty to prevent ObjectId cast error
                if (!payload.assignedTrainer || payload.assignedTrainer === '') {
                    delete payload.assignedTrainer;
                }
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                alert(isExistingMember ? 'Sale processed successfully!' : 'Member created successfully!');
                navigate(isExistingMember ? `/admin/members/profile/${existingMember._id}` : '/admin/members/list');
            } else {
                alert(data.message || 'Error processing request');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="max-w-[1400px] mx-auto space-y-8 pb-20 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 size={48} className="animate-spin text-orange-500 mx-auto" />
                    <p className={`text-[15px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Loading member registration form...
                    </p>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-[28px] font-black tracking-tight">{isExistingMember ? 'ADD NEW SALE' : 'NEW MEMBER ENTRY'}</h1>
                    <p className="text-orange-500 text-xs font-black uppercase tracking-[2px]">{isExistingMember ? `FOR ${existingMember.firstName} ${existingMember.lastName}` : 'Registration Portal'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                <div className="lg:col-span-8 space-y-8">
                    {/* Personal Information Card */}
                    <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] shadow-2xl shadow-black/50' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                        <SectionHeader icon={User} title="Member Registration" isDarkMode={isDarkMode} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="First Name*"
                                placeholder="First Name"
                                required
                                readOnly={isExistingMember}
                                isDarkMode={isDarkMode}
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            <FormInput
                                label="Last Name*"
                                placeholder="Last Name"
                                required
                                readOnly={isExistingMember}
                                isDarkMode={isDarkMode}
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                            <FormInput
                                label="Mobile Number*"
                                icon={Phone}
                                placeholder="Mobile No."
                                required
                                readOnly={isExistingMember}
                                isDarkMode={isDarkMode}
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                            <FormInput
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="Email"
                                readOnly={isExistingMember}
                                isDarkMode={isDarkMode}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className={`text-[12px] font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</label>
                                <div className="flex gap-4">
                                    {['Male', 'Female'].map(g => (
                                        <label key={g} className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                className="hidden"
                                                name="gender"
                                                checked={formData.gender === g}
                                                onChange={() => setFormData({ ...formData, gender: g })}
                                            />
                                            <div className={`py-2.5 text-center rounded-lg border font-bold text-sm transition-all ${formData.gender === g
                                                ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                                                : (isDarkMode ? 'bg-black/20 border-white/5 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500')
                                                }`}>
                                                {g}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[13px] font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <SingleDatePicker
                                        value={formData.dob}
                                        onSelect={(val) => setFormData({ ...formData, dob: val })}
                                        isDarkMode={isDarkMode}
                                        placeholder="DD-MM-YYYY"
                                        minYear={1950}
                                        maxYear={new Date().getFullYear()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NEW: Package Selection Table with Tabs (Matching Image 2) */}
                    <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] shadow-2xl border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
                        {/* Tabs Header */}
                        <div className={`flex border-b overflow-x-auto custom-scrollbar-hide ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                            {['General Training', 'Personal Training', 'Complete Fitness', 'Group EX'].map(tab => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, membershipType: tab }))}
                                    className={`px-8 py-4 text-[13px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${formData.membershipType === tab
                                        ? 'border-orange-500 text-orange-500 bg-white/5'
                                        : 'border-transparent text-gray-400 hover:text-gray-500'
                                        }`}
                                >
                                    <Package size={16} />
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
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4">Trainer</th>
                                            <th className="px-6 py-4">Cost</th>
                                            <th className="px-6 py-4">Start Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-white/5 divide-gray-50">
                                        {packages
                                            .filter(pkg => {
                                                if (formData.membershipType === 'General Training') return pkg.type === 'general' && pkg.activity === 'gym';
                                                if (formData.membershipType === 'Personal Training') return pkg.type === 'pt';
                                                if (formData.membershipType === 'Complete Fitness') return pkg.type === 'general' && ['yoga', 'zumba', 'crossfit'].includes(pkg.activity);
                                                if (formData.membershipType === 'Group EX') return ['zumba', 'yoga', 'crossfit'].includes(pkg.activity);
                                                return false;
                                            })
                                            .map(pkg => (
                                                <tr
                                                    key={pkg._id}
                                                    className={`group cursor-pointer transition-colors ${formData.packageId === pkg._id ? (isDarkMode ? 'bg-orange-500/5' : 'bg-orange-50') : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50/50')}`}
                                                    onClick={() => handlePackageChange(pkg._id)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.packageId === pkg._id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                                            {formData.packageId === pkg._id && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
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
                                                            disabled={formData.packageId !== pkg._id}
                                                            className={`bg-white dark:bg-transparent border dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none appearance-none transition-all pr-8 relative disabled:opacity-30 ${isDarkMode ? 'text-white border-white/10' : 'text-gray-800 border-gray-200 shadow-sm'}`}
                                                            value={formData.packageId === pkg._id ? formData.assignedTrainer : ''}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, assignedTrainer: e.target.value }))}
                                                        >
                                                            <option value="">Select Trainer</option>
                                                            {trainers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-[14px] font-black text-gray-900 dark:text-gray-200">
                                                        {pkg.baseRate}
                                                    </td>
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <SingleDatePicker
                                                            value={formData.packageId === pkg._id ? formData.startDate : ''}
                                                            onSelect={(val) => handleStartDateChange(val)}
                                                            isDarkMode={isDarkMode}
                                                            disabled={formData.packageId !== pkg._id}
                                                            placeholder="DD-MM-YYYY"
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

                {/* Right Side: Payment & Financials (Matching Image 1) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Payment Mode Selection */}
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] shadow-2xl border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
                        <div className="flex flex-wrap gap-4 mb-6">
                            {['Online', 'Wallet', 'Cheque', 'Cash', 'Other'].map(mode => (
                                <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        className="hidden"
                                        name="paymentMode"
                                        checked={formData.paymentMode === mode}
                                        onChange={() => setFormData({ ...formData, paymentMode: mode })}
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMode === mode ? 'border-orange-500' : 'border-gray-400'}`}>
                                        {formData.paymentMode === mode && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                    </div>
                                    <span className={`text-[13px] font-bold ${formData.paymentMode === mode ? 'text-orange-500' : 'text-gray-500'}`}>{mode}</span>
                                </label>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[12px] font-black uppercase text-gray-400">Comment</label>
                            <textarea
                                className={`w-full p-4 rounded-xl border outline-none text-sm font-bold h-24 resize-none transition-all ${isDarkMode ? 'bg-black/20 border-white/10 focus:border-orange-500/50 text-white' : 'bg-gray-50 border-gray-100 focus:border-orange-500 text-gray-800'}`}
                                placeholder="Comment"
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Financial Calculations (Right Column) */}
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] shadow-2xl border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[13px] font-bold text-gray-500">
                                <span>Selected Plans Total</span>
                                <span className="font-black">₹{totalAmount.toFixed(2)}</span>
                            </div>

                            <FinancialInput
                                label="Total Discount"
                                value={formData.discount}
                                suffix="₹"
                                onChange={(val) => handleFinancialChange('discount', val)}
                                isDarkMode={isDarkMode}
                            />

                            <FinancialInput
                                label="Subtotal"
                                value={subtotal}
                                suffix="₹"
                                onChange={(val) => handleSubtotalChange(val)}
                                isDarkMode={isDarkMode}
                            />

                            <FinancialInput
                                label="Surcharges"
                                value={formData.surchargePercent}
                                suffix="%"
                                onChange={(val) => setFormData(prev => ({ ...prev, surchargePercent: val }))}
                                isDarkMode={isDarkMode}
                            />

                            <div className="flex justify-between items-center pt-2 text-[14px] font-black uppercase tracking-tight">
                                <span>Payable Amount</span>
                                <span className="text-orange-500">₹{payableAmount.toFixed(2)}</span>
                            </div>

                            {/* Taxes Block */}
                            <div className={`mt-4 rounded-xl border p-4 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded accent-orange-500"
                                            checked={formData.applyTaxes}
                                            onChange={(e) => setFormData({ ...formData, applyTaxes: e.target.checked })}
                                        />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Apply Taxes*</span>
                                    </label>
                                    <select
                                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-black outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white' : 'bg-white border-gray-200 text-gray-600'}`}
                                        value={formData.taxPercent}
                                        onChange={(e) => setFormData({ ...formData, taxPercent: e.target.value })}
                                        disabled={!formData.applyTaxes}
                                    >
                                        <option value="0">Select Tax</option>
                                        <option value="5">GST 5%</option>
                                        <option value="12">GST 12%</option>
                                        <option value="18">GST 18%</option>
                                    </select>
                                </div>

                                <div className="space-y-2 text-[11px] font-bold text-gray-500">
                                    <div className="flex justify-between">
                                        <span>CGST ({(taxPercent / 2).toFixed(1)}%)</span>
                                        <span>₹{cgst.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SGST ({(taxPercent / 2).toFixed(1)}%)</span>
                                        <span>₹{sgst.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mt-3 pt-3 border-t dark:border-white/5 border-gray-200 font-black text-gray-900 dark:text-gray-200">
                                        <span>Total Taxes (₹)</span>
                                        <span>₹{taxAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <FinancialInput
                                label="Amount Paid (₹)"
                                value={formData.paidAmount}
                                suffix="₹"
                                onChange={(val) => setFormData(prev => ({ ...prev, paidAmount: val }))}
                                highlight
                                isDarkMode={isDarkMode}
                            />

                            <div className={`p-4 rounded-xl flex justify-between items-center transition-all ${remainingAmount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                <span className="text-[10px] font-black uppercase tracking-wider">Remaining Amount</span>
                                <span className="text-sm font-black">₹{remainingAmount.toFixed(2)}</span>
                            </div>

                            {remainingAmount > 0 && (
                                <div className="animate-in slide-in-from-top-2 duration-300 pt-2 space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400">Commitment Date*</label>
                                    <div className="relative">
                                        <SingleDatePicker
                                            value={formData.commitmentDate}
                                            onSelect={(val) => setFormData({ ...formData, commitmentDate: val })}
                                            isDarkMode={isDarkMode}
                                            placeholder="DD-MM-YYYY"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#f97316] text-white font-black uppercase tracking-[2px] text-[13px] py-4 rounded-xl shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            {isExistingMember ? 'Complete Purchase' : 'Save & Create Profile'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full mt-3 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-orange-500 py-2 transition-all"
                                >
                                    Discard Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

// Helper Components
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

export default AddMember;
