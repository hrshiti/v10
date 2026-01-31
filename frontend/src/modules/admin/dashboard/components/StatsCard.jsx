import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon, trend, trendValue, color, isDarkMode }) => {
    return (
        <div className={`p-6 rounded-xl border transition-none active:scale-95 group ${isDarkMode
            ? 'bg-[#1a1a1a] border-white/10 shadow-black'
            : 'bg-white border-gray-200 shadow-sm'
            }`}>
            <div className="flex items-center justify-between mb-6 transition-none">
                <div className={`p-4 rounded-xl shadow-lg transition-none ${isDarkMode ? 'bg-white/5 text-[#f97316]' : `${color} text-white`
                    }`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-none ${trend === 'up'
                        ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-700')
                        : (isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-100 text-red-700')
                        }`}>
                        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <div className="text-left transition-none">
                <h3 className={`text-[12px] font-black uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-black opacity-40'}`}>{title}</h3>
                <h2 className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>{value}</h2>
            </div>
        </div>
    );
};

export default StatsCard;
