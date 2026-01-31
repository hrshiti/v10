import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Flame, Wheat, Egg } from 'lucide-react';

const MacroBar = ({ label, value, max, color, icon: Icon }) => (
    <div className="mb-3 last:mb-0">
        <div className="flex justify-between text-xs mb-1 font-medium text-gray-600">
            <div className="flex items-center gap-1.5">
                <Icon size={12} className={color.text} />
                <span>{label}</span>
            </div>
            <span>{value}g / {max}g</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-500 ${color.bg}`}
                style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
            ></div>
        </div>
    </div>
);

const DietDetailModal = ({ category, onClose }) => {
    const [isEaten, setIsEaten] = useState(false);

    if (!category) return null;

    // Hardcoded macros based on the category for demo purposes
    const getMacros = (title) => {
        switch (title.toLowerCase()) {
            case 'breakfast': return { protein: 25, carbs: 45, fats: 10 };
            case 'lunch': return { protein: 40, carbs: 35, fats: 15 };
            case 'snacks': return { protein: 15, carbs: 20, fats: 12 };
            case 'dinner': return { protein: 35, carbs: 10, fats: 20 };
            default: return { protein: 20, carbs: 20, fats: 10 };
        }
    };

    const macros = getMacros(category.title);

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-md mx-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transform transition-transform animate-in slide-in-from-bottom duration-300 pointer-events-auto overflow-hidden relative">

                {/* Header with Icon behind */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2" style={{ backgroundColor: category.bgColor, color: category.iconColor }}>
                            {category.title}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 leading-tight">Your Meal<br />Plan</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Decorative Icon Background */}
                <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none" style={{ color: category.iconColor }}>
                    <category.icon size={150} />
                </div>

                {/* Food List */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recommended Items</h3>
                    <div className="space-y-3">
                        {category.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg">
                                    {idx === 0 ? '🥣' : idx === 1 ? '🍳' : '🍌'}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-gray-900 font-bold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{item.cal} kcal</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Macros Progress */}
                <div className="mb-8 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Nutritional Goals</h3>
                    <MacroBar
                        label="Protein"
                        value={macros.protein}
                        max={50}
                        icon={Flame}
                        color={{ bg: 'bg-orange-500', text: 'text-orange-500' }}
                    />
                    <MacroBar
                        label="Carbs"
                        value={macros.carbs}
                        max={60}
                        icon={Wheat}
                        color={{ bg: 'bg-blue-500', text: 'text-blue-500' }}
                    />
                    <MacroBar
                        label="Fats"
                        value={macros.fats}
                        max={30}
                        icon={Egg}
                        color={{ bg: 'bg-yellow-500', text: 'text-yellow-500' }}
                    />
                </div>

                {/* Mark as Eaten Button */}
                <button
                    onClick={() => setIsEaten(!isEaten)}
                    className={`w-full py-4 rounded-3xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 shadow-lg transform active:scale-95 ${isEaten ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-gray-900 text-white shadow-gray-200'}`}
                >
                    {isEaten ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    {isEaten ? 'Marked as Eaten' : 'Mark as Eaten'}
                </button>
            </div>
        </div>
    );
};

export default DietDetailModal;
