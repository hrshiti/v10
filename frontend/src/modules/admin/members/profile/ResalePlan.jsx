import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ChevronDown, Upload, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const ResalePlan = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const navigate = useNavigate();
    const { memberName, memberId, memberMobile, memberEmail } = context || {};

    const [activeTab, setActiveTab] = useState('General Training');
    const tabs = ['General Training', 'Personal Training', 'Complete Fitness', 'Group EX'];

    const [form, setForm] = useState({
        clientId: memberId || '23456',
        mobile: memberMobile || '9081815118',
        email: memberEmail !== '-' ? memberEmail : '',
        emergencyName: '',
        emergencyNumber: '',
        adharNo: '0987654321',
        gstin: '0987654321',
        firmName: '',
        firmEmployeeName: '',
        firmAddress: '',
        invoiceDate: '2026-02-03',
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
    });

    const [showTaxDropdown, setShowTaxDropdown] = useState(false);
    const taxDropdownRef = useRef(null);
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [openTrainerDropdownIdx, setOpenTrainerDropdownIdx] = useState(null);
    const trainerRef = useRef(null);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const token = adminInfo?.token;
                if (!token) return;

                const res = await fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTrainers(data);
                }
            } catch (error) {
                console.error("Error fetching trainers:", error);
            }
        };
        fetchTrainers();

        const handleClickOutside = (event) => {
            if (trainerRef.current && !trainerRef.current.contains(event.target)) {
                setOpenTrainerDropdownIdx(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const trainingPlans = [
        { name: 'GYM WORKOUT', duration: '1 Month', cost: 2500 },
        { name: 'GYM WORKOUT', duration: '3 Month', cost: 5000 },
        { name: 'GYM WORKOUT', duration: '6 Month', cost: 7000 },
        { name: 'GYM WORKOUT', duration: '12 Month', cost: 9000 },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) setShowTaxDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const InputField = ({ label, value, placeholder, type = "text", required = false, onChange }) => (
        <div className="space-y-1.5 flex-1 min-w-[300px]">
            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
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
                {type === 'date' && <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />}
            </div>
        </div>
    );

    const handleTaxSelect = (val) => {
        setForm({ ...form, taxPercentage: val });
        setShowTaxDropdown(false);
    };

    const calculateTaxes = () => {
        const base = parseFloat(form.subtotal || 0) + parseFloat(form.surcharges || 0);
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
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                    </button>
                    <div>
                        <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-tight`}>Resale Plan</h2>
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
                        {trainingPlans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`p-5 rounded-2xl border-2 transition-all relative ${isDarkMode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
                            >
                                <h4 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 mb-3">{plan.duration}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-black text-orange-500">₹{plan.cost}</span>
                                    <div className="flex flex-col gap-2">
                                        <select
                                            className={`text-[10px] font-black uppercase px-2 py-1 rounded border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f9f9f9] border-gray-200'}`}
                                            value={selectedTrainer}
                                            onChange={(e) => setSelectedTrainer(e.target.value)}
                                        >
                                            <option value="">No Trainer</option>
                                            {trainers.map(t => <option key={t._id} value={t._id}>{t.firstName}</option>)}
                                        </select>
                                        <input
                                            type="date"
                                            className={`text-[10px] font-black px-2 py-1 rounded border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f9f9f9] border-gray-200'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simplified Payment Summary */}
                <div className={`p-6 rounded-2xl border h-fit sticky top-6 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100 shadow-lg'}`}>
                    <h3 className={`text-xs font-black uppercase tracking-wider mb-6 text-gray-400`}>Resale Summary</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Selected Plan</span>
                            <span className="text-gray-900 dark:text-white font-black">₹0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-500">Discount</span>
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <span className="px-2 text-xs text-gray-400">₹</span>
                                <input
                                    type="text"
                                    value={form.totalDiscount}
                                    onChange={(e) => setForm({ ...form, totalDiscount: e.target.value })}
                                    className="w-20 px-2 py-1.5 bg-transparent outline-none text-sm font-bold text-right"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Final Payable</p>
                            <p className="text-3xl font-black text-orange-600">₹0.00</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                            {['Online', 'Cash'].map(method => (
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

                        <div className="pt-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Remarks (Optional)</label>
                            <textarea
                                value={form.comment}
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                className={`w-full p-3 rounded-xl border text-[11px] font-bold h-20 resize-none outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-600/20 transition-all active:scale-95 text-[13px] uppercase tracking-wider"
                        >
                            Complete Resale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResalePlan;
