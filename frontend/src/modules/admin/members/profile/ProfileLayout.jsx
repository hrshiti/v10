import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';
import {
    User,
    CreditCard,
    FileText,
    Dumbbell,
    Utensils,
    Upload,
    Calendar,
    Fingerprint,
    Activity,
    Edit,
    History,
    ChevronLeft,
    Receipt,
    CheckCircle2,
    X,
    Plus,
    Clock,
    Shield,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    Ban,
    AlertCircle,
    List,
    Camera
} from 'lucide-react';


const PayDueMemberModal = ({ isOpen, onClose, member, isDarkMode, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [splitPayment, setSplitPayment] = useState({ cash: 0, online: 0 });
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (member && isOpen) {
            setAmount(member.dueAmount || '');
        }
    }, [member, isOpen]);

    // Auto-sync split payment when amount changes
    useEffect(() => {
        if (paymentMode === 'Split') {
            const currentTotal = Number(splitPayment.cash) + Number(splitPayment.online);
            if (currentTotal !== Number(amount)) {
                setSplitPayment({ cash: Number(amount), online: 0 });
            }
        }
    }, [amount, paymentMode]);

    if (!isOpen || !member) return null;

    const handleSubmit = async () => {
        if (!amount || amount <= 0) return;
        setIsSubmitting(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const res = await fetch(`${API_BASE_URL}/api/admin/members/${member._id}/pay-due`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    paymentMode,
                    splitPayment: paymentMode === 'Split' ? splitPayment : { cash: 0, online: 0 },
                    closedBy: adminInfo?._id,
                    comment
                })
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await res.json();
                alert(err.message || 'Failed to record payment');
            }
        } catch (error) {
            console.error('Error paying due:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'}`}>
                <div className="p-6 border-b dark:border-white/10 border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-600/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <h3 className={`text-[15px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pay Outstanding Dues</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Collecting Dues</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center p-5 rounded-xl bg-red-500/5 border border-red-500/10 mb-4">
                        <div>
                            <p className="text-[10px] font-black uppercase text-red-500 tracking-wider">Total Outstanding</p>
                            <p className="text-2xl font-black text-red-600">₹{member.dueAmount}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Member</p>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{member.firstName} {member.lastName}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Amount to Pay*</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    max={member.dueAmount}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white focus:border-red-500/50' : 'bg-white border-gray-300 focus:border-red-500'}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Payment Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Cash', 'UPI / Online', 'Card', 'Cheque', 'Split'].map(mode => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setPaymentMode(mode)}
                                        className={`py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-all ${paymentMode === mode
                                            ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                                            : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600')
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {paymentMode === 'Split' && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 p-4 rounded-xl bg-red-500/5 border border-dashed border-red-500/20">
                                <div className="space-y-1.5">
                                    <label className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cash Part (₹)</label>
                                    <input
                                        type="number"
                                        value={splitPayment.cash}
                                        onChange={(e) => {
                                            const cash = Number(e.target.value) || 0;
                                            const online = Math.max(0, Number(amount) - cash);
                                            setSplitPayment({ cash, online });
                                        }}
                                        className={`w-full px-3 py-2 rounded-lg border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white focus:border-red-500' : 'bg-white border-gray-200 focus:border-red-500'}`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Online Part (₹)</label>
                                    <input
                                        type="number"
                                        value={splitPayment.online}
                                        onChange={(e) => {
                                            const online = Number(e.target.value) || 0;
                                            const cash = Math.max(0, Number(amount) - online);
                                            setSplitPayment({ cash, online });
                                        }}
                                        className={`w-full px-3 py-2 rounded-lg border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white focus:border-red-500' : 'bg-white border-gray-200 focus:border-red-500'}`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Remarks */}
                        <div className="space-y-1.5">
                            <label className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Remarks (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add any notes here..."
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none h-20 resize-none transition-all ${isDarkMode ? 'bg-transparent border-white/10 text-white focus:border-red-500/50' : 'bg-white border-gray-300 focus:border-red-500'}`}
                            />
                        </div>

                        {/* Balance Preview */}
                        {amount > 0 && (
                            <div className={`p-4 rounded-lg flex justify-between items-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Remaining Balance After Payment</p>
                                <p className="text-sm font-black text-orange-500">₹{Math.max(0, member.dueAmount - Number(amount))}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="pt-2">
                    <button
                        disabled={isSubmitting || !amount || amount <= 0}
                        onClick={handleSubmit}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all active:scale-95 text-[14px] uppercase tracking-wider disabled:opacity-30 flex items-center justify-center gap-2 group"
                    >
                        {isSubmitting ? 'Recording...' : (
                            <>
                                Confirm Collection
                                <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileLayout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, setSidebarOpen } = useOutletContext();

    // Unified dummy members for lookup when state is missing (on refresh)
    const dummyMembers = [
        { id: '489890', name: 'KUNAL CHAUHAN', number: '9978145629', email: 'kunal@example.com', dob: '1995-05-15', anniversary_date: '2023-11-20' },
        { id: '489891', name: 'Riya patel', number: '9099031248', email: 'riya@example.com', dob: '1998-08-22' },
        { id: '489892', name: 'satish badgujar', number: '8488800551', email: 'satish@example.com' },
        { id: '489893', name: 'KRISHNA PRAJAPATI', number: '9726540860' },
        { id: '489894', name: 'SHASTHA MUDOLIAR', number: '9712244420' },
        { id: '1232', name: 'NIRAJ GUPTA', mobile: '+917778877207' },
        { id: '1231', name: 'CHANDAN SINGH', mobile: '+91919998596909' },
        { id: '1230', name: 'DEV LODHA', mobile: '+917698523069' },
        { id: '1229', name: 'HEMIL MODI', number: '9512585046' },
        { id: '1228', name: 'MODI PRATHAM', number: '6352560220' },
        { id: '1227', name: 'SANDEEP PATEL', number: '7043484769' },
        { id: '1226', name: 'PATEL DHRUV', number: '7179010403' },
        { id: '1233', name: 'DRUV RAVAL', number: '9428053837' },
        { id: '551', name: 'BHARWAD JAGDISH', number: '7990769808' },
        { id: '1226-A', name: 'ANKHUSH MAURYA', number: '9537971487' },
        { id: '1227-A', name: 'RAHUL BHAI', number: '6351339232' },
        { id: '1228-A', name: 'siddharth parmar', number: '9974713590' },
        { id: '1229-A', name: 'parmar prince', number: '9106843438' },
        { id: '442', name: 'RAJESH SHARMA', number: '9825098250' },
        { id: '523425', name: 'Evenjleena CHRISTIAN', number: '8980209491' },
    ];

    const memberDataFromState = location.state?.member;
    const [memberData, setMemberData] = useState(memberDataFromState || null);
    const [isLoading, setIsLoading] = useState(!memberData);
    const [isPayDueModalOpen, setIsPayDueModalOpen] = useState(false);

    const fetchMember = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setMemberData(data);
        } catch (error) {
            console.error('Error fetching member profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!memberDataFromState) {
            fetchMember();
        }
    }, [id]);

    const refreshProfile = () => {
        fetchMember();
    };

    const memberName = memberData ? `${memberData.firstName} ${memberData.lastName}` : 'Loading...';
    const memberMobile = memberData?.mobile || '-';
    const memberEmail = memberData?.email || '-';
    const memberDOB = memberData?.dob ? new Date(memberData.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const memberAnniversary = memberData?.anniversaryDate ? new Date(memberData.anniversaryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const memberEmergencyName = memberData?.emergencyContact?.name || '-';
    const memberEmergencyNo = memberData?.emergencyContact?.number || '-';
    const displayId = memberData?.memberId || id || '-';

    // Collapse main sidebar when viewing profile to give more space
    React.useEffect(() => {
        if (setSidebarOpen) {
            setSidebarOpen(false);
        }
        return () => {
            if (setSidebarOpen) {
                setSidebarOpen(true);
            }
        };
    }, [setSidebarOpen]);

    const sidebarItems = [
        { label: 'Edit Profile', icon: Edit, path: 'edit' },
        { label: 'Memberships', icon: User, path: 'memberships' },
        { label: 'Follow Ups', icon: History, path: 'followup' },
        { label: 'Payment History', icon: CreditCard, path: 'payment-history' },
        { label: 'Report Card', icon: FileText, path: 'report-card' },
        { label: 'Workout History', icon: Dumbbell, path: 'workout-history' },
        { label: 'Diet History', icon: Utensils, path: 'diet-history' },
        { label: 'Upload Documents', icon: Upload, path: 'documents' },
        { label: 'Attendance', icon: Calendar, path: 'attendance' },
        { label: 'Biometric', icon: Fingerprint, path: 'biometric' },
        { label: 'Health Assessment', icon: Activity, path: 'health-assessment' },
    ];

    return (
        <div className={`flex flex-col gap-4 h-[calc(100vh-128px)] overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8f9fa] text-gray-800'}`}>
            {/* Back Button Container */}
            <div className="shrink-0 pt-2">
                <div
                    onClick={() => navigate('/admin/members/list')}
                    className="flex items-center gap-2 text-orange-500 font-bold cursor-pointer w-fit hover:underline z-20"
                >
                    <ChevronLeft size={20} />
                    <span>Members Profile</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 pb-2 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-full lg:w-[300px] flex-shrink-0 space-y-4 h-full overflow-y-auto scrollbar-hide pr-1 self-start">

                    {/* User Card */}
                    <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                            {memberData?.photo ? (
                                <img src={memberData.photo} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=random`} alt="User" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold dark:text-white text-gray-900 uppercase truncate">{memberName}</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {displayId}</p>
                                {memberData?.dueAmount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase">
                                        Due: ₹{memberData.dueAmount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Add Sale Button */}
                    <button
                        onClick={() => navigate(`/admin/members/profile/${id}/sale/fresh`, { state: { member: memberData } })}
                        className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-[13px] uppercase tracking-wider"
                    >
                        <Plus size={18} />
                        Add to New Sale
                    </button>

                    {/* Pay Due Button (Visible only if balance > 0) */}
                    {memberData?.dueAmount > 0 && (
                        <button
                            onClick={() => setIsPayDueModalOpen(true)}
                            className="w-full bg-[#ef4444] hover:bg-red-600 text-white font-black py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-[13px] uppercase tracking-wider"
                        >
                            <CreditCard size={18} />
                            Pay Outstanding Dues
                        </button>
                    )}

                    {/* Navigation Menu */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden py-2">
                        {sidebarItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={`${item.path}`}
                                state={{ member: memberData }}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-6 py-3.5 text-sm font-bold transition-all
                  ${isActive
                                        ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-l-4 border-orange-500'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 border-l-4 border-transparent'}
                `}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 w-full min-w-0 h-full overflow-y-auto custom-scrollbar pr-1">
                    {/* Pass parent context (isDarkMode) + current id + member details */}
                    <Outlet context={{
                        isDarkMode,
                        id,
                        memberData,
                        memberName,
                        memberId: displayId,
                        memberMobile,
                        memberEmail,
                        memberDOB,
                        memberAnniversary,
                        memberEmergencyName,
                        memberEmergencyNo,
                        isLoading,
                        refreshProfile
                    }} />
                </div>
            </div>

            <PayDueMemberModal
                isOpen={isPayDueModalOpen}
                onClose={() => setIsPayDueModalOpen(false)}
                member={memberData}
                isDarkMode={isDarkMode}
                onSuccess={() => {
                    refreshProfile();
                }}
            />
        </div>
    );
};

export default ProfileLayout;
