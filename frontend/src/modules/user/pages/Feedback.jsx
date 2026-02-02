import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Star, Send, Clock, CheckCircle2, MessageCircle } from 'lucide-react';

const Feedback = () => {
    const navigate = useNavigate();

    // Form State
    const [feedbackType, setFeedbackType] = useState('Suggestion');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successId, setSuccessId] = useState(null);

    // Mock History Data
    const [history, setHistory] = useState([
        {
            id: '101',
            type: 'Complaint',
            message: 'Air conditioning in the cardio area is not working properly.',
            rating: 2,
            status: 'Replied',
            date: 'Jan 28, 2026',
            reply: 'Thank you for reporting this. We have scheduled maintenance for tomorrow morning.'
        },
        {
            id: '102',
            type: 'Compliment',
            message: 'Loved the new yoga class instructor!',
            rating: 5,
            status: 'Read',
            date: 'Jan 25, 2026',
            reply: null
        },
        {
            id: '103',
            type: 'Suggestion',
            message: 'Can we have more 5kg dumbbells?',
            rating: 3,
            status: 'New',
            date: 'Jan 20, 2026',
            reply: null
        }
    ]);

    const feedbackTypes = ['Suggestion', 'Complaint', 'Compliment'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() || rating === 0) return;

        setIsSubmitting(true);

        // Mock API Call
        setTimeout(() => {
            const newFeedback = {
                id: Math.floor(Math.random() * 1000).toString(),
                type: feedbackType,
                message: message,
                rating: rating,
                userId: 'hidden-user-id-123', // Hidden as requested
                status: 'New',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                reply: null
            };

            // Log object as requested
            console.log('Form Data Submitted:', newFeedback);

            setHistory([newFeedback, ...history]);
            setSuccessId(newFeedback.id);
            setMessage('');
            setRating(0);
            setIsSubmitting(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessId(null), 5000);
        }, 1500);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-500 text-white';
            case 'Read': return 'bg-amber-500 text-black';
            case 'Replied': return 'bg-emerald-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300 font-sans flex flex-col">

            {/* Header */}
            <div className="bg-white dark:bg-[#1A1F2B] pt-8 px-5 pb-6 shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Voice Your Opinion</h1>
                        <p className="text-xs text-gray-400 font-medium">Help us improve your gym experience</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-5 pb-24 max-w-md mx-auto w-full">

                {/* Feedback Form Card */}
                <div className="bg-white dark:bg-[#1e293b]/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-white/5 mb-8">

                    {successId ? (
                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                                <CheckCircle2 size={32} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Feedback Sent!</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Success! Your Feedback ID is #{successId}</p>
                            <button
                                onClick={() => setSuccessId(null)}
                                className="mt-6 text-sm text-blue-500 font-bold hover:underline"
                            >
                                Send another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Type Selection */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Feedback Type</label>
                                <div className="flex bg-gray-100 dark:bg-black/30 p-1 rounded-xl">
                                    {feedbackTypes.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFeedbackType(type)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${feedbackType === type
                                                    ? 'bg-white dark:bg-blue-600 text-black dark:text-white shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Rate Experience</label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors duration-200 ${star <= (hoverRating || rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300 dark:text-gray-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                    Message <span className="float-right font-normal normal-case">{message.length}/300</span>
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition-all resize-none h-32"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !message.trim() || rating === 0}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Submit Feedback</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* History Section */}
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        My Past Feedback
                    </h2>

                    <div className="space-y-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-[#1e293b]/50 rounded-xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.type === 'Complaint' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                item.type === 'Suggestion' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {item.type}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{item.date}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                                    "{item.message}"
                                </p>
                                <div className="flex items-center gap-1 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}
                                        />
                                    ))}
                                </div>

                                {item.reply && (
                                    <div className="mt-3 bg-gray-50 dark:bg-black/20 rounded-lg p-3 border-l-2 border-emerald-500">
                                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                                            <MessageCircle size={12} /> Admin Response
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                            {item.reply}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Feedback;
