import React from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { ShieldPlus } from 'lucide-react';

const MemberHealthAssessment = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Health Assessment</h2>
                <button
                    onClick={() => navigate(`../health-assessment-add?id=${id}`)}
                    className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-transform active:scale-95"
                >
                    New Assessment
                </button>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="bg-[#3b82f6] p-4 rounded-xl shadow-lg shadow-blue-500/30">
                    <ShieldPlus size={40} className="text-white" />
                </div>
                <h3 className={`text-xl font-bold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Health Assessment Records Found</h3>
                <p className="text-sm text-gray-500">Start your journey to better health by taking your first assessment now.</p>
            </div>
        </div>
    );
};

export default MemberHealthAssessment;
