import { ChevronLeft, Scale, LogOut, Moon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const Settings = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    // Mock State
    const [units, setUnits] = useState('Metric');

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-[#1A1F2B] pt-8 px-6 pb-6 shadow-sm sticky top-0 z-10 flex items-center justify-between transition-colors duration-300">
                <button
                    onClick={() => navigate('/profile')}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white absolute left-1/2 -translate-x-1/2">Settings</h1>
                <div className="w-8"></div> {/* Spacer for alignment */}
            </div>

            <div className="p-6 space-y-6 pb-24">

                {/* Section: Preferences */}
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Preferences</h2>
                    <div className="bg-white dark:bg-[#1A1F2B] rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
                        {/* Units */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Scale size={16} />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Units</span>
                            </div>
                            <button
                                onClick={() => setUnits(units === 'Metric' ? 'Imperial' : 'Metric')}
                                className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {units}
                            </button>
                        </div>

                        {/* Dark Mode */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Moon size={16} />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Dark Mode</span>
                            </div>
                            <div
                                onClick={toggleTheme}
                                className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Section: Account */}
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Account</h2>
                    <div className="bg-white dark:bg-[#1A1F2B] rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <LogOut size={16} />
                                </div>
                                <span className="font-bold text-red-600 text-sm">Log Out</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">V-10 Gym App v1.0.2</p>
                </div>

            </div>
        </div>
    );
};

export default Settings;
