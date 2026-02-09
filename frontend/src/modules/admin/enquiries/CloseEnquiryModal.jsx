import React from 'react';
import { X, Check } from 'lucide-react';

const CloseEnquiryModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative w-[450px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 ${isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'
                }`}>
                {/* Header */}
                <div className="flex justify-end p-4">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 pb-10 text-center">
                    <div className="flex justify-center mb-6">
                        <Check size={48} className="text-black dark:text-white" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl font-black mb-4 dark:text-white">Close Enquiry?</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        Do you really want to close enquiry?<br />
                        This process cannot be undone.
                    </p>
                </div>

                {/* Footer */}
                <div className={`p-6 border-t flex justify-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <button
                        onClick={onConfirm}
                        className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-3 rounded-xl flex items-center justify-center gap-2 text-[16px] font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                    >
                        <Check size={20} />
                        Yes, Close Enquiry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseEnquiryModal;
