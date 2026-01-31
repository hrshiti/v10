import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'Membership',
            questions: [
                {
                    question: 'How to sign up?',
                    answer: 'Go to Profile > Upgrade Membership. Choose a plan and pay via app.'
                },
                {
                    question: 'Can I cancel anytime?',
                    answer: 'Yes, cancel via Settings. Access remains until billing cycle ends.'
                },
                {
                    question: 'Payment methods?',
                    answer: 'We accept credit cards, PayPal, Apple Pay, and Google Pay.'
                }
            ]
        },
        {
            category: 'Workouts',
            questions: [
                {
                    question: 'How to track progress?',
                    answer: 'Auto-tracked in Workouts tab. See stats and trends there.'
                },
                {
                    question: 'Custom workout plans?',
                    answer: 'Yes, go to Workouts > Create Custom Plan to build your own.'
                },
                {
                    question: 'Video tutorials?',
                    answer: 'Yes, tap any exercise to watch a demo video.'
                }
            ]
        },
        {
            category: 'Diet & Nutrition',
            questions: [
                {
                    question: 'Meal planner?',
                    answer: 'AI creates plans based on your goals. Customize in Diet tab.'
                },
                {
                    question: 'Water tracker?',
                    answer: 'Log water on Home screen using the + button.'
                },
                {
                    question: 'Vegan options?',
                    answer: 'Yes, set dietary preferences in Settings.'
                }
            ]
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

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
                        <h1 className="text-xl font-bold">FAQ</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 pb-24 overflow-y-auto">
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-[#1A1F2B] text-gray-900 dark:text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl focus:outline-none border border-gray-200 dark:border-gray-800 text-sm shadow-sm"
                        />
                    </div>

                    {/* FAQ Categories */}
                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-6">
                            {filteredFaqs.map((category, catIndex) => (
                                <div key={catIndex}>
                                    <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-2">
                                        {category.category}
                                    </h2>
                                    <div className="space-y-3">
                                        {category.questions.map((faq, qIndex) => {
                                            const globalIndex = `${catIndex}-${qIndex}`;
                                            const isOpen = openIndex === globalIndex;
                                            return (
                                                <div
                                                    key={qIndex}
                                                    className="bg-white dark:bg-[#1A1F2B] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
                                                >
                                                    <button
                                                        onClick={() => toggleAccordion(globalIndex)}
                                                        className="w-full p-4 flex items-center justify-between text-left"
                                                    >
                                                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                            {faq.question}
                                                        </span>
                                                        <ChevronDown
                                                            size={18}
                                                            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>
                                                    <div className={`transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0'} overflow-hidden`}>
                                                        <div className="p-4 pt-0 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-800/50 mt-2">
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
                        <div className="py-20 text-center opacity-50">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No results found</p>
                        </div>
                    )}

                    {/* Contact Support */}
                    <div className="mt-8 p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 text-center">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Still need help?</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            Contact our support team
                        </p>
                        <a
                            href="mailto:support@v10gym.com"
                            className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20"
                        >
                            Email Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
