import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
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
                        <h1 className="text-xl font-bold">Terms & Conditions</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 pb-24 overflow-y-auto">
                    <div className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-6">Last Updated: Jan 30, 2026</p>

                        <div className="space-y-6">
                            <section>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">1. Acceptance</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    By using the V-10 Gym App, you agree to these terms. If you disagree, please do not use the service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">2. Memberships</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Subscriptions auto-renew unless cancelled 24h prior. No partial refunds. Manage in Settings.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">3. Responsibilities</h2>
                                <ul className="list-disc list-inside text-xs text-gray-500 dark:text-gray-400 space-y-1 ml-1">
                                    <li>Keep account secure</li>
                                    <li>Follow laws</li>
                                    <li>Consult doctor before exercising</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">4. Disclaimer</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Educational only. V-10 Gym isn't liable for injuries. Consult a professional.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">5. IP Rights</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    All content is owned by V-10 Gym. Do not copy or distribute without permission.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">6. Contact</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    legal@v10gym.com<br />
                                    Fit City, FC 12345
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
