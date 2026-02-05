import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const WaterTracker = () => {
    const [glasses, setGlasses] = useState(0);
    const [totalGlasses, setTotalGlasses] = useState(8);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIntake();
    }, []);

    const fetchIntake = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/user/water-intake`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setGlasses(data.glasses);
                setTotalGlasses(data.target || 8);
            }
        } catch (error) {
            console.error("Error fetching water intake", error);
        } finally {
            setLoading(false);
        }
    };

    const updateIntake = async (newGlasses) => {
        setGlasses(newGlasses);
        try {
            const token = localStorage.getItem('userToken');
            await fetch(`${API_BASE_URL}/api/user/water-intake`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ glasses: newGlasses, target: totalGlasses })
            });
        } catch (error) {
            console.error("Error updating water intake", error);
        }
    };

    const progress = Math.min((glasses / totalGlasses) * 100, 100);

    return (
        <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl p-4 mt-6 border border-blue-100 dark:border-blue-900/30 transition-colors duration-300">
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
                    onClick={() => glasses > 0 && updateIntake(glasses - 1)}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-blue-500 shadow-sm flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors disabled:opacity-50"
                    disabled={glasses <= 0}
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
                    onClick={() => glasses < totalGlasses && updateIntake(glasses + 1)}
                    className={`w-8 h-8 rounded-full bg-blue-500 text-white shadow-md flex items-center justify-center transition-colors ${glasses >= totalGlasses ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    disabled={glasses >= totalGlasses}
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
};

export default WaterTracker;
