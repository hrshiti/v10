import React from 'react';
import { useOutletContext } from 'react-router-dom';

const MemberReportCard = () => {
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

    // Dummy Report Card Data (as per Image 5 - looks empty initially but let's put headers)
    const reports = [
        // { height: '175cm', weight: '70kg', date: '21 Feb, 2025' } // Example data if needed
    ];

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Report Card</h2>

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

            {/* Report Card Table */}
            <div className={`rounded-xl border overflow-hidden min-h-[400px] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="p-4 bg-white dark:bg-white/5 border-b dark:border-white/10 border-gray-100">
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Report Card</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`text-xs font-bold border-b ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
                                <th className="px-6 py-4 whitespace-nowrap">Height</th>
                                <th className="px-6 py-4 whitespace-nowrap">Weight</th>
                                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {reports.length > 0 ? reports.map((item, idx) => (
                                <tr key={idx} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'}`}>
                                    <td className="px-6 py-5">{item.height}</td>
                                    <td className="px-6 py-5">{item.weight}</td>
                                    <td className="px-6 py-5">{item.date}</td>
                                </tr>
                            )) : (
                                <tr>
                                    {/* Empty state or just empty lines */}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MemberReportCard;
