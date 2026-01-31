import React, { useState } from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';

const WaterTracker = () => {
    const [glasses, setGlasses] = useState(3);
    const totalGlasses = 8;

    // Calculate progress width
    const progress = (glasses / totalGlasses) * 100;

    return (
        <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl p-4 mt-4 border border-blue-100 dark:border-blue-900/30 transition-colors duration-300">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-500 dark:text-blue-400">
                        <Droplets size={16} />
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Water Intake</span>
                </div>
                <span className="text-xs font-bold text-blue-600">{glasses}/{totalGlasses} Glasses</span>
            </div>

            {/* Visual Tracker (Glasses) */}
            <div className="flex justify-between items-center px-1 mb-3">
                {[...Array(totalGlasses)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-8 w-3 rounded-full transition-all duration-300 ${i < glasses ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                    ></div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={() => setGlasses(Math.max(0, glasses - 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-blue-500 shadow-sm flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                >
                    <Minus size={14} />
                </button>

                <div className="flex-grow h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <button
                    onClick={() => setGlasses(Math.min(totalGlasses, glasses + 1))}
                    className="w-8 h-8 rounded-full bg-blue-500 text-white shadow-md flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
};

export default WaterTracker;
