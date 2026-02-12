import React from 'react';
import { Bell, Menu, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../../config/api';

const Navbar = ({ toggleSidebar, sidebarOpen, onNotificationClick, isDarkMode, toggleTheme }) => {
    const navigate = useNavigate();

    // Get admin data from localStorage
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const adminName = adminInfo.name || 'Admin';
    const adminEmail = adminInfo.email || '';
    const [gymData, setGymData] = React.useState({ name: 'V10 Fitness Gym', logo: '/v10_logo.png' });

    React.useEffect(() => {
        const fetchGymDetails = async () => {
            try {
                const adminData = JSON.parse(localStorage.getItem('adminInfo') || '{}');
                if (!adminData?.token) return;

                const res = await fetch(`${API_BASE_URL}/api/admin/gym-details`, {
                    headers: { 'Authorization': `Bearer ${adminData.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setGymData({
                        name: data.name || 'V10 Fitness Gym',
                        logo: data.logo ? (data.logo.startsWith('http') ? data.logo : `${API_BASE_URL}/uploads/${data.logo}`) : '/v10_logo.png'
                    });
                }
            } catch (err) {
                console.error('Error fetching gym info in navbar:', err);
            }
        };

        fetchGymDetails();

        // Listen for updates from GymDetails component
        window.addEventListener('gymDetailsUpdated', fetchGymDetails);
        return () => window.removeEventListener('gymDetailsUpdated', fetchGymDetails);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    return (
        <header className={`h-16 flex items-center justify-between px-4 lg:px-8 fixed top-0 left-0 right-0 z-50 border-b transition-colors ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex items-center gap-4 lg:gap-6">
                <button
                    onClick={toggleSidebar}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-100 text-black'}`}
                >
                    <Menu size={24} />
                </button>

                <div
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 lg:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <img
                        src={gymData.logo}
                        alt={gymData.name}
                        className="h-8 lg:h-9 object-contain"
                        onError={(e) => { e.target.src = '/v10_logo.png' }}
                    />
                    <span className="text-xl lg:text-2xl font-black tracking-tight text-[#f97316]">{gymData.name}</span>
                </div>
            </div>



            <div className="flex items-center gap-2 lg:gap-4">
                <button
                    onClick={onNotificationClick}
                    className={`p-2.5 rounded-full relative transition-colors ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-100 text-black'}`}
                >
                    <Bell size={24} fill={isDarkMode ? 'none' : 'black'} />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1a1a]"></span>
                </button>

                {/* Profile Section */}
                <div className="relative group/profile py-2">
                    <div className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 cursor-pointer transition-colors rounded-lg ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white">
                            <img
                                src={gymData.logo}
                                alt={gymData.name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => { e.target.src = '/v10_logo.png' }}
                            />
                        </div>
                        <div className="hidden sm:block leading-none text-left">
                            <h4 className={`text-[14px] lg:text-[15px] font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{gymData.name}</h4>
                            <p className="text-[11px] lg:text-[13px] text-gray-500 font-bold mt-1 uppercase tracking-tight">{adminName}</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>

                    {/* Profile Dropdown */}
                    <div className={`absolute top-full right-0 mt-1 w-64 lg:w-72 rounded-xl shadow-2xl border transition-all opacity-0 invisible translate-y-1 group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 z-50 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-200'}`}>
                        <div className="p-5 border-b border-gray-100 dark:border-white/5">
                            <p className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{adminName}</p>
                            <p className="text-[14px] text-gray-500 font-bold mt-1 truncate">{adminEmail}</p>
                        </div>

                        <div className="p-5 border-b border-gray-100 dark:border-white/5">
                            <p className={`text-[12px] font-black text-gray-400 uppercase tracking-widest mb-4`}>Appearance</p>
                            <div className="flex gap-4 lg:gap-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="theme"
                                        checked={!isDarkMode}
                                        onChange={() => toggleTheme('light')}
                                        className="w-4 h-4 accent-[#f97316]"
                                    />
                                    <span className={`text-[15px] font-bold ${!isDarkMode ? 'text-black' : 'text-gray-400'}`}>Light</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="theme"
                                        checked={isDarkMode}
                                        onChange={() => toggleTheme('dark')}
                                        className="w-4 h-4 accent-[#f97316]"
                                    />
                                    <span className={`text-[15px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-400'}`}>Dark</span>
                                </label>
                            </div>
                        </div>

                        <div className="p-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-4 text-[15px] font-black text-[#f97316] hover:bg-orange-50 dark:hover:bg-[#f97316]/10 rounded-lg transition-colors"
                            >
                                <LogOut size={20} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
