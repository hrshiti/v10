import React from 'react';
import { Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const GenerateReportModal = ({ isOpen, onClose, data, filename = 'report', isDarkMode }) => {
    if (!isOpen) return null;

    const handleDownload = () => {
        try {
            if (!data || data.length === 0) {
                toast.error("No data to export");
                return;
            }

            // Create a worksheet
            // Flatten nested objects if necessary, or pass clean data
            const cleanData = data.map(item => {
                // Simplify for export - customize as needed
                return item;
            });

            const ws = XLSX.utils.json_to_sheet(cleanData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report");

            XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success("Report downloaded successfully");
            onClose();
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to generate report");
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <Download size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
                        <h2 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Download Report</h2>
                    </div>
                    <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col items-center">
                    <p className={`text-[14px] font-medium mb-6 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Click below to download the report in Excel format.
                    </p>
                    <button
                        onClick={handleDownload}
                        className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 w-full justify-center"
                    >
                        <Download size={18} />
                        Download Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateReportModal;
