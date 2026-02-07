import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Clock, User, Trophy, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/api';

const SuccessStoryManagement = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const response = await fetch(`${API_BASE_URL}/api/admin/stories/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStories(data);
            } else {
                toast.error('Failed to fetch stories');
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-4 p-2 min-w-[240px]">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                        <Trash2 className="text-red-500" size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Delete Story?</p>
                        <p className="text-xs text-gray-500">This action cannot be undone.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(id);
                        }}
                        className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-2.5 rounded-xl text-xs font-bold"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 4000,
            style: { borderRadius: '1rem', padding: '12px' }
        });
    };

    const confirmDelete = async (id) => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const response = await fetch(`${API_BASE_URL}/api/admin/stories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Story deleted successfully');
                setStories(stories.filter(s => s._id !== id));
            } else {
                toast.error('Failed to delete story');
            }
        } catch (error) {
            toast.error('Error deleting story');
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

    const filteredStories = stories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`${story.trainerId?.firstName} ${story.trainerId?.lastName}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Trophy className="text-amber-500" size={24} />
                            Success Story Lab
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Manage transformations shared by trainers</p>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search stories, members or trainers..."
                        className="pl-12 pr-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Lab Data...</p>
                </div>
            ) : filteredStories.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">No stories found</h3>
                    <p className="text-gray-500 text-sm mt-1">Either search again or wait for trainers to post</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStories.map(story => (
                        <div key={story._id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-500">
                            {/* Visuals */}
                            <div className="relative h-64 flex gap-0.5 scrollbar-hide touch-pan-x">
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => handleDelete(story._id)}
                                        className="p-3 bg-red-500 text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="relative w-1/2 h-full">
                                    <img src={getImageUrl(story.beforeImage)} alt="Before" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                        <span className="text-[8px] font-black uppercase text-white tracking-widest">Before</span>
                                    </div>
                                </div>
                                <div className="relative w-1/2 h-full">
                                    <img src={getImageUrl(story.afterImage)} alt="After" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute top-4 right-4 bg-emerald-500/90 px-3 py-1 rounded-full border border-white/20">
                                        <span className="text-[8px] font-black uppercase text-white tracking-widest">After</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                                        {story.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold text-emerald-500 uppercase">{story.memberName}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Clock size={12} /> {story.duration}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic line-clamp-3">
                                    "{story.description}"
                                </p>

                                <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                            {story.trainerId?.photo ? (
                                                <img src={getImageUrl(story.trainerId.photo)} alt="Trainer" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Posted By</p>
                                            <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase">
                                                {story.trainerId ? `${story.trainerId.firstName} ${story.trainerId.lastName}` : 'System'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SuccessStoryManagement;
