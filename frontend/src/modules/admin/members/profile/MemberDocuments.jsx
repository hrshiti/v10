import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Upload } from 'lucide-react';

const MemberDocuments = () => {
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

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Documents</h2>

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

            {/* Documents Section */}
            <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-transparent border-transparent' : 'bg-transparent border-transparent'}`}>
                <h3 className={`text-sm font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Documents</h3>

                <input type="file" id="doc1" className="hidden" />
                <input type="file" id="doc2" className="hidden" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Upload Box */}
                    <div
                        onClick={() => document.getElementById('doc1').click()}
                        className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1e1e1e]' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                    >
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                        <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                        <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                    </div>

                    {/* Right Upload Box */}
                    <div
                        onClick={() => document.getElementById('doc2').click()}
                        className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-white/40 bg-[#1e1e1e]' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                    >
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Document</p>
                        <p className="text-xs text-gray-500 mt-1">jpg, jpeg, png, pdf</p>
                        <p className="text-xs text-gray-500">maximum size 100-150 kb</p>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md transition-transform active:scale-95">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberDocuments;
