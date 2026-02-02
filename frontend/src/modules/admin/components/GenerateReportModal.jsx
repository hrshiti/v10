import React from 'react';
import { Calendar, X } from 'lucide-react';

const GenerateReportModal = ({ isOpen, onClose, isDarkMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                {/* Header */}
                <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
                        <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generate Report</h2>
                    </div>
                    <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <label className={`block text-[14px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>OTP*</label>
                    <input
                        type="text"
                        placeholder="OTP"
                        className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 shadow-inner'}`}
                    />
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600">
                        Validate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateReportModal;
