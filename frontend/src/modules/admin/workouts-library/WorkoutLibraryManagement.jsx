import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Trash2, Edit3, X, Upload,
    Dumbbell, Clock, Flame, BarChart, Tag, Zap,
    Image as ImageIcon, CheckCircle2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/api';

const WorkoutLibraryManagement = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Strength',
        intensity: 'Medium',
        level: 'Intermediate',
        duration: '',
        sets: '',
        reps: '',
        calories: '',
        description: '',
        tags: []
    });

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const response = await fetch(`${API_BASE_URL}/api/admin/workout-library`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setWorkouts(data);
        } catch (error) {
            toast.error('Failed to load workouts');
        } finally {
            setLoading(false);
        }
    };

    const [imageList, setImageList] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newImages = selectedFiles.map(file => ({
            type: 'new',
            file: file,
            preview: URL.createObjectURL(file)
        }));
        setImageList(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImageList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const token = adminInfo?.token;

        if (!token) {
            toast.error('Session expired. Please re-login.');
            return;
        }

        const loadingToast = toast.loading(editingWorkout ? 'Updating workout...' : 'Creating workout...');

        try {
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'tags') {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key] || '');
                }
            });

            // Separate existing images from new files
            const existingImages = imageList
                .filter(img => img.type === 'existing')
                .map(img => img.path);

            data.append('existingImages', JSON.stringify(existingImages));

            imageList.forEach(img => {
                if (img.type === 'new') {
                    data.append('images', img.file);
                }
            });

            const url = editingWorkout
                ? `${API_BASE_URL}/api/admin/workout-library/${editingWorkout._id}`
                : `${API_BASE_URL}/api/admin/workout-library`;

            const response = await fetch(url, {
                method: editingWorkout ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const resData = await response.json();

            if (response.ok) {
                toast.success(editingWorkout ? 'Workout updated!' : 'Workout created!');
                fetchWorkouts();
                closeModal();
            } else {
                toast.error(resData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Submit Error:', error);
            toast.error('Network error');
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this workout?')) return;

        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const response = await fetch(`${API_BASE_URL}/api/admin/workout-library/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Workout deleted');
                setWorkouts(workouts.filter(w => w._id !== id));
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const openEditModal = (workout) => {
        setEditingWorkout(workout);
        setFormData({
            title: workout.title,
            category: workout.category,
            intensity: workout.intensity,
            level: workout.level,
            duration: workout.duration,
            sets: workout.sets || '',
            reps: workout.reps || '',
            calories: workout.calories,
            description: workout.description,
            tags: workout.tags || []
        });

        // Load existing images
        if (workout.images && workout.images.length > 0) {
            const existing = workout.images.map(img => ({
                type: 'existing',
                path: img,
                preview: getImageUrl(img)
            }));
            setImageList(existing);
        } else {
            setImageList([]);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingWorkout(null);
        setFormData({
            title: '',
            category: 'Strength',
            intensity: 'Medium',
            level: 'Intermediate',
            duration: '',
            sets: '',
            reps: '',
            calories: '',
            description: '',
            tags: []
        });
        setImageList([]);
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        // Handle local paths and backslashes
        const normalizedPath = path.replace(/\\/g, '/');
        // If path starts with /, remove it to avoid double slashes
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

    const filteredWorkouts = workouts.filter(w =>
        w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10 min-h-screen">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                        <Dumbbell size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Workouts Library</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Design and manage popular workout templates for members</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search library..."
                            className="bg-gray-50 dark:bg-gray-800 border-none rounded-2xl pl-12 pr-6 py-3.5 text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                        <Plus size={20} />
                        New Workout
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {filteredWorkouts.map(workout => (
                        <div key={workout._id} className="group bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                            <div className="relative h-60 overflow-hidden">
                                {workout.images && workout.images.length > 0 ? (
                                    <img src={getImageUrl(workout.images[0])} alt={workout.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <span className="bg-white/95 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                        {workout.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-6 right-6 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(workout)}
                                        className="p-3 bg-white/90 dark:bg-gray-900/90 hover:bg-blue-600 hover:text-white text-blue-600 rounded-2xl shadow-xl transition-all active:scale-90"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(workout._id)}
                                        className="p-3 bg-white/90 dark:bg-gray-900/90 hover:bg-red-600 hover:text-white text-red-600 rounded-2xl shadow-xl transition-all active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{workout.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-2 font-medium leading-relaxed italic">
                                        "{workout.description || 'No description provided.'}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                        <Clock size={16} className="text-blue-500 mb-1" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Time</span>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate w-full text-center">{workout.duration || '--'}</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                        <Dumbbell size={16} className="text-emerald-500 mb-1" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Sets</span>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate w-full text-center">{workout.sets || '3 Sets'}</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                        <Zap size={16} className="text-amber-500 mb-1" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Reps</span>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate w-full text-center">{workout.reps || '12 Reps'}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Flame size={14} className="text-orange-500" />
                                        <span className="text-[11px] font-bold text-gray-500">{workout.calories || '--'} kcal</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${workout.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        workout.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                                            'bg-purple-100 text-purple-700'
                                        }`}>
                                        {workout.level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    {editingWorkout ? 'Update Template' : 'Create Workout Template'}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">Build a professional workout experience</p>
                            </div>
                            <button onClick={closeModal} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-10">
                            {/* Basics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Workout Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="e.g. Full Body HIIT Blast"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>HIIT</option>
                                        <option>Yoga</option>
                                        <option>Strength</option>
                                        <option>Cardio</option>
                                        <option>Pilates</option>
                                        <option>Functional</option>
                                    </select>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 bg-gray-50/50 dark:bg-gray-800/50 p-8 rounded-[2.5rem]">
                                <div className="space-y-2 lg:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1 flex items-center gap-1">
                                        <Clock size={12} /> Duration
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="45 Mins"
                                        className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 lg:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1">Sets</label>
                                    <input
                                        type="text"
                                        placeholder="3 Sets"
                                        className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                        value={formData.sets}
                                        onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 lg:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1">Reps/Time</label>
                                    <input
                                        type="text"
                                        placeholder="12 Reps"
                                        className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                        value={formData.reps}
                                        onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 lg:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1 flex items-center gap-1">
                                        <Flame size={12} /> Calories
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="300"
                                        className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                        value={formData.calories}
                                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 lg:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1">Intensity</label>
                                    <select
                                        className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                        value={formData.intensity}
                                        onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                                <div className="space-y-2 lg:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1">Level</label>
                                    <select
                                        className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="space-y-5">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Workout Images (Up to 5)</label>
                                <div className="flex flex-wrap gap-4">
                                    {imageList.map((img, i) => (
                                        <div key={i} className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-blue-500 shadow-xl group">
                                            <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {imageList.length < 5 && (
                                        <label className="w-32 h-32 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-500/50 hover:bg-blue-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                                            <Upload size={24} className="text-gray-400" />
                                            <span className="text-[8px] font-black uppercase text-gray-400">Add Pic</span>
                                            <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">About Workout</label>
                                <textarea
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-[2rem] px-8 py-6 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[160px]"
                                    placeholder="Explain the focus, muscle groups, and what to expect during this session..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <CheckCircle2 size={24} />
                                    {editingWorkout ? 'Update Library Item' : 'Publish to Library'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutLibraryManagement;
