import React from 'react';
import { X, Check } from 'lucide-react';

const FollowUpDoneModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
            <div className={`w-[450px] rounded-lg shadow-2xl relative pt-12 pb-8 px-8 flex flex-col items-center text-center ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-1 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <X size={24} />
                </button>

                <div className="mb-6">
                    <Check size={60} className="text-[#22c55e]" strokeWidth={4} />
                </div>

                <h2 className={`text-[28px] font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-[#1f2937]'}`}>Follow-up Done!</h2>
                <p className={`text-[16px] font-medium mb-8 ${isDarkMode ? 'text-gray-400' : 'text-[#4b5563]'}`}>
                    Proceed to mark the follow-up as done?
                </p>

                <button
                    onClick={() => {
                        if (onConfirm) onConfirm();
                        onClose();
                    }}
                    className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-bold shadow-lg shadow-orange-500/20 transition-all"
                >
                    Done
                </button>
            </div>
        </div>
    )
}

export default FollowUpDoneModal;
