import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Zap, Target, ChevronLeft, ChevronRight } from 'lucide-react';

const WorkoutDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Mock workout details with multiple images
    const workoutDetails = {
        title: 'Full Body HIIT',
        description: 'A high-intensity interval training session designed to burn calories and boost your metabolism. No equipment needed. This workout targets multiple muscle groups and improves cardiovascular endurance.',
        images: [
            'https://images.unsplash.com/photo-1517963879466-dbbcd8ebb0a9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800'
        ],
        duration: '25 min',
        intensity: 'High',
        level: 'Intermediate',
        calories: '320 kcal',
        category: 'HIIT',
        tags: ['Cardio', 'Full Body', 'No Equipment']
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % workoutDetails.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + workoutDetails.images.length) % workoutDetails.images.length);
    };

    const handleComplete = () => {
        setIsCompleted(true);

        // Update local storage progress
        const currentProgress = parseInt(localStorage.getItem('dailyWorkoutProgress') || '0', 10);
        const newProgress = Math.min(currentProgress + 20, 100);
        localStorage.setItem('dailyWorkoutProgress', newProgress.toString());

        // Dispatch event for same-window updates
        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
            navigate('/', { state: { workoutCompleted: true } });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 font-sans">
            {/* Constrain width for desktop view */}
            <div className="w-full max-w-md mx-auto bg-gray-50 dark:bg-[#121212] min-h-screen relative shadow-2xl overflow-hidden flex flex-col">

                {/* Header / Image Carousel Area */}
                <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-900 group">
                    <div className="w-full h-full relative overflow-hidden">
                        <img
                            src={workoutDetails.images[currentImageIndex]}
                            alt={`Workout ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                        {/* Gradient Overlay for Text Readability Logic */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-black/30 dark:from-[#121212] dark:via-transparent dark:to-black/50"></div>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 p-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md text-white hover:bg-white/40 dark:hover:bg-black/50 transition-colors z-20 shadow-sm"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    {/* Image Navigation Controls */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <button onClick={prevImage} className="p-2 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md text-white pointer-events-auto hover:bg-white/30 dark:hover:bg-black/50">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="p-2 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md text-white pointer-events-auto hover:bg-white/30 dark:hover:bg-black/50">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {workoutDetails.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex
                                        ? 'bg-emerald-500 w-4'
                                        : 'bg-white/70'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 px-6 -mt-4 relative z-10 text-gray-900 dark:text-white transition-colors duration-300">
                    <div className="flex items-start justify-between mb-2">
                        <h1 className="text-3xl font-bold leading-tight">{workoutDetails.title}</h1>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {workoutDetails.tags.map((tag, idx) => (
                            <span key={idx} className="bg-white dark:bg-[#1A1F2B] text-gray-500 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-gray-200 dark:border-white/5 shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-white dark:bg-[#1A1F2B] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-1.5 shadow-sm transition-colors duration-300">
                            <Zap size={20} className="text-amber-500" />
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{workoutDetails.intensity}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wide">Intensity</span>
                        </div>
                        <div className="bg-white dark:bg-[#1A1F2B] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-1.5 shadow-sm transition-colors duration-300">
                            <Target size={20} className="text-blue-500" />
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{workoutDetails.level}</span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wide">Level</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-24">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">About Workout</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-7 text-sm transition-colors duration-300">
                            {workoutDetails.description}
                        </p>
                    </div>
                </div>

                {/* Bottom Action Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent dark:from-[#121212] dark:via-[#121212]/95 dark:to-transparent z-20 transition-colors duration-300">
                    {!isCompleted ? (
                        <button
                            onClick={handleComplete}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white dark:text-black font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={20} />
                            <span>Mark as Complete</span>
                        </button>
                    ) : (
                        <div className="w-full bg-white dark:bg-[#1A1F2B] text-gray-900 dark:text-white font-bold py-4 rounded-2xl border border-emerald-500/30 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-5 fade-in shadow-md">
                            <CheckCircle size={20} className="text-emerald-500" />
                            <span className="text-emerald-500">Marked Completed!</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default WorkoutDetails;
