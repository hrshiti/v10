import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/api';
import SuccessStoryCard from '../../user/components/SuccessStoryCard';

const MyStories = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/trainer/my-stories`, {
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

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-4 p-2 min-w-[200px]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                        <Trash2 className="text-red-600 dark:text-red-400" size={20} />
                    </div>
                    <div>
                        <p className="font-black text-sm dark:text-white uppercase tracking-tight leading-none">Delete Story?</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-widest leading-none">This cannot be undone</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(id);
                        }}
                        className="flex-1 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'bottom-center',
            style: {
                borderRadius: '1.5rem',
                background: '#fff',
                color: '#333',
                padding: '12px',
                border: '1px solid #fee2e2'
            },
        });
    };

    const confirmDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/trainer/story/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });

            if (response.ok) {
                toast.success('Story deleted successfully', {
                    icon: '🚀',
                    style: { borderRadius: '1rem', fontBlack: true }
                });
                setStories(stories.filter(s => s._id !== id));
            } else {
                toast.error('Failed to delete story');
            }
        } catch (error) {
            toast.error('Error deleting story');
        }
    };

    const handleEdit = (story) => {
        navigate(`/trainer/story/edit/${story._id}`, { state: { story } });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 pb-24">
            <div className="flex justify-between items-center mb-8 pt-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-[#1A1F2B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:scale-90 transition-all">
                        <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Success Lab</h1>
                </div>
                <button
                    onClick={() => navigate('/trainer/story/add')}
                    className="bg-emerald-500 text-white p-3 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-[3px] mt-6 text-gray-400">Loading your wins...</p>
                </div>
            ) : stories.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1A1F2B] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm mt-4">
                    <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Plus className="text-gray-400" size={40} />
                    </div>
                    <p className="text-gray-900 dark:text-white font-black text-xl">No stories yet</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-[200px] mx-auto font-medium">Publish your first client transformation today!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {stories.map(story => (
                        <SuccessStoryCard
                            key={story._id}
                            story={story}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyStories;
