import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Send, CheckCircle2, MessageCircle, Info, AlertTriangle, ThumbsUp, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const Feedback = () => {
    const navigate = useNavigate();

    // Form State
    const [feedbackType, setFeedbackType] = useState('Suggestion');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successId, setSuccessId] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/feedback`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setHistory(data);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.error('Error fetching feedback history:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || rating === 0) return;

        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            alert('Please login first');
            return;
        }

        setIsSubmitting(true);
        setSuccessId(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    type: feedbackType,
                    message,
                    rating
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessId(data.feedbackId || data._id);
                setMessage('');
                setRating(0);
                setFeedbackType('Suggestion');
                fetchHistory();
            } else {
                alert(`Error: ${data.message || 'Submission failed'}`);
            }
        } catch (err) {
            alert(`Connection Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Complaint': return <AlertTriangle size={18} className="text-rose-500" />;
            case 'Compliment': return <ThumbsUp size={18} className="text-emerald-500" />;
            default: return <Info size={18} className="text-[#1A1F2B] dark:text-white dark:opacity-70" />;
        }
    };

    return (
        <div className="flex flex-col pb-24 font-sans transition-colors duration-300 min-h-screen bg-gray-50 dark:bg-[#080B11]">

            {/* Header Section - Adjusted padding to fix overlap */}
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-6 pb-28 rounded-b-[2.5rem] relative transition-colors duration-300 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 active:scale-95 transition-all border border-white/5"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[2px]">Support Active</span>
                    </div>
                </div>

                <div className="mb-2">
                    <h3 className="text-gray-400 text-xs font-medium opacity-80 mb-0.5">We're listening to you</h3>
                    <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Feedback Hub</h1>
                </div>
            </div>

            {/* Content Area - Adjusted marginTop to prevent cutting off text */}
            <div className="px-5 -mt-12 space-y-8 relative z-10">

                {/* Form Card */}
                <div className="bg-white dark:bg-[#1A1F2B] rounded-[2rem] p-7 shadow-2xl border border-gray-100 dark:border-white/5 transition-colors duration-300">

                    {successId ? (
                        <div className="py-10 text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 rotate-6">
                                <CheckCircle2 size={36} className="text-white -rotate-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">MESSAGE SENT!</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-8">
                                Ticket Ref: <span className="text-blue-500 italic">#{successId}</span>
                            </p>
                            <button
                                onClick={() => setSuccessId(null)}
                                className="w-full py-4.5 bg-[#1A1F2B] dark:bg-white dark:text-[#1A1F2B] text-white rounded-2xl font-bold text-xs uppercase tracking-[2px] shadow-lg active:scale-95 transition-all"
                            >
                                Submit New Feedback
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Category Selector - Added more internal top padding */}
                            <div className="space-y-4 pt-1">
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[2px] block px-1 text-center">Category</span>
                                <div className="flex bg-gray-50 dark:bg-black/20 p-1.5 rounded-2xl gap-1 shadow-inner relative z-20">
                                    {['Suggestion', 'Complaint', 'Compliment'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFeedbackType(type)}
                                            className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${feedbackType === type
                                                ? 'bg-white dark:bg-[#252A36] text-blue-600 dark:text-blue-400 shadow-md transform scale-[1.02]'
                                                : 'text-gray-400 dark:text-gray-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Rating */}
                            <div className="space-y-4 text-center">
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[2px] block">Rate Experience</span>
                                <div className="flex justify-center gap-3.5 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform active:scale-75 cursor-pointer"
                                        >
                                            <Star
                                                size={36}
                                                className={`transition-all duration-300 ${star <= (hoverRating || rating)
                                                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                                                    : 'text-gray-100 dark:text-[#252A36]'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message Entry */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[2px]">Message</span>
                                    <span className="text-[9px] font-bold text-gray-300 tabular-nums">{message.length}/300</span>
                                </div>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                                    placeholder="Briefly describe your thoughts..."
                                    className="w-full bg-gray-50 dark:bg-black/20 border-0 rounded-3xl p-6 text-[14px] font-semibold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all h-36 resize-none leading-relaxed shadow-inner"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !message.trim() || rating === 0}
                                className={`w-full py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-[3px] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${isSubmitting || !message.trim() || rating === 0
                                    ? 'bg-gray-100 dark:bg-white/5 text-gray-200 dark:text-gray-800'
                                    : 'bg-[#1A1F2B] dark:bg-white dark:text-[#1A1F2B] text-white'}`}
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white dark:border-[#1A1F2B]/30 dark:border-t-[#1A1F2B] rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Post Feedback</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* History Section */}
                <div className="space-y-6 pb-12">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white px-1 tracking-tight">Recent History</h2>

                    <div className="flex flex-col gap-4">
                        {Array.isArray(history) && history.length > 0 ? (
                            history.map((item) => (
                                <div key={item._id} className="bg-white dark:bg-[#1A1F2B] rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-white/5 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 bg-gray-50 dark:bg-[#252A36] rounded-xl flex items-center justify-center shadow-inner">
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{item.type}</h4>
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter italic">Ref: #{item.feedbackId}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-transparent ${item.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <p className="text-[13px] text-gray-700 dark:text-gray-300 font-bold leading-relaxed italic opacity-90 pl-1">
                                        "{item.message}"
                                    </p>

                                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50 dark:border-gray-800 opacity-60">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={11} className={s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-100 dark:text-[#252A36]'} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(item.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>

                                    {item.replyMessage && (
                                        <div className="mt-5 bg-blue-50/50 dark:bg-blue-500/5 rounded-[1.5rem] p-4 border border-blue-100/30 dark:border-blue-500/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageCircle size={14} className="text-blue-500" />
                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[2px]">Admin Reply</span>
                                            </div>
                                            <p className="text-[12px] text-gray-700 dark:text-gray-300 font-bold leading-relaxed italic">
                                                {item.replyMessage}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                                <MessageSquare size={40} className="mx-auto mb-3 text-gray-200 dark:text-gray-800 opacity-40" />
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">No history logs yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
