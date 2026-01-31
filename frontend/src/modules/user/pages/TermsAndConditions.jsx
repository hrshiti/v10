import React from 'react';
import SettingPageLayout from '../components/SettingPageLayout';

const TermsAndConditions = () => {
    return (
        <SettingPageLayout title="Terms & Conditions">
            <div className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-xs text-gray-400 mb-6">Last Updated: January 30, 2026</p>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            By accessing and using the V-10 Gym mobile application ("App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2. Use License</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            Permission is granted to temporarily download one copy of the App per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or public display</li>
                            <li>Attempt to decompile or reverse engineer any software contained in the App</li>
                            <li>Remove any copyright or proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                        </ul>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">3. Membership and Subscriptions</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            V-10 Gym offers various subscription plans. By subscribing, you agree to pay all fees associated with your chosen plan. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            Refunds are not provided for partial subscription periods. You may cancel your subscription at any time through the App settings.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">4. User Responsibilities</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Ensuring your use of the App complies with applicable laws</li>
                            <li>Consulting with healthcare professionals before starting any fitness program</li>
                        </ul>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">5. Health and Safety Disclaimer</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            The workout programs and nutritional information provided are for educational purposes only. Always consult with a qualified healthcare provider before beginning any exercise or diet program. V-10 Gym is not responsible for any injuries or health issues that may occur from using the App.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">6. Intellectual Property</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            All content, features, and functionality of the App, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, and software, are the exclusive property of V-10 Gym and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">7. Limitation of Liability</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            In no event shall V-10 Gym or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the App, even if V-10 Gym has been notified of the possibility of such damage.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">8. Modifications to Terms</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            V-10 Gym reserves the right to revise these terms at any time. By continuing to use the App after changes are posted, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">9. Contact Information</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            For questions about these Terms & Conditions, please contact us at:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Email: <a href="mailto:legal@v10gym.com" className="text-emerald-500 hover:underline">legal@v10gym.com</a><br />
                            Address: V-10 Fitness Lab, 123 Wellness Street, Fit City, FC 12345
                        </p>
                    </section>
                </div>
            </div>
        </SettingPageLayout>
    );
};

export default TermsAndConditions;
