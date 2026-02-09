import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, Package, CreditCard, ChevronDown, CheckCircle, Shield } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

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

    const [packages, setPackages] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        gender: 'Male',
        dob: '',
        address: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        packageName: '',
        durationMonths: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        totalAmount: 0,
        paidAmount: 0,
        discount: 0,
        membershipType: 'General Training',
        assignedTrainer: '',
        closedBy: '',
        paymentMode: 'Cash',
        commitmentDate: ''
    });

    const netPayable = Number(formData.totalAmount) - Number(formData.discount);
    const dueBalance = netPayable - Number(formData.paidAmount);

    const [selectedPackage, setSelectedPackage] = useState(null);

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
            const startDate = new Date(formData.startDate);
            const endDate = new Date(startDate);

            if (pkg.durationType === 'Months') {
                endDate.setMonth(endDate.getMonth() + pkg.durationValue);
            } else {
                endDate.setDate(endDate.getDate() + pkg.durationValue);
            }

            setFormData(prev => ({
                ...prev,
                packageName: pkg.name,
                durationMonths: pkg.durationType === 'Months' ? pkg.durationValue : 0,
                totalAmount: pkg.baseRate,
                paidAmount: pkg.baseRate,
                discount: 0,
                endDate: endDate.toISOString().split('T')[0]
            }));
        }
    };

    const handleStartDateChange = (dateStr) => {
        setFormData(prev => {
            const newFormData = { ...prev, startDate: dateStr };
            if (selectedPackage) {
                const startDate = new Date(dateStr);
                const endDate = new Date(startDate);
                if (selectedPackage.durationType === 'Months') {
                    endDate.setMonth(endDate.getMonth() + selectedPackage.durationValue);
                } else {
                    endDate.setDate(endDate.getDate() + selectedPackage.durationValue);
                }
                newFormData.endDate = endDate.toISOString().split('T')[0];
            }
            return newFormData;
        });
    };

    const handleFinancialChange = (field, value) => {
        const numValue = value === '' ? 0 : Number(value);
        setFormData(prev => {
            const updated = { ...prev, [field]: numValue };
            // Auto-calculate paidAmount when total or discount changes to keep it fully paid by default
            if (field === 'totalAmount' || field === 'discount') {
                updated.paidAmount = Math.max(0, Number(updated.totalAmount) - Number(updated.discount));
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/admin/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                alert('Member created successfully!');
                navigate('/admin/members/list');
            } else {
                alert(data.message || 'Error creating member');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold">Back</span>
                </button>
                <div className="text-right">
                    <h1 className="text-[28px] font-black tracking-tight">NEW MEMBER ENTRY</h1>
                    <p className="text-orange-500 text-xs font-black uppercase tracking-[2px]">Registration Portal</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-2xl shadow-black/50' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                    <SectionHeader icon={User} title="Personal Details" isDarkMode={isDarkMode} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="First Name*"
                            placeholder="e.g. John"
                            required
                            isDarkMode={isDarkMode}
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <FormInput
                            label="Last Name*"
                            placeholder="e.g. Doe"
                            required
                            isDarkMode={isDarkMode}
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                        <FormInput
                            label="Mobile Number*"
                            icon={Phone}
                            placeholder="Enter 10 digit number"
                            required
                            isDarkMode={isDarkMode}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />
                        <FormInput
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            placeholder="example@mail.com"
                            isDarkMode={isDarkMode}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <div className="space-y-2">
                            <label className={`text-[13px] font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Gender
                            </label>
                            <div className="flex gap-4">
                                {['Male', 'Female', 'Other'].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: g })}
                                        className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${formData.gender === g
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : (isDarkMode ? 'bg-[#111] border-white/10 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-600')
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <FormInput
                            label="Date of Birth"
                            icon={Calendar}
                            type="date"
                            isDarkMode={isDarkMode}
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                        />
                    </div>
                    <div className="mt-6">
                        <FormInput
                            label="Residential Address"
                            icon={MapPin}
                            placeholder="Complete street address"
                            isDarkMode={isDarkMode}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                    <SectionHeader icon={Shield} title="Emergency Support" isDarkMode={isDarkMode} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Contact Name"
                            placeholder="Guardian / Friend Name"
                            isDarkMode={isDarkMode}
                            value={formData.emergencyContactName}
                            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        />
                        <FormInput
                            label="Contact Number"
                            icon={Phone}
                            placeholder="Emergency mobile number"
                            isDarkMode={isDarkMode}
                            value={formData.emergencyContactNumber}
                            onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                        />
                    </div>
                </div>

                {/* Membership & Financials */}
                <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                    <SectionHeader icon={Package} title="Plan & Financials" isDarkMode={isDarkMode} />

                    <div className="mb-8 p-4 rounded-xl border-2 border-dashed dark:border-white/10 border-gray-100">
                        <label className={`text-[13px] font-black uppercase tracking-[2px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-4`}>
                            Select Training Category*
                        </label>
                        <div className="flex gap-4">
                            {['General Training', 'Personal Training'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, membershipType: type })}
                                    className={`flex-1 py-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${formData.membershipType === type
                                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                        : (isDarkMode ? 'bg-[#111] border-white/10 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400')
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`text-[13px] font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Select Membership Package*
                            </label>
                            <div className="relative">
                                <Package size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                <select
                                    className={`w-full pl-12 pr-10 py-3 rounded-xl border outline-none appearance-none transition-all text-[15px] font-bold ${isDarkMode
                                        ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50'
                                        : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500 shadow-sm'
                                        }`}
                                    onChange={(e) => handlePackageChange(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a Package</option>
                                    {packages
                                        .filter(pkg => {
                                            const category = formData.membershipType === 'Personal Training' ? 'pt' : 'general';
                                            return pkg.type === category;
                                        })
                                        .map(pkg => (
                                            <option key={pkg._id} value={pkg._id}>{pkg.name} - ₹{pkg.baseRate}</option>
                                        ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[13px] font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Assign Personal Trainer
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                <select
                                    className={`w-full pl-12 pr-10 py-3 rounded-xl border outline-none appearance-none transition-all text-[15px] font-bold ${isDarkMode
                                        ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50'
                                        : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500 shadow-sm'
                                        }`}
                                    value={formData.assignedTrainer}
                                    onChange={(e) => setFormData({ ...formData, assignedTrainer: e.target.value })}
                                >
                                    <option value="">No Trainer Assigned</option>
                                    {trainers.map(t => (
                                        <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <FormInput
                            label="Start Date*"
                            type="date"
                            required
                            isDarkMode={isDarkMode}
                            value={formData.startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                        />
                        <FormInput
                            label="End Date"
                            type="date"
                            readOnly
                            isDarkMode={isDarkMode}
                            value={formData.endDate}
                        />

                        <FormInput
                            label="Total Amount (₹)"
                            icon={CreditCard}
                            type="number"
                            isDarkMode={isDarkMode}
                            value={formData.totalAmount || ''}
                            onChange={(e) => handleFinancialChange('totalAmount', e.target.value)}
                        />
                        <FormInput
                            label="Discount (₹)"
                            type="number"
                            isDarkMode={isDarkMode}
                            value={formData.discount || ''}
                            onChange={(e) => handleFinancialChange('discount', e.target.value)}
                        />
                        <div className="flex items-end h-full">
                            <div className={`w-full p-4 rounded-xl border border-dashed ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-orange-50/50 border-orange-100 text-orange-600'} flex justify-between items-center`}>
                                <span className="text-xs font-black uppercase tracking-wider">Net Payable</span>
                                <span className="text-[17px] font-black">
                                    ₹{Math.max(0, netPayable)}
                                </span>
                            </div>
                        </div>

                        <FormInput
                            label="Amount Paid (₹)*"
                            icon={CreditCard}
                            type="number"
                            required
                            isDarkMode={isDarkMode}
                            value={formData.paidAmount || ''}
                            onChange={(e) => handleFinancialChange('paidAmount', e.target.value)}
                        />
                        <div className="space-y-2">
                            <label className={`text-[13px] font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Type of Payment*
                            </label>
                            <div className="relative">
                                <CreditCard size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                <select
                                    required
                                    className={`w-full pl-12 pr-10 py-3 rounded-xl border outline-none appearance-none transition-all text-[15px] font-bold ${isDarkMode
                                        ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500/50'
                                        : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500 shadow-sm'
                                        }`}
                                    value={formData.paymentMode}
                                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI / Online</option>
                                    <option value="Card">Debit / Credit Card</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-end h-full">
                            <div className={`w-full p-4 rounded-xl border border-dashed ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'} flex justify-between items-center`}>
                                <span className="text-xs font-black uppercase tracking-wider">Due Balance</span>
                                <span className={`text-[17px] font-black ${dueBalance > 0 ? 'text-red-500' : (dueBalance < 0 ? 'text-blue-500' : 'text-emerald-500')}`}>
                                    {dueBalance < 0 ? `Excess: ₹${Math.abs(dueBalance)}` : `₹${dueBalance}`}
                                </span>
                            </div>
                        </div>

                        {dueBalance > 0 && (
                            <FormInput
                                label="Commitment Date to Pay Due*"
                                icon={Calendar}
                                type="date"
                                required
                                isDarkMode={isDarkMode}
                                value={formData.commitmentDate}
                                onChange={(e) => setFormData({ ...formData, commitmentDate: e.target.value })}
                                onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                            />
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-[2px] text-sm transition-all border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-[2] bg-[#f97316] hover:bg-orange-600 text-white font-black uppercase tracking-[2px] text-sm py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Create Member Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMember;
