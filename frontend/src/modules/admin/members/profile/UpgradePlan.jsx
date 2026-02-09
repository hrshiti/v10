import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Plus, Check, History } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const UpgradePlan = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { id } = useParams();

    const memberName = context?.memberName || '';
    const memberId = context?.memberId || '';
    const memberMobile = context?.memberMobile || '';
    const memberEmail = context?.memberEmail || '';

    const [isLoading, setIsLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [currentSubscription, setCurrentSubscription] = useState(null);

    const [form, setForm] = useState({
        clientId: memberId || '',
        mobile: memberMobile || '',
        email: (memberEmail !== '-' && memberEmail) ? memberEmail : '',
        emergencyName: '',
        emergencyNumber: '',
        gstin: '',
        firmName: '',
        firmEmployeeName: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        firmAddress: '',

        packageName: '-',
        duration: '-',
        totalSessions: '-',
        startDate: '-',
        endDate: '-',
        assignedTrainer: '-',
        paidAmount: 0,

        paymentMethod: 'Online',
        comment: '',
        selectedPlansTotal: 0,
        totalDiscount: 0,
        subtotal: 0,
        surcharges: 0,
        applyTaxes: false,
        taxPercentage: 0,
        amountPaid: 0,
        commitmentDate: ''
    });

    const [activeTab, setActiveTab] = useState('General Training');
    const tabs = ['General Training', 'Personal Training'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const [pkgRes, trainerRes, memberRes, subRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/packages`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/admin/members/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/admin/members/${id}/subscriptions`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (pkgRes.ok) {
                    const pkgData = await pkgRes.json();
                    setPackages(Array.isArray(pkgData) ? pkgData : pkgData.packages || []);
                }
                if (trainerRes.ok) {
                    const trainerData = await trainerRes.json();
                    setTrainers(trainerData.employees || trainerData || []);
                }
                if (memberRes.ok) {
                    const memberData = await memberRes.json();

                    let currentPaidAmount = 0;
                    if (subRes.ok) {
                        const subData = await subRes.json();
                        const currentSub = subData.find(s => s.isCurrent) || subData[0];
                        if (currentSub) {
                            currentPaidAmount = currentSub.paidAmount || 0;
                            setCurrentSubscription(currentSub);
                        }
                    }

                    // Update form with member data
                    setForm(prev => ({
                        ...prev,
                        clientId: memberData.memberId || '',
                        mobile: memberData.mobile || '',
                        email: memberData.email || '',
                        packageName: memberData.packageName || '-',
                        duration: memberData.durationMonths ? `${memberData.durationMonths} Month` : '-',
                        startDate: memberData.startDate ? new Date(memberData.startDate).toLocaleDateString('en-GB') : '-',
                        endDate: memberData.endDate ? new Date(memberData.endDate).toLocaleDateString('en-GB') : '-',
                        assignedTrainer: memberData.assignedTrainer ? `${memberData.assignedTrainer.firstName} ${memberData.assignedTrainer.lastName || ''}` : '-',
                        paidAmount: currentPaidAmount, // Use current plan's paid amount
                    }));

                    if (memberData.assignedTrainer?._id) {
                        setSelectedTrainer(memberData.assignedTrainer._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    const filteredPackages = packages.filter(p => {
        if (!p.active) return false;
        // console.log('Checking package:', p.name, p.type, activeTab);
        if (activeTab === 'General Training') return p.type === 'general';
        if (activeTab === 'Personal Training') return p.type === 'pt';
        return false;
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const taxDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        if (!selectedPlan) {
            alert('Please select a plan to upgrade');
            return;
        }

        setIsLoading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            // Calculate End Date
            const start = new Date(form.invoiceDate);
            const end = new Date(start);
            const duration = selectedPlan.durationValue || selectedPlan.duration;

            if (selectedPlan.durationType === 'Months') {
                end.setMonth(end.getMonth() + duration);
            } else {
                end.setDate(end.getDate() + duration);
            }

            const payload = {
                packageName: selectedPlan.name,
                durationMonths: duration, // Normalize to duration for backend
                startDate: start,
                endDate: end,
                amount: Number(upgradeAmount) + Number(form.applyTaxes ? taxes.total : 0),
                subTotal: upgradeAmount,
                taxAmount: form.applyTaxes ? taxes.total : 0,
                paidAmount: form.amountPaid || payableAmount, // Default to full if not specified
                discount: Number(form.totalDiscount) || 0,
                paymentMode: form.paymentMethod,
                commitmentDate: form.commitmentDate,
                assignedTrainer: selectedTrainer,
                closedBy: adminInfo?._id
            };

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}/upgrade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Membership upgraded successfully');
                navigate(-1);
            } else {
                const data = await res.json();
                alert(data.message || 'Error upgrading membership');
            }
        } catch (error) {
            console.error('Error upgrading membership:', error);
            alert('Failed to upgrade membership');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate upgrade amount (difference between new plan and current paid amount)
    const upgradeAmount = selectedPlan ? Math.max(0, selectedPlan.baseRate - form.paidAmount) : 0;

    // Calculate taxes
    const calculateTaxes = () => {
        const base = upgradeAmount - parseFloat(form.totalDiscount || 0);
        const taxAmount = (base * parseFloat(form.taxPercentage || 0)) / 100;
        const cgst = taxAmount / 2;
        const sgst = taxAmount / 2;
        return {
            cgst: cgst.toFixed(2),
            sgst: sgst.toFixed(2),
            total: taxAmount.toFixed(2),
            cgstPerc: (parseFloat(form.taxPercentage || 0) / 2).toFixed(1),
            sgstPerc: (parseFloat(form.taxPercentage || 0) / 2).toFixed(1)
        };
    };

    const taxes = calculateTaxes();
    const baseSubtotal = upgradeAmount;
    const discountedSubtotal = baseSubtotal - parseFloat(form.totalDiscount || 0);
    const payableAmount = (discountedSubtotal + (form.applyTaxes ? parseFloat(taxes.total) : 0)).toFixed(2);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                    </button>
                    <div>
                        <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-tight`}>Upgrade Plan</h2>
                        <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">{memberName} • {memberId}</p>
                    </div>
                </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Package */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                            <History size={18} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active Membership</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <h3 className={`text-lg font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{form.packageName}</h3>
                        <span className="text-emerald-500 font-black italic text-lg">₹{form.paidAmount}</span>
                    </div>
                </div>

                {/* Target Upgrade Package */}
                <div className={`p-5 rounded-2xl border-2 overflow-hidden relative ${isDarkMode ? 'bg-orange-500/5 border-orange-500/30' : 'bg-orange-50 border-orange-200 shadow-lg'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-orange-500 text-white`}>
                            <Plus size={18} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Upgrade Selection</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <h3 className={`text-lg font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPlan ? selectedPlan.name : 'Choose Plan...'}</h3>
                        <div className="text-right">
                            {selectedPlan && <p className="text-[9px] font-black text-gray-400 line-through uppercase tracking-tighter">New Price: ₹{selectedPlan.baseRate}</p>}
                            <p className="text-xl font-black text-orange-600">₹{upgradeAmount.toFixed(2)} <span className="text-[10px] uppercase text-gray-400">Extra</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Package Selector Pills */}
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
                        {filteredPackages.map((plan) => (
                            <div
                                key={plan._id}
                                onClick={() => {
                                    setSelectedPlan(plan);
                                    setForm({ ...form, selectedPlansTotal: plan.baseRate });
                                }}
                                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedPlan?._id === plan._id
                                    ? 'border-orange-500 bg-orange-500/5'
                                    : (isDarkMode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100 shadow-sm')
                                    }`}
                            >
                                {selectedPlan?._id === plan._id && (
                                    <div className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                                <h4 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 mb-3">{plan.durationValue} {plan.durationType}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-black text-orange-500">₹{plan.baseRate}</span>
                                    <div className="flex items-center gap-2">
                                        <select
                                            onClick={(e) => e.stopPropagation()}
                                            className={`text-[10px] font-black uppercase px-2 py-1 rounded border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f9f9f9] border-gray-200'}`}
                                            value={selectedTrainer}
                                            onChange={(e) => setSelectedTrainer(e.target.value)}
                                        >
                                            <option value="">No Trainer</option>
                                            {trainers.map(t => <option key={t._id} value={t._id}>{t.firstName}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simplified Payment Summary */}
                <div className={`p-6 rounded-2xl border h-fit sticky top-6 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-lg'}`}>
                    <h3 className={`text-xs font-black uppercase tracking-wider mb-6 text-gray-400`}>Pay Difference</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Upgrade (Diff)</span>
                            <span className="text-orange-500 font-black">₹{upgradeAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Extra Discount</span>
                            <input
                                type="number"
                                value={form.totalDiscount}
                                onChange={(e) => setForm({ ...form, totalDiscount: e.target.value })}
                                className={`w-20 px-2 py-1 text-right rounded-lg border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Add Tax (%)</span>
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
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                    <span>CGST ({taxes.cgstPerc}%)</span>
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>₹{taxes.cgst}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                    <span>SGST ({taxes.sgstPerc}%)</span>
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>₹{taxes.sgst}</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Total Upgrade Charge</p>
                            <p className="text-3xl font-black text-orange-600">₹{payableAmount}</p>
                        </div>

                        <div className="pt-4 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-500">Amount Paid</span>
                                <input
                                    type="number"
                                    value={form.amountPaid || payableAmount}
                                    onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                                    className={`w-24 px-2 py-1 text-right rounded-lg border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>

                            {(Number(payableAmount) - (Number(form.amountPaid) || Number(payableAmount))) > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Commitment Date</p>
                                    <input
                                        type="date"
                                        value={form.commitmentDate}
                                        onChange={(e) => setForm({ ...form, commitmentDate: e.target.value })}
                                        className={`w-full px-4 py-2 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-2">
                                {['Cash', 'UPI / Online', 'Debit / Credit Card', 'Cheque'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setForm({ ...form, paymentMethod: method })}
                                        className={`py-2 rounded-xl text-[10px] font-black uppercase border tracking-wider transition-all ${form.paymentMethod === method
                                            ? 'bg-orange-500 border-orange-500 text-white'
                                            : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600')
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={isLoading || !selectedPlan}
                            onClick={handleSubmit}
                            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-600/20 transition-all active:scale-95 text-[13px] uppercase tracking-wider disabled:opacity-30"
                        >
                            {isLoading ? 'Processing...' : 'Complete Upgrade'}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UpgradePlan;
