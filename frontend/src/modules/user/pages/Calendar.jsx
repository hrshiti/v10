import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Info, ChevronDown } from 'lucide-react';
import DietItemModal from '../components/DietItemModal';
import { API_BASE_URL } from '../../../config/api';

const Calendar = () => {
    // State
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedItem, setSelectedItem] = useState(null);
    const [eatenItems, setEatenItems] = useState({});
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [dietPlan, setDietPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const [wRes, dRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/user/workouts`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/user/diet-plan`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const wData = await wRes.json();
                const dData = await dRes.json();

                if (wRes.ok) setWorkoutPlan(wData[0]); // Assuming one active plan
                if (dRes.ok) setDietPlan(dData);
            } catch (err) {
                console.error('Error fetching calendar data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggleEaten = (itemKey) => {
        setEatenItems(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    };

    // Generate unique key for items (simple version)
    const getItemKey = (day, meal, idx) => `${day}-${meal}-${idx}`;

    // Helper: Change date by offset
    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    // Helper: Sliding week window
    const getWeekDays = () => {
        const days = [];
        for (let i = -3; i <= 3; i++) {
            const date = new Date(selectedDate);
            date.setDate(selectedDate.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const weekDates = getWeekDays();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDayName = fullDayNames[selectedDate.getDay()];

    // Get Workout Day
    const currentWorkoutDay = workoutPlan?.schedule.find(s => s.day === currentDayName);

    // Get Diet Day
    const currentDietDay = dietPlan?.weeklyPlan.find(d => d.day === currentDayName);


    // Get Data for Selected Date
    const currentDayDate = selectedDate.getDate();

    // Helper to check if a date has tasks (simplified for now to show DOT if it's a weekday with a plan)
    const hasTasks = (dateObj) => {
        const dayStr = fullDayNames[dateObj.getDay()];
        return workoutPlan?.schedule.some(s => s.day === dayStr) || dietPlan?.weeklyPlan.some(d => d.day === dayStr);
    };

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#121212] min-h-screen pb-24 transition-colors duration-300">
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-6 pb-6 rounded-b-[2rem] shadow-md transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Schedule</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => changeDate(-1)}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => changeDate(1)}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Sliding Date Strip */}
                <div className="flex justify-between overflow-hidden">
                    {weekDates.map((dateObj, idx) => {
                        const dayNum = dateObj.getDate();
                        const dayName = daysOfWeek[dateObj.getDay()];
                        const isActive = dayNum === currentDayDate;

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(dateObj)}
                                className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300 min-w-[45px] ${isActive ? 'bg-[#D3F4F0] text-black scale-110 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <span className="text-xs font-medium">{dayName}</span>
                                <span className={`text-lg font-bold ${isActive ? 'text-black' : 'text-white'}`}>{dayNum}</span>
                                {hasTasks(dateObj) && !isActive && (
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-6">
                {/* HEADINGS */}
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentDayName}
                    </h2>
                </div>

                {/* WORKOUTS SECTION */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Workouts</h3>
                    {currentWorkoutDay ? (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-[#1A1F2B] p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-all">
                                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-2xl">
                                    💪
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-gray-900 dark:text-white">{currentWorkoutDay.workoutType}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{currentWorkoutDay.exercises.length} Exercises Scheduled</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/workout-details/${workoutPlan._id}`)}
                                    className="p-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl shadow-lg"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-[2rem] bg-gray-100 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 text-center opacity-60">
                            <p className="text-sm font-black text-gray-400">Rest Day</p>
                        </div>
                    )}
                </div>

                {/* MEAL PLAN SECTION - FROM MOCK DATA */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meal Plan</h3>
                        {dietPlan && <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{dietPlan.name}</span>}
                    </div>

                    <div className="space-y-4">
                        {currentDietDay ? currentDietDay.meals.map((meal, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#1A1F2B] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{meal.mealType}</h5>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${meal.foodType === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {meal.foodType}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 dark:text-white text-sm">{meal.itemName}</h4>
                                        <div className="flex items-center gap-1 text-gray-400 mt-1">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-bold">{meal.timing}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400">{meal.quantity}{meal.unit}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 rounded-[1.5rem] bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 text-center opacity-60">
                                <p className="text-sm font-black text-gray-400">No Meals Logged</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Item Detail Modal */}
            <DietItemModal
                item={selectedItem}
                isEaten={selectedItem ? eatenItems[selectedItem.key] : false}
                onToggleEaten={() => handleToggleEaten(selectedItem.key)}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};

export default Calendar;
