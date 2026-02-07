import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/api';

const AddSuccessStory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        memberName: '',
        description: '',
        duration: '',
        beforeImage: null,
        afterImage: null
    });

    const [previewImages, setPreviewImages] = useState({
        before: null,
        after: null
    });

    useEffect(() => {
        if (isEdit && location.state?.story) {
            const story = location.state.story;
            setFormData({
                title: story.title || '',
                memberName: story.memberName || '',
                description: story.description || '',
                duration: story.duration || '',
                beforeImage: null, // Reset to null as we are not re-uploading unless changed
                afterImage: null
            });
            setPreviewImages({
                before: getImageUrl(story.beforeImage),
                after: getImageUrl(story.afterImage)
            });
        }
    }, [isEdit, location.state]);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
            setPreviewImages(prev => ({ ...prev, [field === 'beforeImage' ? 'before' : 'after']: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('memberName', formData.memberName);
            data.append('description', formData.description);
            data.append('duration', formData.duration);
            if (formData.beforeImage) data.append('beforeImage', formData.beforeImage);
            if (formData.afterImage) data.append('afterImage', formData.afterImage);

            const url = isEdit
                ? `${API_BASE_URL}/api/user/trainer/story/${id}`
                : `${API_BASE_URL}/api/user/trainer/story`;

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: data
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(isEdit ? 'Story updated!' : 'Success Story Added!');
                navigate('/trainer/stories');
            } else {
                toast.error(result.message || 'Action failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving story');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (typeof path !== 'string') return null;
        if (path.startsWith('http') || path.startsWith('blob:')) return path;
        return `${API_BASE_URL}/${path}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 pb-24">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white dark:bg-[#1A1F2B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:scale-90 transition-all"
                >
                    <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                    {isEdit ? 'Refine Story' : 'New Story'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium transition-all"
                            placeholder="e.g. 10kg Weight Loss Journey"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Member</label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium transition-all"
                                placeholder="Client's Name"
                                value={formData.memberName}
                                onChange={e => setFormData({ ...formData, memberName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Duration</label>
                            <input
                                type="text"
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium transition-all"
                                placeholder="e.g. 12 Weeks"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Transformation Photos</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="relative aspect-square border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] overflow-hidden group transition-all hover:border-emerald-500/50">
                                {previewImages.before ? (
                                    <img src={previewImages.before} alt="Before" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="bg-white dark:bg-[#1A1F2B] p-3 rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                            <Upload size={20} className="text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Before</span>
                                    </>
                                )}
                                <input type="file" required={!isEdit} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'beforeImage')} />
                            </div>
                        </div>
                        <div>
                            <div className="relative aspect-square border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] overflow-hidden group transition-all hover:border-emerald-500/50">
                                {previewImages.after ? (
                                    <img src={previewImages.after} alt="After" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="bg-white dark:bg-[#1A1F2B] p-3 rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                            <Upload size={20} className="text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-emerald-500/60">After</span>
                                    </>
                                )}
                                <input type="file" required={!isEdit} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'afterImage')} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Journey Story</label>
                    <textarea
                        className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium transition-all min-h-[120px] resize-none"
                        placeholder="Tell the inspiration behind this transformation..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Plus size={18} />
                    )}
                    <span>{isEdit ? 'Save Changes' : 'Publish Story'}</span>
                </button>
            </form>
        </div>
    );
};

export default AddSuccessStory;
