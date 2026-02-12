import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, X, Play, Clock, Zap, Target,
    CheckCircle, BarChart3, Flame, Dumbbell
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const WorkoutDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await fetch(`${API_BASE_URL}/api/user/workout-library/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setWorkout(data);
                }
            } catch (err) {
                console.error('Error fetching workout:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkout();
    }, [id]);

    const handleComplete = () => {
        setIsCompleted(true);
        setTimeout(() => navigate('/workouts'), 1500);
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!workout) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-xl font-bold dark:text-white">Workout not found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 font-bold">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FD] dark:bg-[#0D1117] flex flex-col">
            {/* Header */}
            <div className="p-6 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-30">
                <button onClick={() => navigate(-1)} className="p-2 text-indigo-900 dark:text-gray-300">
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tight">
                    {workout.title}
                </h1>
                <button onClick={() => navigate('/workouts')} className="p-2 text-indigo-900 dark:text-gray-300">
                    <X size={24} />
                </button>
            </div>

            {/* Visual Area */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                {workout.images?.length > 0 ? (
                    <img
                        src={getImageUrl(workout.images[currentImageIndex])}
                        alt={workout.title}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-sm"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Zap size={64} />
                    </div>
                )}

                {/* Dots */}
                {workout.images?.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {workout.images.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentImageIndex ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/50 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 bg-white dark:bg-[#121212] rounded-t-[3rem] -mt-10 relative z-10 px-8 pt-10 pb-32 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-black text-indigo-950 dark:text-white uppercase tracking-tight italic">
                            {workout.title}
                        </h2>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                                {workout.category}
                            </span>
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                                {workout.intensity}
                            </span>
                        </div>
                    </div>

                    {/* Main Stats Row */}
                    <div className="flex gap-4">
                        <div className="flex-1 p-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-900/30 flex flex-col items-center gap-1">
                            <Dumbbell size={20} className="text-indigo-600 mb-1" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Sets</span>
                            <span className="text-sm font-black text-indigo-950 dark:text-white">{workout.sets || '3 Sets'}</span>
                        </div>
                        <div className="flex-1 p-5 bg-amber-50/50 dark:bg-amber-950/20 rounded-[2rem] border border-amber-100/50 dark:border-amber-900/30 flex flex-col items-center gap-1">
                            <Zap size={20} className="text-amber-600 mb-1" />
                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Reps</span>
                            <span className="text-sm font-black text-indigo-950 dark:text-white">{workout.reps || '12 Reps'}</span>
                        </div>
                        <div className="flex-1 p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-900/30 flex flex-col items-center gap-1">
                            <Flame size={20} className="text-emerald-600 mb-1" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Burn</span>
                            <span className="text-sm font-black text-indigo-950 dark:text-white">{workout.calories || '150'}kcal</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tight italic">
                            About Workout
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                            {workout.description || 'Start in all fours, then prop yourself up on your forearms and toes, with your chin tucked in. Lift up your body, creating a straight line with your body. Maintain the position without arching the lower back.'}
                        </p>
                    </div>

                    {/* Grid Stats for more info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-[#1A1F2B] rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                <Zap size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Level</p>
                                <p className="text-sm font-bold text-indigo-950 dark:text-white">{workout.level || 'Beginner'}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-[#1A1F2B] rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Time</p>
                                <p className="text-sm font-bold text-indigo-950 dark:text-white">{workout.duration || '20 Mins'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default WorkoutDetails;
