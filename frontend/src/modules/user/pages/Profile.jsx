import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Award, Shield, ChevronRight, Weight, Ruler, Lock, Flame, Pencil, Calendar as CalendarIcon, HelpCircle, FileText, Info, MessageSquare, LogOut, User, Users, Crown } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';
import TrainerDetailModal from '../components/TrainerDetailModal';
import { API_BASE_URL } from '../../../config/api';

const Profile = () => {
    // State
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const storedData = localStorage.getItem('userData');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    const [userData, setUserData] = useState({
        name: parsedData ? `${parsedData.firstName} ${parsedData.lastName}` : 'Guest',
        username: parsedData ? `@${parsedData.memberId}` : '@guest',
        weight: parsedData?.weight || '75',
        height: parsedData?.height || '178',
        age: parsedData?.age || '30',
        mobile: parsedData?.mobile || '',
        photo: parsedData?.photo || null,
        endDate: parsedData?.endDate || null
    });
    const [presentTrainers, setPresentTrainers] = useState([]);

    const getRemainingDays = () => {
        if (!userData.endDate) return 'Plan not active';
        const today = new Date();
        const expiryDate = new Date(userData.endDate);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Expired';
        if (diffDays === 0) return 'Expires Today';
        return `${diffDays} days left`;
    };

    useEffect(() => {
        fetchProfile();
        fetchPresentTrainers();
    }, []);

    const fetchPresentTrainers = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/user/trainers/present`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPresentTrainers(data);
            }
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };


    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUserData({
                    ...data,
                    name: `${data.firstName} ${data.lastName}`,
                    username: `@${data.memberId}`,
                    photo: data.photo
                });
                // Sync localStorage
                localStorage.setItem('userData', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSave = async (formData, imageFile) => {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        const data = new FormData();
        if (formData.name) data.append('name', formData.name);
        if (formData.weight !== undefined && formData.weight !== null) data.append('weight', formData.weight);
        if (formData.height !== undefined && formData.height !== null) data.append('height', formData.height);
        if (formData.age !== undefined && formData.age !== null) data.append('age', formData.age);

        if (imageFile) {
            data.append('photo', imageFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (response.ok) {
                await fetchProfile(); // Refresh data
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error; // Re-throw for modal to handle
        }
    };

    const calculateBMI = () => {
        const h = parseFloat(userData.height) / 100;
        const w = parseFloat(userData.weight);
        if (h > 0 && w > 0) {
            return (w / (h * h)).toFixed(1);
        }
        return '--';
    };

    const getBMICategory = (bmi) => {
        if (bmi === '--') return { label: 'BMI', color: 'text-gray-400' };
        const val = parseFloat(bmi);
        if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
        if (val < 25) return { label: 'Normal', color: 'text-emerald-500' };
        if (val < 30) return { label: 'Overweight', color: 'text-orange-500' };
        return { label: 'Obese', color: 'text-red-500' };
    };

    const bmiValue = calculateBMI();
    const bmiCat = getBMICategory(bmiValue);

    // Placeholder handler for menu items
    const handleMenuClick = (item) => {
        const routes = {
            'Settings': '/settings',
            'FAQ': '/faq',
            'Terms': '/terms',
            'About': '/about',
            'Privacy': '/privacy',
            'Achievements': '/achievements',
            'Feedback': '/feedback',
            'Attendance': '/attendance-history'
            // 'Admin': '/admin'
        };

        if (routes[item]) {
            navigate(routes[item]);
        } else {
            alert(`${item} feature is coming soon! 🚀`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300">
            {/* White Header for clean look */}
            <div className="bg-white dark:bg-[#1A1F2B] pt-6 px-6 pb-4 shadow-sm text-center relative rounded-b-[2rem] transition-colors duration-300">
                <div className="relative w-20 h-20 mx-auto mb-2">
                    <div className="w-full h-full rounded-full p-1 border-2 border-emerald-50 overlay-hidden bg-gray-50 flex items-center justify-center overflow-hidden">
                        {userData.photo ? (
                            <img src={userData.photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                                <User className="text-emerald-400" size={32} />
                            </div>
                        )}
                    </div>
                    {/* Edit Button */}
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                        <Pencil size={12} />
                    </button>
                </div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{userData.name}</h1>
                <p className="text-xs text-gray-400 font-medium">{userData.username}</p>
            </div>

            <div className="px-5 py-4">
                {/* Stats Grid - 2x2 Layout */}
                {/* Stats Row - Compact Dark Circles */}
                <div className="flex justify-between items-center gap-2 mb-4 bg-white dark:bg-[#1A1F2B] p-3 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    {/* Weight */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-[#1A1F2B] flex items-center justify-center text-white shadow-lg shadow-gray-200">
                            <Weight size={20} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white text-sm leading-none mb-0.5">{userData.weight} <span className="text-[10px] text-gray-400">kg</span></p>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weight</span>
                        </div>
                    </div>

                    <div className="w-px h-10 bg-gray-100 dark:bg-gray-800"></div>

                    {/* Height */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-[#1A1F2B] flex items-center justify-center text-white shadow-lg shadow-gray-200">
                            <Ruler size={20} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white text-sm leading-none mb-0.5">{userData.height} <span className="text-[10px] text-gray-400">cm</span></p>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Height</span>
                        </div>
                    </div>

                    <div className="w-px h-10 bg-gray-100 dark:bg-gray-800"></div>

                    {/* Age */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full bg-[#1A1F2B] flex items-center justify-center text-white shadow-lg shadow-gray-200">
                            <Lock size={20} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white text-sm leading-none mb-0.5">{userData.age} <span className="text-[10px] text-gray-400">yrs</span></p>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Age</span>
                        </div>
                    </div>

                    <div className="w-px h-10 bg-gray-100 dark:bg-gray-800"></div>

                    {/* BMI */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-12 h-12 rounded-full bg-[#1A1F2B] flex items-center justify-center ${bmiValue !== '--' ? bmiCat.color : 'text-white'} shadow-lg shadow-gray-200`}>
                            <Flame size={20} />
                        </div>
                        <div className="text-center">
                            <p className={`font-bold text-sm leading-none mb-0.5 ${bmiValue !== '--' ? bmiCat.color : 'text-gray-900 dark:text-white'}`}>
                                {bmiValue}
                            </p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${bmiValue !== '--' ? bmiCat.color : 'text-gray-400'}`}>
                                {bmiCat.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subscription Status Section */}
                <div className="mb-6 px-1">
                    <div className="bg-gradient-to-br from-[#1A1F2B] to-[#2D3446] rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Crown size={64} className="text-amber-400" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Membership</h3>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xl font-black text-white leading-none mb-1">
                                        {userData.packageName || 'Active Plan'}
                                    </p>
                                    <p className="text-xs font-bold text-gray-400">
                                        Expires on: {userData.endDate ? new Date(userData.endDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                                        <p className="text-[11px] font-black text-white uppercase tracking-tighter">
                                            {getRemainingDays()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar for subscription */}
                            <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-400 rounded-full"
                                    style={{
                                        width: userData.endDate ? `${Math.max(0, Math.min(100, (Math.ceil((new Date(userData.endDate) - new Date()) / (1000 * 60 * 60 * 24)) / 30) * 100))}%` : '0%'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trainers Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-[17px] font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Users size={18} className="text-emerald-500" />
                            Trainers in Gym
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
                        </h2>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{presentTrainers.length} Active</span>
                    </div>

                    {presentTrainers.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                            {presentTrainers.map((trainer) => (
                                <div
                                    key={trainer._id}
                                    className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
                                    onClick={() => setSelectedTrainer(trainer)}
                                >
                                    <div className="relative w-16 h-16 transition-transform group-hover:scale-105">
                                        <div className="w-full h-full rounded-full p-0.5 border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors shadow-sm">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                {trainer.photo ? (
                                                    <img src={trainer.photo} alt={trainer.firstName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-emerald-500/50">
                                                        <User size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                                    </div>
                                    <div className="text-center w-20">
                                        <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate leading-none mb-1">
                                            {trainer.firstName}
                                        </p>
                                        <span className="text-[9px] text-gray-400 font-medium truncate block">
                                            {trainer.gymActivities?.[0] || 'Trainer'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-6 text-center border border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-xs text-gray-400 font-medium">No trainers currently present in gym</p>
                        </div>
                    )}
                </div>

                {/* Menu List */}
                <div className="bg-white dark:bg-[#1A1F2B] rounded-[1.5rem] p-2 shadow-sm border border-gray-100 dark:border-gray-800 mb-20 transition-colors duration-300">
                    <button onClick={() => handleMenuClick('Attendance')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <CalendarIcon size={20} className="text-orange-500" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">My Attendance History</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
                    </button>

                    <button onClick={() => handleMenuClick('Settings')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <Settings size={20} className="text-gray-400" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Settings</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
                    </button>

                    <button onClick={() => handleMenuClick('Feedback')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <MessageSquare size={20} className="text-gray-400" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Feedback & Support</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
                    </button>

                    <button onClick={() => handleMenuClick('FAQ')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <HelpCircle size={20} className="text-gray-400" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">FAQ</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
                    </button>

                    <button onClick={() => handleMenuClick('Terms')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <FileText size={20} className="text-gray-400" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Terms & Conditions</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
                    </button>

                    <button onClick={() => handleMenuClick('About')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <Info size={20} className="text-gray-400" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">About Us</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
                    </button>

                    <button onClick={() => handleMenuClick('Privacy')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <Shield size={20} className="text-gray-400" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Privacy</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem('userToken');
                            localStorage.removeItem('userData');
                            navigate('/login');
                        }}
                        className="w-full p-4 flex items-center justify-between group last:border-0 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <LogOut size={20} className="text-red-500" />
                            <span className="font-bold text-red-500 text-sm">Logout</span>
                        </div>
                        <ChevronRight className="text-red-300 group-hover:text-red-500" size={18} />
                    </button>

                    {/* <button onClick={() => handleMenuClick('Admin')} className="w-full p-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <Shield size={20} className="text-[#f97316]" />
                            <span className="font-bold text-[#f97316] text-sm">Admin Panel</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-[#f97316]" size={18} />
                    </button> */}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditProfileModal
                    userData={userData}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSave}
                />
            )}

            <TrainerDetailModal
                trainer={selectedTrainer}
                onClose={() => setSelectedTrainer(null)}
            />
        </div>
    );
};

export default Profile;
