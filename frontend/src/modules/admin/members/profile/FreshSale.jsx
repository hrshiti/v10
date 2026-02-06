import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { ChevronDown, Upload, Trash2, Plus } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const FreshSale = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const { memberName, id, memberId, memberMobile, memberEmail } = context || {};

    const [activeTab, setActiveTab] = useState('General Training');
    const tabs = ['General Training', 'Personal Training', 'Complete Fitness', 'Group EX'];

    const [packages, setPackages] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [selectedPlans, setSelectedPlans] = useState([]); // Array of { packageId, trainerId, cost, startDate }

    const [form, setForm] = useState({
        clientId: memberId || '',
        mobile: memberMobile || '',
        email: (memberEmail && memberEmail !== '-') ? memberEmail : '',
        emergencyName: '',
        emergencyNumber: '',
        aadharNo: '',
        gstin: '',
        firmName: '',
        firmEmployeeName: '',
        firmAddress: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        paymentDate: new Date().toISOString().split('T')[0],
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
        paymentSubMethod: 'Google Pay',
        bankName: '',
        chequeNumber: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const [pkgRes, trainerRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/packages`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const pkgData = await pkgRes.json();
                const trainerData = await trainerRes.json();

                setPackages(Array.isArray(pkgData) ? pkgData : []);
                setTrainers(Array.isArray(trainerData) ? trainerData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const filteredPackages = packages.filter(pkg => {
        if (!pkg.active) return false;
        const tabLower = activeTab.toLowerCase();
        if (tabLower.includes('general')) return pkg.type === 'general' || pkg.activity === 'gym';
        if (tabLower.includes('personal')) return pkg.type === 'pt';
        if (tabLower.includes('complete')) return pkg.type === 'general';
        if (tabLower.includes('group')) return ['zumba', 'yoga', 'crossfit'].includes(pkg.activity);
        return false;
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const [showPaymentSubDropdown, setShowPaymentSubDropdown] = useState(false);
    const [trainerDropdownRowIdx, setTrainerDropdownRowIdx] = useState(null);
    const taxDropdownRef = useRef(null);
    const paymentDropdownRef = useRef(null);
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);

    const handleTogglePlan = (pkg) => {
        const index = selectedPlans.findIndex(item => item.packageId === pkg._id);
        if (index > -1) {
            const newPlans = selectedPlans.filter(item => item.packageId !== pkg._id);
            setSelectedPlans(newPlans);
        } else {
            setSelectedPlans([...selectedPlans, {
                packageId: pkg._id,
                name: pkg.name,
                membershipType: activeTab === 'Personal Training' ? 'Personal Training' : 'General Training',
                durationValue: pkg.durationValue,
                durationType: pkg.durationType,
                cost: pkg.baseRate,
                trainerId: '',
                startDate: new Date().toISOString().split('T')[0]
            }]);
        }
    };

    const handleTrainerSelect = (pkgId, trainerId) => {
        const newPlans = selectedPlans.map(item =>
            item.packageId === pkgId ? { ...item, trainerId } : item
        );
        setSelectedPlans(newPlans);
        setTrainerDropdownRowIdx(null);
    };

    const handlePlanStartDateChange = (pkgId, date) => {
        const newPlans = selectedPlans.map(item =>
            item.packageId === pkgId ? { ...item, startDate: date } : item
        );
        setSelectedPlans(newPlans);
    };

    // Recalculate totals whenever selectedPlans or form fields change
    useEffect(() => {
        const plansTotal = selectedPlans.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
        const subtotal = plansTotal + (parseFloat(form.surcharges) || 0) - (parseFloat(form.totalDiscount) || 0);

        const taxAmount = form.applyTaxes ? (subtotal * form.taxPercentage / 100) : 0;
        const total = subtotal + taxAmount;

        setForm(prev => ({
            ...prev,
            selectedPlansTotal: plansTotal,
            subtotal: subtotal,
            payableAmount: total,
            totalAmount: total,
            remainingAmount: Math.max(0, total - parseFloat(prev.amountPaid || 0))
        }));
    }, [selectedPlans, form.totalDiscount, form.surcharges, form.applyTaxes, form.taxPercentage, form.amountPaid]);

    const calculateTaxes = () => {
        const base = form.subtotal;
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
            if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target)) setShowPaymentSubDropdown(false);
            if (trainerDropdownRowIdx !== null) setTrainerDropdownRowIdx(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [trainerDropdownRowIdx]);

    const InputField = ({ label, value, placeholder, type = "text", required = false, onChange, readonly = false }) => (
        <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
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
        </div>
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (selectedPlans.length === 0) {
            alert('Please select at least one plan');
            return;
        }

        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const payload = {
                memberId: id,
                selectedPlans: selectedPlans,
                totalAmount: form.payableAmount,
                subTotal: form.subtotal,
                taxAmount: form.applyTaxes ? (form.subtotal * form.taxPercentage / 100) : 0,
                paidAmount: form.amountPaid,
                discount: form.totalDiscount,
                paymentMethod: form.paymentMethod,
                comment: form.comment,
                closedBy: adminInfo?._id
            };

            const res = await fetch(`${API_BASE_URL}/api/admin/members/sale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                alert('Sale processed successfully!');
                window.history.back();
            } else {
                alert(data.message || 'Error processing sale');
            }
        } catch (error) {
            console.error('Error submitting sale:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <InputField label="Client ID" value={form.clientId} readonly />
                <InputField label="Mobile Number" value={form.mobile} readonly />
                <InputField label="Email Address" value={form.email} readonly />
                <InputField label="Emergency Contact Name" placeholder="Name" value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
                <InputField label="Emergency Contact Number" placeholder="0987654321" value={form.emergencyNumber} onChange={(e) => setForm({ ...form, emergencyNumber: e.target.value })} />
                <InputField label="Adhar No." placeholder="0987654321" value={form.aadharNo} onChange={(e) => setForm({ ...form, aadharNo: e.target.value })} />
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
                        ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500'
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
                            {isLoadingData ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading plans...</td>
                                </tr>
                            ) : filteredPackages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No plans found for this category</td>
                                </tr>
                            ) : filteredPackages.map((pkg, idx) => {
                                const selectedPlan = selectedPlans.find(p => p.packageId === pkg._id);
                                const isSelected = !!selectedPlan;
                                const selectedTrainer = trainers.find(t => t._id === selectedPlan?.trainerId);

                                return (
                                    <tr key={pkg._id} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-gray-50'} ${isSelected ? (isDarkMode ? 'bg-orange-500/5' : 'bg-orange-50') : ''}`}>
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            <div
                                                onClick={() => handleTogglePlan(pkg)}
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${isSelected ? 'border-orange-500' : 'border-gray-300'}`}
                                            >
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                            </div>
                                            <span className={isSelected ? 'text-orange-500 font-black' : ''}>{pkg.name}</span>
                                        </td>
                                        <td className="px-6 py-4">{pkg.durationValue} {pkg.durationType}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <button
                                                    disabled={!isSelected}
                                                    onClick={(e) => { e.stopPropagation(); setTrainerDropdownRowIdx(idx); }}
                                                    className={`flex items-center justify-between px-3 py-1.5 border rounded-lg w-44 transition-all ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}
                                                >
                                                    <span className={selectedPlan?.trainerId ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}>
                                                        {selectedPlan?.trainerId ? `${selectedTrainer?.firstName} ${selectedTrainer?.lastName}` : 'Select Trainer'}
                                                    </span>
                                                    <ChevronDown size={14} className="text-gray-400" />
                                                </button>
                                                {trainerDropdownRowIdx === idx && (
                                                    <div className={`absolute left-0 top-full mt-1 w-52 rounded-xl shadow-2xl border z-[70] py-1 overflow-y-auto max-h-48 animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                                        {trainers.map(trainer => (
                                                            <div
                                                                key={trainer._id}
                                                                onClick={(e) => { e.stopPropagation(); handleTrainerSelect(pkg._id, trainer._id); }}
                                                                className={`px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                                            >
                                                                {trainer.firstName} {trainer.lastName}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">₹{pkg.baseRate}</td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="date"
                                                disabled={!isSelected}
                                                value={selectedPlan?.startDate || ''}
                                                onChange={(e) => handlePlanStartDateChange(pkg._id, e.target.value)}
                                                className={`px-2 py-1 rounded border outline-none text-[11px] w-32 ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
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
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Selected Plans Total</span>
                        <span className="text-lg font-bold text-orange-500">₹{parseFloat(form.selectedPlansTotal).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Total Discount</span>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="number"
                                    value={form.totalDiscount}
                                    onChange={(e) => setForm({ ...form, totalDiscount: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Surcharges</span>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="number"
                                    value={form.surcharges}
                                    onChange={(e) => setForm({ ...form, surcharges: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Subtotal</span>
                        <span className="text-lg font-bold">₹{parseFloat(form.subtotal).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Payable Amount</span>
                        <span className="text-lg font-bold text-orange-600">₹{parseFloat(form.payableAmount).toFixed(2)}</span>
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
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setForm(prev => ({ ...prev, amountPaid: prev.totalAmount }))}
                                className="text-[10px] uppercase font-black px-2 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                                Pay Full
                            </button>
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="number"
                                    value={form.amountPaid}
                                    onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase">Remaining Amount</span>
                        <span className="text-lg font-bold">₹{parseFloat(form.remainingAmount).toFixed(2)}</span>
                    </div>

                    <div className={`border rounded-xl p-6 flex flex-col items-start gap-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-xs font-bold text-gray-400">Total Amount</span>
                        <span className="text-4xl font-bold">₹{parseFloat(form.totalAmount).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Submit Section */}
            <div className={`mt-10 p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">I want to make payment and generate invoice</p>
                <button
                    disabled={isSubmitting || selectedPlans.length === 0}
                    onClick={handleSubmit}
                    className="w-full bg-[#f97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase text-[15px] py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 tracking-wider"
                >
                    {isSubmitting ? 'Processing...' : `₹${parseFloat(form.payableAmount).toFixed(2)} Submit`}
                </button>
            </div>
        </div>
    );
};

export default FreshSale;
