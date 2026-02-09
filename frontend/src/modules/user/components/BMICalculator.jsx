import React, { useState, useEffect } from 'react';
import { Ruler, Weight as WeightIcon, Activity, Info, ChevronRight, ChevronLeft } from 'lucide-react';

const BMICalculator = () => {
    const storedData = localStorage.getItem('userData');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    const [weight, setWeight] = useState(parsedData?.weight || '');
    const [height, setHeight] = useState(parsedData?.height || '');
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState(null);

    const calculate = (w, h) => {
        if (h > 0 && w > 0) {
            const hMeter = h / 100;
            const bmiValue = (w / (hMeter * hMeter)).toFixed(1);
            setBmi(bmiValue);

            if (bmiValue < 18.5) setCategory({ label: 'Underweight', color: '#3b82f6', bg: 'bg-blue-500/10' });
            else if (bmiValue < 25) setCategory({ label: 'Healthy', color: '#10b981', bg: 'bg-emerald-500/10' });
            else if (bmiValue < 30) setCategory({ label: 'Overweight', color: '#f59e0b', bg: 'bg-orange-500/10' });
            else setCategory({ label: 'Obese', color: '#ef4444', bg: 'bg-red-500/10' });
        } else {
            setBmi(null);
            setCategory(null);
        }
    };

    useEffect(() => {
        if (weight && height) {
            calculate(weight, height);
        }
    }, [weight, height]);

    const getIndicatorPosition = () => {
        if (!bmi) return 0;
        const val = parseFloat(bmi);
        // Range 15 to 40
        const min = 15;
        const max = 40;
        const pos = ((val - min) / (max - min)) * 100;
        return Math.min(Math.max(pos, 0), 100);
    };

    return (
        <div className="bg-white dark:bg-[#1A1F2B] rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 mb-6 group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1 uppercase tracking-tight">BMI Calculator</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Track your fitness index</p>
                    </div>
                </div>
                {bmi && (
                    <div className={`px-4 py-2 rounded-2xl ${category.bg} flex flex-col items-end border border-${category.label === 'Healthy' ? 'emerald' : category.label === 'Underweight' ? 'blue' : 'red'}-500/20`}>
                        <span className="text-2xl font-black" style={{ color: category.color }}>{bmi}</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: category.color }}>{category.label}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Weight Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight (kg)</label>
                        <WeightIcon size={12} className="text-gray-300" />
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="75"
                            className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-black text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                        />
                    </div>
                </div>

                {/* Height Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Height (cm)</label>
                        <Ruler size={12} className="text-gray-300" />
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="178"
                            className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-black text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {bmi && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* BMI Range Scale */}
                    <div className="relative pt-4">
                        <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-white/5">
                            <div className="h-full bg-blue-500" style={{ width: '15%' }}></div>
                            <div className="h-full bg-emerald-500" style={{ width: '25%' }}></div>
                            <div className="h-full bg-orange-500" style={{ width: '20%' }}></div>
                            <div className="h-full bg-red-500" style={{ width: '40%' }}></div>
                        </div>

                        {/* Needle */}
                        <div
                            className="absolute top-3 transition-all duration-1000 ease-out"
                            style={{ left: `${getIndicatorPosition()}%`, transform: 'translateX(-50%)' }}
                        >
                            <div className="w-4 h-4 rounded-full border-4 border-white dark:border-[#1A1F2B] shadow-lg" style={{ backgroundColor: category.color }}></div>
                            <div className="w-0.5 h-3 mx-auto bg-gray-400 mt-0.5"></div>
                        </div>

                        {/* Labels */}
                        <div className="flex justify-between mt-6 px-1">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Under</span>
                                <span className="text-[10px] font-black text-blue-500">18.5</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Normal</span>
                                <span className="text-[10px] font-black text-emerald-500">24.9</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Over</span>
                                <span className="text-[10px] font-black text-orange-500">29.9</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Obese</span>
                                <span className="text-[10px] font-black text-red-500">30+</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 flex items-start gap-3">
                        <Info size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed italic">
                            BMI is a general indicator. Muscle mass, age and bone density can influence the result. Consult a trainer for details.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;
