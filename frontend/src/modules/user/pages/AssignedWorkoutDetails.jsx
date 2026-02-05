import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Zap, Target, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const AssignedWorkoutDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState('');
    const [completedDays, setCompletedDays] = useState([]);
    const [completedExercises, setCompletedExercises] = useState([]);

    // Check completion status from backend
    useEffect(() => {
        const checkStatus = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/workouts/status?workoutId=${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
                });
                const data = await response.json();
                if (data.completedDays) {
                    setCompletedDays(data.completedDays);
                } else if (data.completed && !data.completedDays) {
                    // Fallback for old logs or legacy response: 
                    // If marked completed but no specific day recorded, assume 'today' (week day name) is done?
                    // Better to just let them redo if we are moving to strict day tracking.
                    // But to be safe, maybe don't block anything if day is unknown.
                    setCompletedDays([]);
                }
            } catch (err) {
                console.error("Error checking status:", err);
            }
        };
        checkStatus();
    }, [id]);

    const isDayCompleted = completedDays.includes(activeDay);

    // Load persisted progress on mount or day change (only if not completed)
    useEffect(() => {
        if (id && activeDay && !isDayCompleted) {
            const savedProgress = localStorage.getItem(`workout_progress_${id}_${activeDay}`);
            if (savedProgress) {
                setCompletedExercises(JSON.parse(savedProgress));
            } else {
                setCompletedExercises([]);
            }
        }
    }, [id, activeDay, isDayCompleted]);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (id && activeDay && completedExercises.length > 0 && !isDayCompleted) {
            localStorage.setItem(`workout_progress_${id}_${activeDay}`, JSON.stringify(completedExercises));
        } else if (id && activeDay && completedExercises.length === 0) {
            localStorage.removeItem(`workout_progress_${id}_${activeDay}`);
        }
    }, [completedExercises, id, activeDay, isDayCompleted]);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/workouts`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const selected = data.find(p => p._id === id);
                    setPlan(selected);

                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const todayName = dayNames[new Date().getDay()];
                    setActiveDay(todayName);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, [id]);

    const activeSchedule = plan?.schedule?.find(s => s.day === activeDay);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!plan) return (
        <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-xl font-bold dark:text-white">Workout Not Found</h2>
            <button onClick={() => navigate(-1)} className="mt-4 text-emerald-500 font-bold flex items-center gap-2">
                <ArrowLeft size={20} /> Go Back
            </button>
        </div>
    );

    const toggleExercise = (idx) => {
        if (isDayCompleted) return;
        if (completedExercises.includes(idx)) {
            setCompletedExercises(completedExercises.filter(i => i !== idx));
        } else {
            setCompletedExercises([...completedExercises, idx]);
        }
    };


    const handleFinishSession = async () => {
        try {
            const exerciseIds = activeSchedule?.exercises
                .filter((_, idx) => completedExercises.includes(idx))
                .map(ex => ex._id);

            const response = await fetch(`${API_BASE_URL}/api/user/workouts/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({
                    workoutId: id,
                    day: activeDay,
                    completedExercises: exerciseIds
                })
            });

            if (response.ok) {
                // Clear the persisted progress
                localStorage.removeItem(`workout_progress_${id}_${activeDay}`);
                setCompletedDays([...completedDays, activeDay]);
                window.dispatchEvent(new Event('workoutCompleted'));
            }

        } catch (err) {
            console.error('Error logging workout:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 font-sans pb-32">
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-14 px-6 pb-20 rounded-b-[3.5rem] relative shadow-2xl overflow-hidden">
                {/* Header Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mt-10"></div>

                <div className="relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-8 hover:bg-white/20 active:scale-90 transition-all shadow-lg"
                    >
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </button>

                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-2">
                            <Calendar size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Personal Plan</span>
                        </div>
                        <h1 className="text-4xl font-black mb-1 leading-tight tracking-tighter uppercase italic">{plan.name}</h1>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">Ready to crush it?</p>
                    </div>
                </div>

                {/* Day Selector */}
                <div className="absolute -bottom-6 left-6 right-6 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const hasWorkout = plan.schedule.some(s => s.day === day && s.exercises?.length > 0);
                        const isToday = day === ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

                        return (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`px-5 py-3 rounded-2xl whitespace-nowrap text-[11px] font-black transition-all shadow-lg flex flex-col items-center gap-1.5 border ${activeDay === day
                                    ? 'bg-emerald-500 text-white border-emerald-400 scale-105'
                                    : 'bg-white/5 dark:bg-[#1A1F2B] text-gray-400 border-white/5'}`}
                            >
                                <span className="tracking-widest uppercase">{day.substring(0, 3)}</span>
                                {hasWorkout ? (
                                    <div className={`w-1 h-1 rounded-full ${activeDay === day ? 'bg-white' : 'bg-emerald-500'} animate-pulse`}></div>
                                ) : (
                                    <div className="w-1 h-1"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 mt-10">

                {isDayCompleted ? (
                    <div className="bg-emerald-500 text-white rounded-3xl p-8 shadow-xl mb-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <CheckCircle size={40} className="text-white" strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tight">Session Complete!</h2>
                        <p className="text-sm font-bold opacity-90 max-w-[200px]">Today's session is complete. See you next day!</p>
                        <button onClick={() => navigate('/')} className="mt-6 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                            Go Home
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-6 shadow-xl mb-8 border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Daily Progress</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                        {completedExercises.length} of {activeSchedule?.exercises.length || 0} Exercises Completed
                                    </p>
                                </div>
                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            fill="transparent"
                                            className="text-gray-100 dark:text-gray-800"
                                        />
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 24}
                                            strokeDashoffset={(2 * Math.PI * 24) * (1 - (activeSchedule?.exercises.length > 0 ? completedExercises.length / activeSchedule.exercises.length : 0))}
                                            strokeLinecap="round"
                                            className="text-emerald-500 transition-all duration-500 ease-out"
                                        />
                                    </svg>
                                    <span className="absolute text-[10px] font-black dark:text-white">
                                        {Math.round((activeSchedule?.exercises.length > 0 ? (completedExercises.length / activeSchedule.exercises.length) * 100 : 0))}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                    style={{ width: `${activeSchedule?.exercises.length > 0 ? (completedExercises.length / activeSchedule.exercises.length) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">Daily Routine</h2>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                {activeDay} Session
                            </span>
                        </div>

                        <div className="flex flex-col gap-4">
                            {activeSchedule?.exercises.length > 0 ? (
                                activeSchedule.exercises.map((ex, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => toggleExercise(idx)}
                                        className={`p-5 rounded-[2.5rem] shadow-sm border transition-all flex items-center gap-4 group cursor-pointer active:scale-95 ${completedExercises.includes(idx)
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20'
                                            : 'bg-white dark:bg-[#1A1F2B] border-gray-100 dark:border-gray-800 hover:border-emerald-500/30'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-lg transition-all duration-300 ${completedExercises.includes(idx)
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rotate-6'
                                            : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500'
                                            }`}>
                                            {completedExercises.includes(idx) ? <CheckCircle size={24} /> : idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-black text-[15px] mb-1.5 transition-colors uppercase tracking-tight ${completedExercises.includes(idx) ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{ex.exercise || ex.name}</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                                                    <Zap size={12} className="text-amber-500" fill="currentColor" /> {ex.sets} Sets
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                                                    <Target size={12} className="text-blue-500" /> {ex.reps} Reps
                                                </div>
                                                {ex.weight && (
                                                    <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
                                                        {ex.weight}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {completedExercises.includes(idx) && (
                                            <div className="text-emerald-500 animate-in zoom-in duration-300 pr-2">
                                                <div className="bg-emerald-500 rounded-full p-2 text-white shadow-lg shadow-emerald-500/30">
                                                    <CheckCircle size={20} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                        <Clock size={40} className="text-gray-400" />
                                    </div>
                                    <p className="font-black uppercase tracking-widest text-sm">Rest Day / No Exercises</p>
                                    <p className="text-xs font-bold mt-1">Enjoy your recovery!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>


            {/* Float Mark Completed - Show even for Rest Days so user can track consistency */}
            {!isDayCompleted && (
                <div className="fixed bottom-24 left-0 right-0 px-6 z-40 w-full max-w-md mx-auto">
                    <button
                        onClick={handleFinishSession}
                        className="w-full bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all border-4 border-white dark:border-[#121212] tracking-widest uppercase"
                    >
                        <CheckCircle size={22} strokeWidth={3} />
                        {activeSchedule?.exercises?.length > 0 ? 'Finish Session' : 'Mark Rest Day Complete'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AssignedWorkoutDetails;
