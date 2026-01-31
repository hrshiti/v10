import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical, Search, Clock, Info } from 'lucide-react';
import { dietPlans } from '../data/mockDietPlans';

const DietPlanSection = () => {

    const [expandedPlanId, setExpandedPlanId] = useState(null);

    const togglePlan = (id) => {
        setExpandedPlanId(expandedPlanId === id ? null : id);
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-1">Diet Plan Management</h2>



            <div className="text-xs font-bold text-gray-400 mb-3 px-1">All Diet Plan(s) ({dietPlans.length})</div>

            {/* Plan List */}
            <div className="flex flex-col gap-1.5">
                {dietPlans.map((plan) => (
                    <div key={plan.id} className="bg-white dark:bg-[#1A1F2B] rounded-[1rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
                        {/* Card Header */}
                        <div
                            className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                            onClick={() => togglePlan(plan.id)}
                        >
                            <h3 className="font-bold text-gray-800 dark:text-white text-sm uppercase tracking-wide flex-1">{plan.planName}</h3>
                            {/* Pseud Search Input - Hidden on mobile, visible on large screens */}
                            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 w-48 mr-2">
                                <Search size={14} className="text-gray-400 mr-2" />
                                <span className="text-xs text-gray-400">Search Members</span>
                                <ChevronDown size={14} className="text-gray-400 ml-auto" />
                            </div>

                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full transition-colors text-gray-400">
                                {expandedPlanId === plan.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>

                        {/* Expanded Content */}
                        {expandedPlanId === plan.id && (
                            <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20 p-4 animate-in slide-in-from-top-2 duration-200">
                                {Object.entries(plan.days).map(([day, meals]) => (
                                    <div key={day} className="mb-6 last:mb-0">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{day}</h4>
                                        </div>

                                        <div className="space-y-4">
                                            {Object.entries(meals).map(([mealName, items]) => (
                                                <div key={mealName} className="bg-white dark:bg-[#1A1F2B] border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-sm">
                                                    <h5 className="text-xs font-bold text-orange-500 uppercase mb-2 tracking-wider flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 bg-orange-200 rounded-full"></span>
                                                        {mealName}
                                                    </h5>

                                                    <div className="space-y-2">
                                                        {items.map((item, idx) => (
                                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border-l-2 border-transparent hover:border-emerald-400">
                                                                {/* Type & Time */}
                                                                <div className="flex items-center gap-2 min-w-[140px]">
                                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.foodType === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {item.foodType}
                                                                    </span>
                                                                    <div className="flex items-center gap-1 text-gray-500">
                                                                        <Clock size={12} />
                                                                        <span className="text-xs font-medium">{item.timing}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">{item.diet}</p>
                                                                    <div className="flex items-center gap-1 mt-0.5 text-gray-400">
                                                                        <Info size={10} />
                                                                        <p className="text-[10px]">{item.description}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div >
    );
};

export default DietPlanSection;
