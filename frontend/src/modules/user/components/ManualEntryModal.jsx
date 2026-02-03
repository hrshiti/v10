import React, { useState } from 'react';
import { X, Keyboard } from 'lucide-react';

const ManualEntryModal = ({ onClose, onSubmit }) => {
    const [gymId, setGymId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gymId.trim()) {
            onSubmit(gymId.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 border border-white/10">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Keyboard size={20} className="text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Manual Entry</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6">
                    Enter the Gym ID manually if QR scanning isn't working
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Gym ID
                        </label>
                        <input
                            type="text"
                            value={gymId}
                            onChange={(e) => setGymId(e.target.value)}
                            placeholder="e.g., V10_GYM_MAIN_GATE"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-600"
                            autoFocus
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!gymId.trim()}
                            className={`flex-1 font-bold py-3 rounded-xl transition-all ${gymId.trim()
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualEntryModal;
