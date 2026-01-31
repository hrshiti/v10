import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Flame, Wheat, Egg, Clock, Info } from 'lucide-react';

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

const DietItemModal = ({ item, isEaten, onToggleEaten, onClose }) => {


    if (!item) return null;

    // Mock macros generation based on string length to seem dynamic but consistent
    const generateMacros = (str) => {
        const seed = str.length;
        return {
            protein: 10 + (seed % 20),
            carbs: 20 + (seed % 40),
            fats: 5 + (seed % 15),
            calories: 150 + (seed * 10)
        };
    };

    const macros = generateMacros(item.diet);

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-md mx-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transform transition-transform animate-in slide-in-from-bottom duration-300 pointer-events-auto overflow-hidden relative">

                {/* Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${item.foodType === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.foodType}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight pr-4">{item.diet}</h2>

                        <div className="flex items-center gap-3 mt-2 text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span className="text-xs font-medium">{item.timing}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Info size={14} />
                                <span className="text-xs font-medium">{item.description}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500 shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Macros Progress */}
                <div className="mb-8 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nutrition</h3>
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">~ {macros.calories} kcal</span>
                    </div>

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
                    onClick={onToggleEaten}
                    className={`w-full py-4 rounded-3xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 shadow-lg transform active:scale-95 ${isEaten ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-[#1A1F2B] text-white shadow-gray-200'}`}
                >
                    {isEaten ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    {isEaten ? 'Marked as Eaten' : 'Mark as Eaten'}
                </button>
            </div>
        </div>
    );
};

export default DietItemModal;
