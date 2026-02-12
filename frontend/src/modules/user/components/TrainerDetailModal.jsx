import React from 'react';
import { X, Award, Star, Zap, User } from 'lucide-react';

const TrainerDetailModal = ({ trainer, onClose }) => {
    if (!trainer) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white dark:bg-[#1A1F2B] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500">

                {/* Header/Banner */}
                <div className="h-32 bg-gradient-to-br from-[#1A1F2B] to-[#2D3446] relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Pulsing decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {/* Trainer Info Section */}
                <div className="px-8 pb-10 -mt-16 relative">
                    {/* Large Photo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#1A1F2B] overflow-hidden bg-gray-100 shadow-xl">
                            {trainer.photo ? (
                                <img src={trainer.photo} alt={trainer.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-emerald-500">
                                    <User size={60} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                            {trainer.firstName} {trainer.lastName}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                                Certified Trainer
                            </span>
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star size={12} fill="currentColor" />
                                <span className="text-xs font-bold">4.9</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-2">
                                <Award size={18} />
                            </div>
                            <p className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">
                                {trainer.experience || 0}+
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Years Exp.</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-2">
                                <Zap size={18} />
                            </div>
                            <p className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">
                                {trainer.gymActivities?.length || 0}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Specialties</p>
                        </div>
                    </div>

                    {/* Specializations Tags */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {trainer.gymActivities?.map((activity, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-white/5"
                                >
                                    {activity}
                                </span>
                            )) || <span className="text-gray-400 text-xs italic">General Fitness</span>}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        className="w-full bg-black dark:bg-white dark:text-black text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
                        onClick={onClose}
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainerDetailModal;
