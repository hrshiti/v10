import React from 'react';
import { Mail, Globe, MapPin, Heart, Users, Trophy } from 'lucide-react';
import SettingPageLayout from '../components/SettingPageLayout';
import logo from '../../../assets/logo.jpg';

const AboutUs = () => {
    return (
        <SettingPageLayout title="About Us">
            {/* Logo and Brand */}
            <div className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center mb-6 transition-colors duration-300">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-emerald-100 dark:border-emerald-900">
                    <img src={logo} alt="V-10 Gym Logo" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">V-10 Fitness Lab</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.2</p>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
                <div className="flex items-start gap-3 mb-3">
                    <Heart size={24} className="flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold mb-2">Our Mission</h3>
                        <p className="text-sm text-emerald-50 leading-relaxed">
                            To empower individuals on their fitness journey by providing personalized workout plans,
                            nutrition guidance, and a supportive community. We believe that everyone deserves access
                            to professional-grade fitness tools that adapt to their unique goals and lifestyle.
                        </p>
                    </div>
                </div>
            </div>

            {/* Key Features */}
            <div className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 mb-6 transition-colors duration-300">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">What We Offer</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                            <Trophy size={20} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Personalized Workouts</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                AI-powered workout plans tailored to your fitness level and goals
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <Users size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Expert Guidance</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Access to certified trainers and nutritionists
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Progress Tracking</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Comprehensive analytics to monitor your fitness journey
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 mb-6 transition-colors duration-300">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
                <div className="space-y-3">
                    <a href="mailto:info@v10gym.com" className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">
                        <Mail size={18} className="text-gray-400" />
                        <span>info@v10gym.com</span>
                    </a>
                    <a href="https://v10gym.com" className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">
                        <Globe size={18} className="text-gray-400" />
                        <span>www.v10gym.com</span>
                    </a>
                    <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <span>V-10 Fitness Lab<br />123 Wellness Street<br />Fit City, FC 12345</span>
                    </div>
                </div>
            </div>

            {/* Team & Credits */}
            <div className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Our Team</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    V-10 Gym was created by a passionate team of fitness enthusiasts, software engineers,
                    and health professionals dedicated to making fitness accessible to everyone.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    © 2026 V-10 Fitness Lab. All rights reserved.
                </p>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex justify-center gap-4">
                <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                    <span className="text-xl">📘</span>
                </button>
                <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                    <span className="text-xl">📷</span>
                </button>
                <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                    <span className="text-xl">🐦</span>
                </button>
            </div>
        </SettingPageLayout>
    );
};

export default AboutUs;
