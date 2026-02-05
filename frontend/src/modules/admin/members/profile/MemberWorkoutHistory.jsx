import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Folder, Search, ChevronDown, Dumbbell } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const WorkoutAccordion = ({ category, details, isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left outline-none"
            >
                <div className="flex flex-col">
                    <span className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-[#f97316]' : 'text-[#f97316]'}`}>
                        {category}
                    </span>
                    <span className={`text-[15px] font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>
                        {details.exercise}
                    </span>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`p-6 pt-0 animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className={`border-t pt-4 grid grid-cols-3 gap-6 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sets</p>
                            <p className="text-[14px] font-black">{details.sets || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reps</p>
                            <p className="text-[14px] font-black">{details.reps || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Weight</p>
                            <p className="text-[14px] font-black">{details.weight || '-'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MemberWorkoutHistory = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const {
        id,
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo
    } = context || {};

    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberWorkoutPlan = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const response = await fetch(`${API_BASE_URL}/api/admin/workouts/member/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${adminInfo?.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setWorkoutPlan(data);
                } else {
                    setWorkoutPlan(null);
                }
            } catch (err) {
                console.error('Error fetching member workout plan:', err);
                setWorkoutPlan(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberWorkoutPlan();
    }, [id]);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Workout History</h2>

            {/* Info Card */}
            <div className={`rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-5 space-y-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Mobile Number</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberMobile}</p>
                    </div>
                    <div className="p-5 space-y-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Email ID</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmail}</p>
                    </div>
                    <div className="p-5 space-y-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">DOB</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberDOB}</p>
                    </div>
                </div>
                <div className="border-t dark:border-white/10 border-gray-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-5 space-y-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Anniversary Date</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberAnniversary}</p>
                    </div>
                    <div className="p-5 space-y-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Emergency Contact Name</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyName}</p>
                    </div>
                    <div className="p-5 space-y-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Emergency Contact No</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyNo}</p>
                    </div>
                </div>
            </div>

            {/* Active Workout Plan */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : workoutPlan ? (
                <div className="space-y-6">
                    <div className={`p-5 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#f97316]/10 p-3 rounded-xl text-[#f97316]">
                                <Dumbbell size={24} />
                            </div>
                            <div>
                                <h3 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{workoutPlan.name}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Assigned Plan</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {workoutPlan.schedule.map((dayPlan, dIdx) => (
                            dayPlan.exercises && dayPlan.exercises.length > 0 && (
                                <div key={dIdx} className="space-y-4">
                                    <div className="w-full bg-[#fff7ed] dark:bg-[#fff7ed]/10 border border-[#ffedd5] dark:border-[#ffedd5]/20 text-[#f97316] py-3 rounded-xl text-center text-[13px] font-black tracking-widest uppercase">
                                        {dayPlan.day}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dayPlan.exercises.map((ex, eIdx) => (
                                            <WorkoutAccordion
                                                key={eIdx}
                                                category={ex.category}
                                                details={ex}
                                                isDarkMode={isDarkMode}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="relative">
                        <Folder size={100} className="text-yellow-400 fill-yellow-200 opacity-20" />
                        <Search size={40} className="text-[#f97316] absolute -bottom-2 -left-4 bg-white dark:bg-[#1a1a1a] rounded-full p-2 border-4 border-white dark:border-[#1a1a1a] shadow-lg" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Active Workout Plan</h3>
                        <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto mt-2">This member currently has no assigned workout plan in the system.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberWorkoutHistory;
