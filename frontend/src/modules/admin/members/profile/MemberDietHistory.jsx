import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Folder, Search, ChevronDown, Utensils } from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';

const MealAccordion = ({ mealType, foods, isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-lg border overflow-hidden transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 flex justify-between items-center cursor-pointer transition-none"
            >
                <span className={`text-[15px] font-black ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{mealType}</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-black'}`} />
            </div>

            {isOpen && (
                <div className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    {foods.map((item, idx) => (
                        <div key={idx} className={`flex flex-col md:flex-row border-b last:border-b-0 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                            <div className={`p-4 w-full md:w-[120px] flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <span className={`text-[13px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.foodType}</span>
                                <span className="text-[11px] text-gray-500 font-medium">Food Type</span>
                            </div>
                            <div className={`p-4 w-full md:w-[120px] flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <span className={`text-[13px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.timing}</span>
                                <span className="text-[11px] text-gray-500 font-medium">Timing</span>
                            </div>
                            <div className={`p-4 flex-1 flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <span className={`text-[13px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.itemName}</span>
                                <span className="text-[11px] text-gray-500 font-medium">Diet</span>
                            </div>
                            <div className="p-4 w-full md:w-[200px] flex items-center">
                                <span className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.quantity} {item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MemberDietHistory = () => {
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

    const [dietPlan, setDietPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberDietPlan = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const response = await fetch(`${API_BASE_URL}/api/admin/diet-plans/member/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${adminInfo?.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setDietPlan(data);
                } else {
                    setDietPlan(null);
                }
            } catch (err) {
                console.error('Error fetching member diet plan:', err);
                setDietPlan(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberDietPlan();
    }, [id]);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Diet History</h2>

            {/* Info Card */}
            <div className={`rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Mobile Number</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberMobile}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Email ID</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmail}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">DOB</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberDOB}</p>
                    </div>
                </div>
                <div className="border-t dark:border-white/10 border-gray-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Anniversary Date</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberAnniversary}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact Name</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyName}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact No</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyNo}</p>
                    </div>
                </div>
            </div>

            {/* Active Diet Plan */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <p className="text-gray-500 font-bold animate-pulse">Loading Diet Plan...</p>
                </div>
            ) : dietPlan ? (
                <div className="space-y-6">
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#f97316] p-2 rounded-lg text-white">
                                <Utensils size={20} />
                            </div>
                            <div>
                                <h3 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{dietPlan.name}</h3>
                                <p className="text-xs text-gray-500 font-medium">Assigned on: {new Date(dietPlan.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {dietPlan.weeklyPlan.map((dayData, dIdx) => (
                            <div key={dIdx} className="space-y-3">
                                <div className="w-full bg-[#fff7ed] dark:bg-[#fff7ed]/10 border border-[#ffedd5] dark:border-[#ffedd5]/20 text-[#f97316] py-2 rounded-lg text-center text-[13px] font-bold uppercase">
                                    {dayData.day}
                                </div>
                                <div className="space-y-3">
                                    {dayData.meals.map((meal, mIdx) => (
                                        <MealAccordion key={mIdx} mealType={meal.mealType} foods={[meal]} isDarkMode={isDarkMode} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="relative">
                        <Folder size={100} className="text-yellow-400 fill-yellow-200" />
                        <Search size={50} className="text-orange-400 absolute -bottom-2 -left-4 bg-white rounded-full p-1 border-4 border-white dark:border-[#1a1a1a] dark:bg-[#1a1a1a]" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Active Diet Plan</h3>
                        <p className="text-sm text-gray-500">This member currently has no assigned diet plan.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberDietHistory;
