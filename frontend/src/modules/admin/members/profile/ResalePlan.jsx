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
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                    <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </button>
                <span className="text-orange-500 text-sm font-bold">Members Profile</span>
            </div>

            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Resale Plan</h2>

            {/* Basic Info Form */}
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
                        className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all h-24 resize-none ${isDarkMode
                            ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50'
                            : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500'
                            }`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputField label="Invoice Date" value={form.invoiceDate} type="date" onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
                <InputField label="Payment Date" placeholder="dd-mm-yyyy" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
            </div>

            {/* Radio Options & Uploads */}
            <div className="flex gap-20">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="file" ref={fileInputRef1} className="hidden" />
                <div
                    onClick={() => fileInputRef1.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1e1e1e]' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                    <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                    <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                </div>
                <input type="file" ref={fileInputRef2} className="hidden" />
                <div
                    onClick={() => fileInputRef2.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1e1e1e]' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                    <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                    <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                </div>
            </div>

            {/* Plans Section */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="p-4 border-b dark:border-white/10 border-gray-100 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'}`}>Clear Selected</button>
                    </div>
                </div>
                <div className="p-4 border-b dark:border-white/10 border-gray-100 flex gap-10">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-2 py-3 text-xs font-bold transition-all relative ${activeTab === tab ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
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
                                        <div className={`w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer`} />
                                        {plan.name}
                                    </td>
                                    <td className="px-8 py-5">{plan.duration}</td>
                                    <td className="px-8 py-5">
                                        <div className="relative" ref={trainerRef}>
                                            <div
                                                onClick={() => setOpenTrainerDropdownIdx(openTrainerDropdownIdx === idx ? null : idx)}
                                                className={`flex items-center justify-between px-4 py-2 border rounded-lg w-48 cursor-pointer ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-[#f9f9f9]'}`}
                                            >
                                                <span className={selectedTrainer ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}>
                                                    {selectedTrainer ? (trainers.find(t => t._id === selectedTrainer)?.firstName + ' ' + trainers.find(t => t._id === selectedTrainer)?.lastName) : 'Select Trainer'}
                                                </span>
                                                <ChevronDown size={14} />
                                            </div>
                                            {openTrainerDropdownIdx === idx && (
                                                <div className={`absolute left-0 top-full mt-1 w-48 rounded-xl shadow-xl border z-[60] py-1 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                                                    {trainers.map(t => (
                                                        <div
                                                            key={t._id}
                                                            onClick={() => {
                                                                setSelectedTrainer(t._id);
                                                                setOpenTrainerDropdownIdx(null);
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
                                    <td className="px-8 py-5">{plan.cost}</td>
                                    <td className="px-8 py-5">
                                        <div className={`flex items-center justify-between px-3 py-2 border rounded-lg w-44 ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-[#f9f9f9]'}`}>
                                            <span className="text-gray-400 text-xs font-bold">dd-mm-yyyy</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment & Summary Row */}
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
                            className={`w-full px-4 py-3 rounded-lg border text-sm h-32 resize-none outline-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50' : 'bg-white border-gray-200 focus:border-orange-500'}`}
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    {[
                        { label: 'Selected Plans Total', value: '₹0.00' },
                        { label: 'Total Discount', field: 'totalDiscount' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{row.label}</span>
                            {row.field ? (
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                        <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                        <input
                                            type="text"
                                            value={form[row.field]}
                                            onChange={(e) => setForm({ ...form, [row.field]: e.target.value })}
                                            className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                        />
                                    </div>
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>₹</div>
                                </div>
                            ) : (
                                <span className="text-lg font-bold">{row.value}</span>
                            )}
                        </div>
                    ))}

                    {/* Tax Section - Matching Image 1 */}
                    <div className={`border rounded-xl p-5 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
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

                    {[
                        { label: 'Subtotal', field: 'subtotal' },
                        { label: 'Surcharges', field: 'surcharges' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{row.label}</span>
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                    <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                    <input
                                        type="text"
                                        value={form[row.field]}
                                        onChange={(e) => setForm({ ...form, [row.field]: e.target.value })}
                                        className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                    />
                                </div>
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>{row.label === 'Surcharges' ? '%' : '₹'}</div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Payable Amount</span>
                        <span className="text-lg font-black">₹0.00</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Amount Paid (₹)</span>
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f4f4f4] border-gray-100'}`}>
                                <span className="px-3 text-gray-400 font-bold border-r dark:border-white/10 border-gray-200">₹</span>
                                <input
                                    type="text"
                                    value={form.amountPaid}
                                    onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                                    className="w-24 px-3 py-1.5 bg-transparent outline-none text-sm font-bold"
                                />
                            </div>
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-400 text-white'}`}>₹</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Remaining Amount</span>
                        <span className="text-lg font-black">₹0.00</span>
                    </div>

                    <div className={`border rounded-xl p-8 flex flex-col items-start gap-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-5xl font-black">₹0</span>
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
                    ₹0 Submit
                </button>
            </div>
        </div>
    );
};

export default ResalePlan;
