import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Zap, Target, Calendar } from 'lucide-react';

const AssignedWorkoutDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState('');
    const [completedExercises, setCompletedExercises] = useState([]);

    // Load persisted progress on mount or day change
    useEffect(() => {
        if (id && activeDay) {
            const savedProgress = localStorage.getItem(`workout_progress_${id}_${activeDay}`);
            if (savedProgress) {
                setCompletedExercises(JSON.parse(savedProgress));
            } else {
                setCompletedExercises([]);
            }
        }
    }, [id, activeDay]);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (id && activeDay && completedExercises.length > 0) {
            localStorage.setItem(`workout_progress_${id}_${activeDay}`, JSON.stringify(completedExercises));
        } else if (id && activeDay && completedExercises.length === 0) {
            localStorage.removeItem(`workout_progress_${id}_${activeDay}`);
        }
    }, [completedExercises, id, activeDay]);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/workouts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const selected = data.find(p => p._id === id);
                    setPlan(selected);
                    if (selected && selected.schedule.length > 0) {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const todayName = days[new Date().getDay()];
                        const todaySchedule = selected.schedule.find(s => s.day === todayName);

                        if (todaySchedule) {
                            setActiveDay(todayName);
                        } else {
                            setActiveDay(selected.schedule[0].day);
                        }
                    }
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

            const response = await fetch('http://localhost:5000/api/user/workouts/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({
                    workoutId: id,
                    completedExercises: exerciseIds
                })
            });

            if (response.ok) {
                // Clear the persisted progress for this day
                localStorage.removeItem(`workout_progress_${id}_${activeDay}`);

                // Dispatch event to update progress everywhere
                window.dispatchEvent(new Event('workoutCompleted'));
                navigate('/');
            }

        } catch (err) {
            console.error('Error logging workout:', err);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 font-sans pb-24">
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-10 px-6 pb-20 rounded-b-[3rem] relative shadow-xl">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-white/10 backdrop-blur-md mb-6 hover:bg-white/20 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-black mb-2 leading-tight">{plan.name}</h1>
                <div className="flex items-center gap-4 text-white/60 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> My Personal Plan</span>
                </div>

                {/* Day Selector */}
                <div className="absolute -bottom-6 left-6 right-6 flex gap-2 overflow-x-auto scollbar-hide pb-2">
                    {plan.schedule.map((s) => (
                        <button
                            key={s.day}
                            onClick={() => {
                                setActiveDay(s.day);
                            }}
                            className={`px-6 py-3 rounded-2xl whitespace-nowrap text-xs font-black transition-all shadow-lg ${activeDay === s.day
                                ? 'bg-emerald-500 text-white scale-105'
                                : 'bg-white dark:bg-[#1A1F2B] text-gray-400 dark:text-gray-500'}`}
                        >
                            {s.day}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 mt-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Daily Routine</h2>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase">
                        {activeSchedule?.workoutType || 'General'}
                    </span>
                </div>

                <div className="flex flex-col gap-4">
                    {activeSchedule?.exercises.length > 0 ? (
                        activeSchedule.exercises.map((ex, idx) => (
                            <div
                                key={idx}
                                onClick={() => toggleExercise(idx)}
                                className={`p-5 rounded-[2rem] shadow-sm border transition-all flex items-center gap-4 group cursor-pointer ${completedExercises.includes(idx)
                                    ? 'bg-emerald-500/10 border-emerald-500/50 scale-[0.98]'
                                    : 'bg-white dark:bg-[#1A1F2B] border-gray-100 dark:border-gray-800 hover:shadow-md'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${completedExercises.includes(idx)
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-500'
                                    }`}>
                                    {completedExercises.includes(idx) ? <CheckCircle size={24} /> : idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold mb-1 transition-colors ${completedExercises.includes(idx) ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{ex.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                            <Zap size={12} className="text-amber-500" /> {ex.sets} Sets
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                            <Target size={12} className="text-blue-500" /> {ex.reps} Reps
                                        </div>
                                        {ex.weight && (
                                            <div className="text-[11px] font-bold text-emerald-500">
                                                {ex.weight}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {completedExercises.includes(idx) && (
                                    <div className="text-emerald-500 animate-in zoom-in duration-300">
                                        <CheckCircle size={28} fill="currentColor" className="text-white dark:text-emerald-500" />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center opacity-30">
                            <Clock size={48} className="mx-auto mb-4" />
                            <p className="font-bold">Rest Day / No Exercises</p>
                        </div>
                    )}
                </div>
            </div>


            {/* Float Mark Completed */}
            <div className="fixed bottom-6 left-6 right-6">
                <button
                    onClick={handleFinishSession}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <CheckCircle size={20} />
                    Finish Session
                </button>
            </div>
        </div>
    );
};

export default AssignedWorkoutDetails;
