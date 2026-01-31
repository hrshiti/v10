import React from 'react';
import { X, Bell } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose, isDarkMode }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] z-[70] shadow-2xl transform transition-transform duration-300 border-l ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-black' : 'bg-white border-gray-100'}`}>
                <div className="flex flex-col h-full transition-none">
                    {/* Header */}
                    <div className={`px-8 py-7 border-b flex justify-between items-center transition-none ${isDarkMode ? 'bg-[#1c1c1c] border-white/5' : 'bg-white border-gray-50'}`}>
                        <div>
                            <h2 className={`text-2xl font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Notifications</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Stay updated with latest activities</p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-xl transition-none group border ${isDarkMode ? 'hover:bg-white/5 border-transparent hover:border-white/10' : 'hover:bg-gray-100 border-transparent hover:border-gray-200'}`}
                        >
                            <X size={24} className={`${isDarkMode ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-black'}`} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-10 flex flex-col items-center justify-center text-center pb-24 transition-none">
                        <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center mb-8 relative transition-none ${isDarkMode ? 'bg-white/5 text-gray-600' : 'bg-gray-50 text-gray-300'}`}>
                            <Bell size={48} />
                        </div>
                        <h3 className={`text-xl font-black tracking-tight mb-2 uppercase ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>All Caught Up!</h3>
                        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">No new alerts or system updates pending at this moment.</p>

                        <button className={`mt-10 px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-50 border-gray-100 text-black hover:bg-gray-100'}`}>
                            Clear History
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
