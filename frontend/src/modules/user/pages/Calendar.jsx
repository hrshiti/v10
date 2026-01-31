import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';
import { dietPlans } from '../data/mockDietPlans';
import DietItemModal from '../components/DietItemModal';

const Calendar = () => {
    // State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedItem, setSelectedItem] = useState(null);
    const [eatenItems, setEatenItems] = useState({}); // { "Monday-Breakfast-0": true }

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

    // --- WORKOUT SCHEDULE DATA ---
    const schedules = {
        12: [{ title: 'Full Body HIIT', time: '07:00 AM - 08:00 AM', icon: '🔥', color: 'bg-red-100' }, { title: 'Stretching', time: '08:00 PM - 08:30 PM', icon: '🧘', color: 'bg-indigo-100' }],
        13: [{ title: 'Leg Day', time: '09:00 AM - 10:30 AM', icon: '🦵', color: 'bg-orange-100' }],
        14: [{ title: 'Yoga Flow', time: '07:00 AM - 08:00 AM', icon: '🧘‍♀️', color: 'bg-blue-100' }, { title: 'Meditation', time: '09:00 PM - 09:30 PM', icon: '🕉️', color: 'bg-purple-100' }],
        15: [{ title: 'Upper Body Power', time: '10:00 AM - 11:30 AM', icon: '💪', color: 'bg-orange-100' }, { title: 'Yoga Flow', time: '05:00 PM - 06:00 PM', icon: '🧘‍♀️', color: 'bg-blue-100' }],
        16: [{ title: 'Cardio Blast', time: '06:00 AM - 07:00 AM', icon: '🏃', color: 'bg-green-100' }],
        17: [], // Rest Day
        18: [{ title: 'Zumba Dance', time: '04:00 PM - 05:00 PM', icon: '💃', color: 'bg-pink-100' }]
    };

    // Select specific plan (e.g., first one as active plan)
    const activeDietPlan = dietPlans[0];
    const currentDayName = fullDayNames[selectedDate.getDay()];
    // Get meals for the detailed Day (Monday) or fallback if not defined in mock
    const currentDayMeals = activeDietPlan.days[currentDayName] || activeDietPlan.days['Monday'];


    // Get Data for Selected Date
    const currentDayDate = selectedDate.getDate();
    const currentSchedule = schedules[currentDayDate] || [];

    // Helper to check if a date has tasks
    const hasTasks = (day) => {
        return schedules[day] && schedules[day].length > 0;
    };

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
                                {hasTasks(dayNum) && !isActive && (
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
                    {currentSchedule.length > 0 ? (
                        <div className="space-y-4">
                            {currentSchedule.map((session, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#1A1F2B] p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                    <div className={`w-14 h-14 ${session.color} rounded-2xl flex items-center justify-center text-2xl`}>
                                        {session.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base">{session.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{session.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center opacity-60 transition-colors duration-300">
                            <p className="text-sm font-bold text-gray-400">Rest Day</p>
                        </div>
                    )}
                </div>

                {/* MEAL PLAN SECTION - FROM MOCK DATA */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meal Plan</h3>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{activeDietPlan.planName}</span>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(currentDayMeals).map(([mealName, items]) => (
                            <div key={mealName} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                <h5 className="text-xs font-bold text-orange-500 uppercase mb-2 tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-orange-200 rounded-full"></span>
                                    {mealName}
                                </h5>

                                <div className="space-y-2">
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedItem({ ...item, key: getItemKey(currentDayName, mealName, idx) })}
                                            className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors border-l-2 cursor-pointer active:scale-[0.98] duration-200 ${eatenItems[getItemKey(currentDayName, mealName, idx)] ? 'border-emerald-500 bg-emerald-50/10' : 'border-transparent hover:border-emerald-400'}`}
                                        >
                                            {/* Type & Time */}
                                            <div className="flex items-center gap-2 min-w-[100px]">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.foodType === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.foodType}
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <Clock size={10} />
                                                    <span className="text-[10px] font-medium">{item.timing}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800 leading-snug">{item.diet}</p>
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
