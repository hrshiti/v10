import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Ban, Unlock, Plus, Fingerprint, Check, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, title, isDarkMode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                <div className="px-6 pt-10 pb-8 flex flex-col items-center text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>

                    <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                        <Check size={32} className="text-green-500" strokeWidth={3} />
                    </div>

                    <h3 className={`text-2xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h3>

                    <button
                        onClick={onClose}
                        className="mt-8 w-32 bg-[#f97316] hover:bg-orange-600 text-white py-2.5 rounded-lg font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

const MemberBiometric = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const {
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo
    } = context || {};
    const [modal, setModal] = useState({ isOpen: false, title: '' });

    const openModal = (title) => setModal({ isOpen: true, title });
    const closeModal = () => setModal({ isOpen: false, title: '' });

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Biometric</h2>

            {/* Info Card */}
            <div className={`rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Mobile Number</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberMobile}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Email ID</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmail}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">DOB</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberDOB}</p>
                    </div>
                </div>
                <div className="border-t dark:border-white/10 border-gray-200 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-white/10 divide-gray-200">
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Anniversary Date</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberAnniversary}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact Name</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyName}</p>
                    </div>
                    <div className="p-4 space-y-1">
                        <p className="text-xs text-gray-500 font-bold">Emergency Contact No</p>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{memberEmergencyNo}</p>
                    </div>
                </div>
            </div>

            {/* Biometric Details Section */}
            <div className={`rounded-xl border ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'} pb-10`}>
                <div className="p-4 border-b dark:border-white/10 border-gray-100">
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Biometric Details</h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Top Row Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => openModal('Are you sure to block this member in device?')}
                            className="bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <Ban size={16} />
                            Block from Essl
                        </button>
                        <button
                            onClick={() => openModal('Are you sure to Un-block this member in device?')}
                            className="bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <Unlock size={16} />
                            Unblock from Essl
                        </button>
                        <button
                            onClick={() => openModal('Are you sure to add this member in device?')}
                            className="bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Biometric
                        </button>
                    </div>

                    {/* Bottom Row Button */}
                    <div>
                        <button
                            onClick={() => openModal('Are you sure to take fingerPrint this member in device?')}
                            className="bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
                        >
                            <Fingerprint size={16} />
                            Take FingerPrint
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default MemberBiometric;
