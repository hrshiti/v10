import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const CustomConfirm = ({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDarkMode = false, type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                {/* Header */}
                <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 p-3 rounded-full ${type === 'danger' ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
                            <AlertTriangle size={24} className={type === 'danger' ? 'text-red-500' : 'text-orange-500'} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {title}
                            </h3>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 flex items-center justify-end gap-3 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-50'} rounded-b-2xl`}>
                    <button
                        onClick={onCancel}
                        className={`px-6 py-2.5 font-bold rounded-xl transition-all active:scale-95 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2.5 font-black rounded-xl shadow-lg transition-all active:scale-95 ${type === 'danger'
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomConfirm;
