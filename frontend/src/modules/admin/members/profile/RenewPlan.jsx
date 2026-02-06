import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Upload, Plus, ArrowLeft, Check } from 'lucide-react';

import { API_BASE_URL } from '../../../../config/api';

const RenewPlan = () => {
    const context = useOutletContext();
    const location = useLocation();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { id, memberName, memberId, memberMobile, memberEmail } = context || {};

    const [activeTab, setActiveTab] = useState(location.state?.category || 'General Training');
    const tabs = ['General Training', 'Personal Training', 'Complete Fitness', 'Group EX'];

    const [packages, setPackages] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
    const subtotalCalc = (parseFloat(form.selectedPlansTotal || 0) + parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0)) - parseFloat(form.totalDiscount || 0);
    const payableAmount = (subtotalCalc + (form.applyTaxes ? parseFloat(taxes.total) : 0)).toFixed(2);
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

            // Calculate End Date
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
                durationMonths: selectedPlan.durationValue, // Backend expects this but we adapt
                startDate: start,
                endDate: end,
                amount: payableAmount,
                subTotal: subtotalCalc,
                taxAmount: form.applyTaxes ? taxes.total : 0,
                paidAmount: form.amountPaid,
                discount: form.totalDiscount,
                paymentMode: form.paymentMethod,
                assignedTrainer: selectedTrainer,
                closedBy: adminInfo?._id // Match backend _id field
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
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                    <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </button>
                <span className="text-orange-500 text-sm font-bold">Members Profile</span>
            </div>

            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Renew Plan</h2>

            {/* Basic Info Form */}
            <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InputField label="Client ID" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
                    <InputField label="Mobile Number" value={form.mobile} required onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                    <InputField label="Email Address" placeholder="Ex : abc@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <InputField label="Emergency Contact Name" placeholder="Name" value={form.emergencyName} onChange={(e) => setForm({ ...form, emergencyName: e.target.value })} />
                    <InputField label="Emergency Contact Number" placeholder="0987654321" value={form.emergencyNumber} onChange={(e) => setForm({ ...form, emergencyNumber: e.target.value })} />
                    <InputField label="Adhar No." placeholder="0987654321" value={form.adharNo} onChange={(e) => setForm({ ...form, adharNo: e.target.value })} />
                    <InputField label="GSTIN No." placeholder="0987654321" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
                    <InputField label="Firm Name" placeholder="Contact Name" value={form.firmName} onChange={(e) => setForm({ ...form, firmName: e.target.value })} />
                    <InputField label="Firm Employee Name" placeholder="Name" value={form.firmEmployeeName} onChange={(e) => setForm({ ...form, firmEmployeeName: e.target.value })} />
                    <div className="space-y-1.5 flex-1">
                        <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Firm Address</label>
                        <textarea
                            placeholder="Type your Address here..."
                            value={form.firmAddress}
                            onChange={(e) => setForm({ ...form, firmAddress: e.target.value })}
                            className={`w-full px-4 py-3 rounded-lg border text-sm h-24 resize-none outline-none transition-all ${isDarkMode
                                ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                                }`}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                    <InputField label="Invoice Date" value={form.invoiceDate} type="date" onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
                    <InputField label="Payment Date" placeholder="dd-mm-yyyy" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
                </div>

                <div className="flex flex-wrap gap-20 mt-8">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pb-4">
                    <input type="file" ref={fileInputRef1} className="hidden" />
                    <div
                        onClick={() => fileInputRef1.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1a1a1a]' : 'border-gray-200 hover:border-gray-300 bg-[#f9f9f9]'}`}
                    >
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                        <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                        <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                    </div>
                    <input type="file" ref={fileInputRef2} className="hidden" />
                    <div
                        onClick={() => fileInputRef2.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1a1a1a]' : 'border-gray-200 hover:border-gray-300 bg-[#f9f9f9]'}`}
                    >
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                        <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                        <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                    </div>
                </div>
            </div>

            {/* Plans Section */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="p-4 border-b dark:border-white/10 border-gray-100 flex items-center justify-between">
                    <button
                        onClick={() => setForm({ ...form, selectedPlansTotal: 0 })}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'}`}
                    >
                        Clear Selected
                    </button>
                </div>
                <div className="p-4 border-b dark:border-white/10 border-gray-100 flex gap-10">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-2 py-3 text-xs font-bold transition-all relative ${activeTab === tab ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Plus size={14} className={activeTab === tab ? '' : 'rotate-45'} />
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full" />}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`text-[12px] font-bold border-b transition-all ${isDarkMode ? 'text-gray-400 border-white/10 bg-white/5' : 'text-gray-600 border-gray-100 bg-gray-50'}`}>
                                <th className="px-8 py-4">Name</th>
                                <th className="px-8 py-4">Duration</th>
                                <th className="px-8 py-4">Trainer</th>
                                <th className="px-8 py-4">Cost</th>
                                <th className="px-8 py-4">Start Date</th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {trainingPlans.map((plan) => (
                                <tr key={plan._id} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5' : 'border-gray-50 hover:bg-gray-50 transition-colors'}`}>
                                    <td className="px-8 py-5 flex items-center gap-5">
                                        <div
                                            onClick={() => {
                                                setSelectedPlan(plan);
                                                setForm({ ...form, selectedPlansTotal: plan.baseRate });
                                            }}
                                            className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${selectedPlan?._id === plan._id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}
                                        >
                                            {selectedPlan?._id === plan._id && <Check size={12} className="text-white" />}
                                        </div>
                                        {plan.name}
                                    </td>
                                    <td className="px-8 py-5 text-gray-400">{plan.durationValue} {plan.durationType}</td>
                                    <td className="px-8 py-5">
                                        <div className="relative" ref={trainerDropdownRef}>
                                            <div
                                                onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
                                                className={`flex items-center justify-between px-4 py-2 border rounded-lg w-48 transition-all cursor-pointer ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-[#f9f9f9]'}`}
                                            >
                                                <span className={selectedTrainer ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}>
                                                    {selectedTrainer ? trainers.find(t => t._id === selectedTrainer)?.firstName + ' ' + trainers.find(t => t._id === selectedTrainer)?.lastName : 'Select Trainer'}
                                                </span>
                                                <ChevronDown size={14} className={`transition-transform duration-200 ${showTrainerDropdown ? 'rotate-180' : ''}`} />
                                            </div>
                                            {showTrainerDropdown && (
                                                <div className={`absolute left-0 top-full mt-1 w-48 rounded-xl shadow-xl border z-[60] py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                                    {trainers.map(t => (
                                                        <div
                                                            key={t._id}
                                                            onClick={() => {
                                                                setSelectedTrainer(t._id);
                                                                setShowTrainerDropdown(false);
                                                            }}
                                                            className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                                                        >
                                                            {t.firstName} {t.lastName}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">₹{plan.baseRate}</td>
                                    <td className="px-8 py-5">
                                        <div className={`flex items-center justify-between px-3 py-2 border rounded-lg w-44 ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-[#f9f9f9]'}`}>
                                            <span className="text-gray-400 text-xs font-bold">{new Date().toLocaleDateString('en-GB')}</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
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

                    <div className="space-y-1.5 pt-4">
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
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Selected Plans Total</span>
                        <span className="text-lg font-bold">₹{(form.selectedPlansTotal || 0).toFixed(2)}</span>
                    </div>

                    {[
                        { label: 'Total Discount', field: 'totalDiscount' },
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
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white font-bold'}`}>
                                    {row.label === 'Surcharges' ? '%' : '₹'}
                                </div>
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

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Amount Paid (₹)</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setForm(prev => ({ ...prev, amountPaid: payableAmount }))}
                                className="text-[10px] uppercase font-black px-2 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                                Pay Full
                            </button>
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="number"
                                    value={form.amountPaid}
                                    onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white font-bold'}`}>₹</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Remaining Amount</span>
                        <span className="text-lg font-black">₹{remainingAmount}</span>
                    </div>

                    <div className={`border rounded-xl p-8 flex flex-col items-start gap-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-5xl font-black">₹{payableAmount}</span>
                    </div>
                </div>
            </div>

            {/* Submit Section */}
            <div className={`mt-10 p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">I want to make payment and generate invoice</p>
                <button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase text-[15px] py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : `₹${payableAmount} Submit`}
                </button>
            </div>
        </div>
    );
};

export default RenewPlan;
