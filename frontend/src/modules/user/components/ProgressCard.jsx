import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Clock, Crown, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const ProgressCard = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    const [stats, setStats] = useState({ progress: 0, completions: 0, target: 5, todayType: 'Cardio', activeWorkoutId: null });

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/workouts/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
                setProgress(data.progress);
            }
        } catch (err) {
            console.error('Error fetching progress:', err);
        }
    };

    useEffect(() => {
        fetchStats();

        // Listen for internal completion events
        const handleCompletion = () => fetchStats();
        window.addEventListener('workoutCompleted', handleCompletion);
        return () => window.removeEventListener('workoutCompleted', handleCompletion);
    }, []);

    return (
        <div className="bg-white dark:bg-[#1A1F2B] rounded-[2rem] p-4 shadow-xl relative overflow-hidden transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-sm font-bold text-gray-800 dark:text-white">Progress</h2>
                        <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-md transition-colors duration-300">
                            <Grid size={12} className="text-gray-500" />
                        </div>
                    </div>
                    <span className="bg-[#10B981] text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide w-fit mb-1 shadow-sm">
                        {stats.todayType}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">Weekly<br />Goal</h3>

                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <div className="flex items-center gap-1 font-medium">
                            <Clock size={12} />
                            <span>{stats.completions} of {stats.target}</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium">
                            <Crown size={12} />
                            <span>Done</span>
                        </div>
                    </div>
                </div>

                <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-400 opacity-20 rounded-2xl -rotate-12 translate-x-1"></div>
                    <div className="relative z-10 w-full h-full bg-emerald-400 rounded-2xl flex items-center justify-center overflow-hidden">
                        <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="rgba(0,0,0,0.1)"
                                strokeWidth="6"
                                fill="transparent"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 28}
                                strokeDashoffset={(2 * Math.PI * 28) * (1 - (progress / 100))}
                                strokeLinecap="round"
                                className="text-[#FFBCB0] transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-base font-bold text-gray-900">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    if (stats.activeWorkoutId) {
                        navigate(`/workout-details/${stats.activeWorkoutId}`);
                    } else {
                        navigate('/workouts');
                    }
                }}
                className="w-full bg-[#1A1F2B] dark:bg-white text-white dark:text-black py-2.5 px-3 rounded-xl flex items-center justify-between font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 mt-2 group"
            >
                <span className="text-sm tracking-wide pl-1">Continue the workout</span>
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-emerald-200/50 shadow-lg group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={14} strokeWidth={3} />
                </div>
            </button>
        </div>
    );
};


export default ProgressCard;
