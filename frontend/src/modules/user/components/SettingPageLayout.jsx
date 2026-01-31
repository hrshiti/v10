import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const SettingPageLayout = ({ title, children }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300">
            {/* Header */}
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-6 pb-6 shadow-md transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 pb-24 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default SettingPageLayout;
