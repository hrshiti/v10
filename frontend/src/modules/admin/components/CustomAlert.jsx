import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

const CustomAlert = ({ isOpen, onClose, type = 'info', title, message, isDarkMode = false }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle2 size={28} className="text-green-500" />;
            case 'error':
                return <XCircle size={28} className="text-red-500" />;
            case 'warning':
                return <AlertCircle size={28} className="text-orange-500" />;
            default:
                return <Info size={28} className="text-blue-500" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'border-green-500/30 bg-green-500/10';
            case 'error':
                return 'border-red-500/30 bg-red-500/10';
            case 'warning':
                return 'border-orange-500/30 bg-orange-500/10';
            default:
                return 'border-blue-500/30 bg-blue-500/10';
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                {/* Header with Icon */}
                <div className={`p-6 border-2 rounded-t-2xl ${getColors()}`}>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-black mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {title}
                            </h3>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 flex justify-end ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-50'} rounded-b-2xl`}>
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
