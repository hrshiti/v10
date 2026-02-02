import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Award, Shield, ChevronRight, Weight, Ruler, Lock, Flame, Pencil, Calendar as CalendarIcon, HelpCircle, FileText, Info, MessageSquare } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
    // State
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Jordan Eagle',
        username: '@jordaneagle',
        weight: '75',
        height: '178',
        age: '30'
    });

    // Calculate BMI dynamically
    const calculateBMI = () => {
        const h = parseFloat(userData.height) / 100;
        const w = parseFloat(userData.weight);
        if (h > 0 && w > 0) {
            return (w / (h * h)).toFixed(1);
        }
        return '--';
    };

    const handleSave = (newData) => {
        setUserData(newData);
    };

    // Placeholder handler for menu items
    const handleMenuClick = (item) => {
        const routes = {
            'Settings': '/settings',
            'FAQ': '/faq',
            'Terms': '/terms',
            'About': '/about',
            'Privacy': '/privacy',
            'Achievements': '/achievements',
            'Feedback': '/feedback'
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
                    <div className="w-full h-full rounded-full p-1 border-2 border-green-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200" alt="Profile" className="w-full h-full object-cover rounded-full" />
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
                        <div className="w-12 h-12 rounded-full bg-[#1A1F2B] flex items-center justify-center text-white shadow-lg shadow-gray-200">
                            <Flame size={20} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white text-sm leading-none mb-0.5">{calculateBMI()}</p>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BMI</span>
                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <div className="bg-white dark:bg-[#1A1F2B] rounded-[1.5rem] p-2 shadow-sm border border-gray-100 dark:border-gray-800 mb-20 transition-colors duration-300">
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

                    <button onClick={() => handleMenuClick('Achievements')} className="w-full p-4 flex items-center justify-between group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <Award size={20} className="text-gray-400" />
                            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Achievements</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-gray-500" size={18} />
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
        </div>
    );
};

export default Profile;
