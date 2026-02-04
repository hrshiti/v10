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
    Plus
} from 'lucide-react';


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
        <div className={`flex flex-col gap-6 p-8 min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8f9fa] text-gray-800'}`}>
            {/* Back Button */}
            {/* Back Button - Now sticky or fixed if needed, but keeping it at top of content for now */}
            <div
                onClick={() => navigate('/admin/members/list')}
                className="flex items-center gap-2 text-orange-500 font-bold cursor-pointer w-fit hover:underline z-20"
            >
                <ChevronLeft size={20} />
                <span>Members Profile</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start relative">
                {/* Left Sidebar */}
                <div className="w-full lg:w-[300px] flex-shrink-0 space-y-4 lg:sticky lg:top-[100px] self-start z-10">

                    {/* User Card */}
                    <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 overflow-hidden flex items-center justify-center text-xl font-bold text-black border-2 border-white shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=random`} alt="User" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold dark:text-white text-gray-900 uppercase">{memberName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Client ID : {displayId}</p>
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
                <div className="flex-1 w-full min-w-0">
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
        </div>
    );
};

export default ProfileLayout;
