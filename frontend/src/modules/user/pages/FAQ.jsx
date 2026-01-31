import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import SettingPageLayout from '../components/SettingPageLayout';

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'Membership',
            questions: [
                {
                    question: 'How do I sign up for a membership?',
                    answer: 'You can sign up directly through the app by navigating to the Profile section and selecting "Upgrade Membership". Choose your preferred plan and complete the payment process.'
                },
                {
                    question: 'Can I cancel my membership anytime?',
                    answer: 'Yes, you can cancel your membership at any time from the Settings page. Your access will continue until the end of your current billing period.'
                },
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards, debit cards, PayPal, and digital wallets including Apple Pay and Google Pay.'
                }
            ]
        },
        {
            category: 'Workouts',
            questions: [
                {
                    question: 'How do I track my workout progress?',
                    answer: 'Your workout progress is automatically tracked in the Workouts section. You can view detailed statistics, completed exercises, and performance trends over time.'
                },
                {
                    question: 'Can I create custom workout plans?',
                    answer: 'Yes! Navigate to the Workouts page and tap the "Create Custom Plan" button. You can add exercises, set reps, and schedule your workouts.'
                },
                {
                    question: 'Are there video tutorials for exercises?',
                    answer: 'Absolutely! Each exercise comes with a detailed video tutorial showing proper form and technique. Just tap on any exercise to view the tutorial.'
                }
            ]
        },
        {
            category: 'Diet & Nutrition',
            questions: [
                {
                    question: 'How does the meal planner work?',
                    answer: 'Our AI-powered meal planner creates personalized nutrition plans based on your fitness goals, dietary preferences, and caloric needs. You can customize meals and track your daily intake.'
                },
                {
                    question: 'Can I track my water intake?',
                    answer: 'Yes! The water tracker is available on the Home page. Simply tap the + button to log each glass of water you drink throughout the day.'
                },
                {
                    question: 'Are there vegetarian/vegan meal options?',
                    answer: 'Yes, we offer extensive vegetarian and vegan meal plans. You can set your dietary preferences in Settings to filter meal suggestions accordingly.'
                }
            ]
        },
        {
            category: 'Technical Support',
            questions: [
                {
                    question: 'The app is not syncing my data. What should I do?',
                    answer: 'First, ensure you have a stable internet connection. Try logging out and back in. If the issue persists, contact our support team at support@v10gym.com.'
                },
                {
                    question: 'How do I reset my password?',
                    answer: 'On the login screen, tap "Forgot Password" and enter your email. You\'ll receive a password reset link within minutes.'
                },
                {
                    question: 'Is my data secure?',
                    answer: 'Yes, we use industry-standard encryption to protect your data. All information is stored securely and never shared with third parties. See our Privacy Policy for more details.'
                }
            ]
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Filter FAQs based on search query
    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <SettingPageLayout title="FAQ">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-[#1A1F2B] text-gray-900 dark:text-white placeholder-gray-400 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-gray-100 dark:border-gray-800 transition-all"
                    />
                </div>
            </div>

            {/* FAQ Categories */}
            {filteredFaqs.length > 0 ? (
                <div className="space-y-6">
                    {filteredFaqs.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">
                                {category.category}
                            </h2>
                            <div className="space-y-3">
                                {category.questions.map((faq, qIndex) => {
                                    const globalIndex = `${catIndex}-${qIndex}`;
                                    const isOpen = openIndex === globalIndex;

                                    return (
                                        <div
                                            key={qIndex}
                                            className="bg-white dark:bg-[#1A1F2B] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300"
                                        >
                                            <button
                                                onClick={() => toggleAccordion(globalIndex)}
                                                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <span className="font-bold text-gray-900 dark:text-white text-sm pr-4">
                                                    {faq.question}
                                                </span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'
                                                    }`}
                                            >
                                                <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                    <Search size={48} className="text-gray-300 mb-4" />
                    <p className="font-bold text-gray-800 dark:text-gray-200">No results found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search query</p>
                </div>
            )}

            {/* Contact Support */}
            <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Still need help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Can't find what you're looking for? Our support team is here to help!
                </p>
                <a
                    href="mailto:support@v10gym.com"
                    className="inline-block bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                >
                    Contact Support
                </a>
            </div>
        </SettingPageLayout>
    );
};

export default FAQ;
