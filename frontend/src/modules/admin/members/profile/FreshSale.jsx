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
        commitmentDate: '',
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
        const baseSubtotal = plansTotal + (parseFloat(form.surcharges) || 0);
        const discountedSubtotal = baseSubtotal - (parseFloat(form.totalDiscount) || 0);

        const taxAmount = form.applyTaxes ? (discountedSubtotal * form.taxPercentage / 100) : 0;
        const total = discountedSubtotal + taxAmount;

        setForm(prev => ({
            ...prev,
            selectedPlansTotal: plansTotal,
            subtotal: baseSubtotal,
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
                totalAmount: Number(form.subtotal) + Number(form.applyTaxes ? ((form.subtotal - form.totalDiscount) * form.taxPercentage / 100) : 0),
                subTotal: form.subtotal,
                taxAmount: form.applyTaxes ? ((form.subtotal - form.totalDiscount) * form.taxPercentage / 100) : 0,
                paidAmount: form.amountPaid,
                discount: Number(form.totalDiscount) || 0,
                paymentMethod: form.paymentMethod,
                commitmentDate: form.commitmentDate,
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
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <Plus size={20} className={`rotate-45 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                    </button>
                    <div>
                        <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-tight`}>Fresh Registration</h2>
                        <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">{memberName} • {memberId}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Category Selector */}
                    <div className={`p-3 rounded-2xl border flex gap-2 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === tab
                                    ? 'bg-orange-500 text-white'
                                    : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500')
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isLoadingData ? (
                            <div className="col-span-2 py-10 text-center font-bold text-gray-400 uppercase tracking-widest">Loading Plans...</div>
                        ) : filteredPackages.map((pkg) => {
                            const isSelected = selectedPlans.some(p => p.packageId === pkg._id);
                            const planDetails = selectedPlans.find(p => p.packageId === pkg._id);

                            return (
                                <div
                                    key={pkg._id}
                                    onClick={() => handleTogglePlan(pkg)}
                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${isSelected
                                        ? 'border-orange-500 bg-orange-500/5'
                                        : (isDarkMode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100 shadow-sm')
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                            <Trash2 size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                    <h4 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 mb-3">{pkg.durationValue} {pkg.durationType}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-lg font-black text-orange-500">₹{pkg.baseRate}</span>
                                        {isSelected && (
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={`text-[10px] font-black uppercase px-2 py-1 rounded border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f9f9f9] border-gray-200'}`}
                                                    value={planDetails?.trainerId || ''}
                                                    onChange={(e) => handleTrainerSelect(pkg._id, e.target.value)}
                                                >
                                                    <option value="">No Trainer</option>
                                                    {trainers.map(t => <option key={t._id} value={t._id}>{t.firstName}</option>)}
                                                </select>
                                                <input
                                                    type="date"
                                                    onClick={(e) => e.stopPropagation()}
                                                    value={planDetails?.startDate || ''}
                                                    onChange={(e) => handlePlanStartDateChange(pkg._id, e.target.value)}
                                                    className={`text-[10px] font-black px-2 py-1 rounded border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f9f9f9] border-gray-200'}`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Simplified Payment Summary */}
                <div className={`p-6 rounded-2xl border h-fit sticky top-6 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-lg'}`}>
                    <h3 className={`text-xs font-black uppercase tracking-wider mb-6 text-gray-400`}>Direct Payment</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Plan(s) Total</span>
                            <span className="text-gray-900 dark:text-white font-black">₹{form.selectedPlansTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Discount</span>
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <span className="px-2 text-xs text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={form.totalDiscount}
                                    onChange={(e) => setForm({ ...form, totalDiscount: e.target.value })}
                                    className="w-20 px-2 py-1.5 bg-transparent outline-none text-sm font-bold text-right"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Taxes (%)</span>
                            <select
                                value={form.taxPercentage}
                                onChange={(e) => setForm({ ...form, taxPercentage: e.target.value, applyTaxes: true })}
                                className={`px-2 py-1 rounded border outline-none text-xs font-bold ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <option value="0">0%</option>
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                            </select>
                        </div>

                        {form.applyTaxes && Number(form.taxPercentage) > 0 && (
                            <div className="space-y-1 mt-1 px-3 py-2 rounded-lg border border-dashed border-orange-500/20 bg-orange-500/5">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                    <span>CGST ({taxes.cgstPerc}%)</span>
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>₹{taxes.cgst}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                    <span>SGST ({taxes.sgstPerc}%)</span>
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>₹{taxes.sgst}</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Final Payable</p>
                            <p className="text-3xl font-black text-orange-600">₹{form.payableAmount.toFixed(2)}</p>
                        </div>

                        <div className="pt-4 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-500">Amount Paid</span>
                                <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <span className="px-2 text-xs text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        value={form.amountPaid}
                                        onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                                        className="w-20 px-2 py-1.5 bg-transparent outline-none text-sm font-bold text-right"
                                    />
                                </div>
                            </div>

                            {form.remainingAmount > 0 && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Commitment Date</p>
                                    <input
                                        type="date"
                                        value={form.commitmentDate}
                                        onChange={(e) => setForm({ ...form, commitmentDate: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border text-[11px] font-bold outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200'}`}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-2">
                                {['Cash', 'UPI / Online', 'Debit / Credit Card', 'Cheque'].map(method => (
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
                        </div>

                        <div className="pt-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Remarks (Optional)</label>
                            <textarea
                                value={form.comment}
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                className={`w-full p-3 rounded-xl border text-[11px] font-bold h-20 resize-none outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>

                        <button
                            disabled={isSubmitting || selectedPlans.length === 0}
                            onClick={handleSubmit}
                            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-600/20 transition-all active:scale-95 text-[13px] uppercase tracking-wider disabled:opacity-30"
                        >
                            {isSubmitting ? 'Processing...' : 'Complete Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FreshSale;
