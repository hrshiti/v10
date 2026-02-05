import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical, Search, Clock, Info } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const DietPlanSection = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);

    React.useEffect(() => {
        const fetchDietPlan = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/diet-plan`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setPlan(data);
                } else {
                    setError(data.message || 'Failed to fetch diet plan');
                }
            } catch (err) {
                setError('Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchDietPlan();
    }, []);

    const toggleDay = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-1">Diet Plan Management</h2>



            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1A1F2B] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold animate-pulse">Loading your custom diet...</p>
                </div>
            ) : error || !plan ? (
                <div className="bg-white dark:bg-[#1A1F2B] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-10 flex flex-col items-center text-center shadow-sm transition-colors duration-300">
                    <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 text-orange-500">
                        <Info size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Diet Plan Assigned</h3>
                    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                        Hold tight! Your trainer hasn't assigned a personalized diet plan yet. Check back soon.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-1.5">
                    <div className="text-xs font-bold text-gray-400 mb-2 px-1 uppercase tracking-wider">Active Plan: <span className="text-orange-500">{plan.name}</span></div>

                    {plan.weeklyPlan.map((dayData) => (
                        <div key={dayData.day} className="bg-white dark:bg-[#1A1F2B] rounded-[1rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
                            {/* Card Header */}
                            <div
                                className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                                onClick={() => toggleDay(dayData.day)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${expandedDay === dayData.day ? 'bg-orange-500 scale-150' : 'bg-gray-300'} transition-all`}></div>
                                    <h3 className="font-extrabold text-gray-800 dark:text-white text-[15px] tracking-tight">{dayData.day}</h3>
                                </div>
                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full transition-colors text-gray-400">
                                    {expandedDay === dayData.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>

                            {/* Expanded Content */}
                            {expandedDay === dayData.day && (
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20 p-4 animate-in slide-in-from-top-2 duration-200">
                                    <div className="space-y-3">
                                        {dayData.meals.length > 0 ? dayData.meals.map((meal, idx) => (
                                            <div key={idx} className="bg-white dark:bg-[#1A1F2B] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.1em] mb-1">
                                                            {meal.mealType}
                                                        </h5>
                                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                                            {meal.itemName}
                                                        </h4>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${meal.foodType === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {meal.foodType}
                                                        </span>
                                                        <div className="flex items-center gap-1 mt-2 text-gray-400">
                                                            <Clock size={12} />
                                                            <span className="text-[11px] font-bold">{meal.timing}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 py-2 border-y border-gray-50 dark:border-gray-800/50 mb-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Quantity</span>
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{meal.quantity} {meal.unit}</span>
                                                    </div>
                                                </div>

                                                {meal.description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-white/5">
                                                        {meal.description}
                                                    </p>
                                                )}
                                            </div>
                                        )) : (
                                            <p className="text-center text-gray-400 text-xs py-4 font-bold italic">Rest day - No specific diet meals listed.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div >
    );
};

export default DietPlanSection;
