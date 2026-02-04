import React, { useState } from 'react';
import { X } from 'lucide-react';

const CallNotConnectedModal = ({ isOpen, onClose, onSubmit, enquiryName, isDarkMode }) => {
    const [remark, setRemark] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative w-[500px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 ${isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100 bg-[#f8f9fa]'}`}>
                    <h2 className="text-[17px] font-black uppercase dark:text-white">Call Not Connected ({enquiryName})</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[14px] font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Remark*
                        </label>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="Remark..."
                            className={`w-full h-32 p-4 border rounded-xl outline-none text-[15px] font-medium transition-all ${isDarkMode
                                    ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600 focus:border-[#f97316]'
                                    : 'bg-white border-gray-200 placeholder:text-gray-400 focus:border-[#f97316]'
                                }`}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <button
                        onClick={onClose}
                        className={`px-8 py-2.5 rounded-lg text-[15px] font-black transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10' : 'bg-[#f1f3f5] text-gray-700 hover:bg-[#e9ecef]'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(remark)}
                        className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[15px] font-black shadow-md active:scale-95 transition-all"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallNotConnectedModal;
