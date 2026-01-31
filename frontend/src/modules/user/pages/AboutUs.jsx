import React from 'react';
import { Mail, Globe, MapPin, Heart, Users, Trophy, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 font-sans">
            <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-[#121212] relative shadow-xl flex flex-col">

                {/* Header */}
                <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-5 pb-6 shadow-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold">About Us</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 pb-24 overflow-y-auto">

                    {/* Brand Card */}
                    <div className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 text-center mb-6 shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">V-10 Fitness Lab</h2>
                        <p className="text-xs text-gray-400 mt-1">v1.0.2</p>
                    </div>

                    {/* Mission */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 mb-6 text-white shadow-lg">
                        <div className="flex items-start gap-3">
                            <Heart size={20} className="mt-1 opacity-90" />
                            <div>
                                <h3 className="font-bold text-base mb-1">Our Mission</h3>
                                <p className="text-xs text-emerald-50 leading-relaxed opacity-95">
                                    Empowering your fitness journey with personalized tools, expert guidance, and a supportive community.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 mb-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Why V-10?</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <Trophy size={16} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-xs">Personalized</h4>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">AI-driven plans for you.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <Users size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-xs">Expert Team</h4>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">certified trainers & nutritionists.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Contact</h3>
                        <div className="space-y-3">
                            <a href="mailto:info@v10gym.com" className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <Mail size={16} /> <span>info@v10gym.com</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <Globe size={16} /> <span>www.v10gym.com</span>
                            </a>
                            <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <MapPin size={16} className="mt-0.5" />
                                <span>123 Wellness St, Fit City</span>
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="mt-8 flex justify-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors">
                            <span className="text-lg">📷</span>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors">
                            <span className="text-lg">📘</span>
                        </button>
                    </div>

                    <p className="text-[10px] text-center text-gray-400 mt-6">
                        © 2026 V-10 Fitness Lab
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
