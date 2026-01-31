import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Clock, MousePointer2, Zap, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';

const SlotManagement = () => {
  const { isDarkMode } = useOutletContext();

  return (
    <div className={`space-y-10 animate-in fade-in duration-700 transition-colors duration-500 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="flex flex-col">
        <h1 className="text-4xl font-black tracking-tight uppercase">Scheduling Matrix</h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 ml-0.5">Capacity Optimization & Resource Allocation</p>
      </div>

      <div className={`rounded-[3.5rem] border transition-all duration-700 p-16 min-h-[650px] flex flex-col items-center justify-center text-center relative overflow-hidden ${isDarkMode
        ? 'bg-[#1e1e1e] border-white/5 shadow-2xl shadow-black/40'
        : 'bg-white border-gray-100 shadow-2xl shadow-gray-100/50'
        }`}>
        {/* Decorative Background Elements */}
        <div className={`absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-80 -mt-80 opacity-10 transition-colors duration-1000 ${isDarkMode ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
        <div className={`absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -ml-80 -mb-80 opacity-10 transition-colors duration-1000 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-200'}`}></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-12">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-150 group-hover:bg-orange-500/30 transition-all duration-500"></div>
            <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-6 transition-all group-hover:rotate-12 group-hover:scale-110 duration-700 relative z-10 ${isDarkMode ? 'bg-[#121212] border border-white/5 text-orange-500' : 'bg-white border border-gray-100 text-orange-600'}`}>
              <Clock size={48} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg z-20 animate-bounce">
              <Sparkles size={16} />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className={`text-5xl lg:text-7xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Facility Tempo</span>
            </h2>
            <p className={`text-base lg:text-xl font-bold leading-relaxed px-10 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Implement seamless booking workflows for training zones, group classes, and equipment. Eliminate bottlenecks and maximize member throughput.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button className="group w-full sm:w-auto px-14 py-5 bg-orange-500 text-white rounded-[1.25rem] font-black text-xs tracking-widest uppercase hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/30 active:scale-95 flex items-center gap-3">
              Deploy Scheduler
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button className={`w-full sm:w-auto px-14 py-5 border-2 rounded-[1.25rem] font-black text-xs tracking-widest uppercase transition-all active:scale-95 flex items-center gap-3 ${isDarkMode
              ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}>
              <ShieldCheck size={18} />
              Module Protocol
            </button>
          </div>

          <div className={`pt-12 flex flex-wrap items-center justify-center gap-10 border-t mt-16 transition-colors ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
            {[
              { label: 'Real-time sync', icon: Zap },
              { label: 'Cloud Booking', icon: MousePointer2 },
              { label: 'Occupancy Guard', icon: ShieldCheck }
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                  <feature.icon size={14} />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotManagement;
