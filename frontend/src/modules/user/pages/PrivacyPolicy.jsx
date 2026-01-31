import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                        <h1 className="text-xl font-bold">Privacy Policy</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 pb-24 overflow-y-auto">
                    {/* Introduction Card */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 mb-6 text-white shadow-lg">
                        <div className="flex items-start gap-3">
                            <Shield size={24} className="flex-shrink-0 mt-1 opacity-80" />
                            <div>
                                <h3 className="text-lg font-bold mb-1">Your Privacy</h3>
                                <p className="text-xs text-blue-50 leading-relaxed opacity-90">
                                    We protect your personal info and privacy rights.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">Effective: Jan 30, 2026</p>

                        {/* Sections */}
                        <div className="space-y-6">
                            <section>
                                <div className="flex items-center gap-2 mb-2">
                                    <Database size={16} className="text-emerald-500" />
                                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">1. Data Collection</h2>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
                                    We collect name, email, profile photo, and health metrics (weight, height, workout history) to personalize your experience.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCheck size={16} className="text-blue-500" />
                                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">2. Usage</h2>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
                                    To provide workouts, track progress, send notifications, and improve app features.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-2">
                                    <Lock size={16} className="text-purple-500" />
                                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">3. Security</h2>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
                                    Industry-standard encryption, secure cloud storage, and regular security audits protect your data.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye size={16} className="text-orange-500" />
                                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">4. Sharing</h2>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
                                    We do NOT sell data. Shared only with consent, service providers, or for legal compliance.
                                </p>
                            </section>
                        </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/20">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">At a Glance</h3>
                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-gray-600 dark:text-gray-400">No selling data</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-gray-600 dark:text-gray-400">Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-gray-600 dark:text-gray-400">You control data</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-gray-600 dark:text-gray-400">GDPR Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
