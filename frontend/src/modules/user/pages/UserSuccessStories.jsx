import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';

const UserSuccessStories = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/trainer/stories`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });
            const data = await response.json();
            if (response.ok) setStories(data);
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/settings')} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Success Stories</h1>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading stories...</div>
            ) : stories.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>No success stories yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {stories.map(story => (
                        <div key={story._id} className="bg-white dark:bg-[#1A1F2B] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                            {/* Before/After Split */}
                            <div className="relative h-64 flex">
                                <div className="w-1/2 relative">
                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">BEFORE</div>
                                    <img src={story.beforeImage} alt="Before" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-1/2 relative border-l-2 border-white">
                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-lg shadow-emerald-500/30">AFTER</div>
                                    <img src={story.afterImage} alt="After" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="text-xl font-bold leading-tight line-clamp-1">{story.title}</h3>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            {story.trainerId?.photo ? (
                                                <img src={story.trainerId.photo} alt="Trainer" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs">T</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trainer</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                                                {story.trainerId?.firstName} {story.trainerId?.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    {story.duration && (
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                            <Clock size={12} />
                                            <span>{story.duration}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    {story.description}
                                </p>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Client: <span className="text-gray-900 dark:text-white font-medium">{story.memberName}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSuccessStories;
