import React from 'react';
import { Plus, Fingerprint, Cpu, ShieldCheck } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Biometric = () => {
  const { isDarkMode } = useOutletContext();

  return (
    <div className={`space-y-8 animate-in fade-in duration-700 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Biometric Access</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Configure hardware security devices</p>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Provision Device</span>
        </button>
      </div>

      <div className={`rounded-[3rem] border transition-all duration-500 p-16 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden ${isDarkMode
          ? 'bg-[#1e1e1e] border-white/5 shadow-2xl shadow-black/40'
          : 'bg-white border-gray-100 shadow-2xl shadow-gray-100/50'
        }`}>
        {/* Decorative Background Elements */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -mr-40 -mt-40 opacity-20 ${isDarkMode ? 'bg-orange-500' : 'bg-orange-100'}`}></div>
        <div className={`absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] -ml-40 -mb-40 opacity-20 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-100'}`}></div>

        <div className="relative z-10 max-w-xl mx-auto space-y-10">
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-white/5 text-gray-500 shadow-black/20' : 'bg-gray-50 text-gray-300 shadow-gray-100/50'
            }`}>
            <Fingerprint size={48} className="opacity-40" />
          </div>

          <div className="space-y-4">
            <h2 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Establish <span className="text-orange-500">Security Gateways</span>
            </h2>
            <p className={`text-base font-bold leading-relaxed px-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Connect your ZKTeco or Essl biometric devices to synchronize facility access with member membership status in real-time.
            </p>
          </div>

          <div className={`pt-12 flex flex-wrap items-center justify-center gap-8 border-t mt-12 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
            {[
              { icon: Cpu, label: 'Auto Sync' },
              { icon: ShieldCheck, label: 'Access Control' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <feature.icon size={16} className="text-orange-500 opacity-60" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biometric;
