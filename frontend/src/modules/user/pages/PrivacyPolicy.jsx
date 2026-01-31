import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import SettingPageLayout from '../components/SettingPageLayout';

const PrivacyPolicy = () => {
    return (
        <SettingPageLayout title="Privacy Policy">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 text-white">
                <div className="flex items-start gap-3">
                    <Shield size={24} className="flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold mb-2">Your Privacy Matters</h3>
                        <p className="text-sm text-blue-50 leading-relaxed">
                            At V-10 Gym, we are committed to protecting your personal information and your right to privacy.
                            This policy explains how we collect, use, and safeguard your data.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <p className="text-xs text-gray-400 mb-6">Effective Date: January 30, 2026</p>

                {/* Information We Collect */}
                <section className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Database size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
                    </div>
                    <div className="ml-10 space-y-3">
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Personal Information</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Name, email address, phone number, date of birth, gender, and profile photo when you create an account.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Health & Fitness Data</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Weight, height, BMI, workout history, exercise preferences, dietary information, and progress metrics.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Usage Data</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                App interactions, features used, session duration, and device information (OS, model, IP address).
                            </p>
                        </div>
                    </div>
                </section>

                {/* How We Use Your Information */}
                <section className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <UserCheck size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
                    </div>
                    <div className="ml-10">
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Provide personalized workout and nutrition plans</li>
                            <li>Track your fitness progress and achievements</li>
                            <li>Send important notifications about your workouts and goals</li>
                            <li>Improve app functionality and user experience</li>
                            <li>Provide customer support and respond to inquiries</li>
                            <li>Ensure security and prevent fraudulent activity</li>
                        </ul>
                    </div>
                </section>

                {/* Data Security */}
                <section className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Lock size={16} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">3. Data Security</h2>
                    </div>
                    <div className="ml-10">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            We implement industry-standard security measures to protect your personal information:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>End-to-end encryption for data transmission</li>
                            <li>Secure cloud storage with regular backups</li>
                            <li>Two-factor authentication options</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited employee access to personal data</li>
                        </ul>
                    </div>
                </section>

                {/* Data Sharing */}
                <section className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <Eye size={16} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">4. Information Sharing</h2>
                    </div>
                    <div className="ml-10">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            We do NOT sell your personal information. We may share data only in these limited circumstances:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>With your explicit consent</li>
                            <li>With service providers who assist in app operations (under strict confidentiality agreements)</li>
                            <li>To comply with legal obligations or court orders</li>
                            <li>To protect the rights and safety of V-10 Gym and its users</li>
                        </ul>
                    </div>
                </section>

                {/* Your Rights */}
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">5. Your Privacy Rights</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                        <li>Access and download your personal data</li>
                        <li>Correct inaccurate or incomplete information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Restrict or object to certain data processing</li>
                    </ul>
                </section>

                {/* Cookies and Tracking */}
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">6. Cookies & Tracking</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        We use cookies and similar technologies to enhance your experience, analyze app usage, and provide personalized content.
                        You can manage cookie preferences in your device settings.
                    </p>
                </section>

                {/* Children's Privacy */}
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">7. Children's Privacy</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        V-10 Gym is not intended for users under 13 years of age. We do not knowingly collect personal information from children.
                        If you believe we have inadvertently collected such data, please contact us immediately.
                    </p>
                </section>

                {/* Changes to Policy */}
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">8. Policy Updates</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        We may update this Privacy Policy periodically. We will notify you of significant changes via email or in-app notification.
                        Continued use of the app after changes constitutes acceptance of the updated policy.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">9. Contact Us</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                        For questions or concerns about this Privacy Policy or your data:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email: <a href="mailto:privacy@v10gym.com" className="text-blue-500 hover:underline">privacy@v10gym.com</a><br />
                        Data Protection Officer: <a href="mailto:dpo@v10gym.com" className="text-blue-500 hover:underline">dpo@v10gym.com</a>
                    </p>
                </section>
            </div>

            {/* Quick Summary Card */}
            <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Privacy at a Glance</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-600 dark:text-gray-400">No data selling</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-600 dark:text-gray-400">Encrypted storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-600 dark:text-gray-400">You control your data</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-600 dark:text-gray-400">GDPR compliant</span>
                    </div>
                </div>
            </div>
        </SettingPageLayout>
    );
};

export default PrivacyPolicy;
