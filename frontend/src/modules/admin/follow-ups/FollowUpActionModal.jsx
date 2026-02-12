import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Edit2, History, ChevronDown } from 'lucide-react';

const FollowUpActionModal = ({ isOpen, onClose, initialTab = 'edit', rowData, isDarkMode, onSubmit }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isMaximized, setIsMaximized] = useState(false);
    const [convertibility, setConvertibility] = useState('');
    const [remarks, setRemarks] = useState('');
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        if (adminInfo) {
            setAdminName(`${adminInfo.firstName} ${adminInfo.lastName}`);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setConvertibility(rowData?.status || '');
            setRemarks(rowData?.comment || '');
        }
    }, [isOpen, initialTab, rowData]);

    if (!isOpen) return null;

    const toggleMaximize = () => setIsMaximized(!isMaximized);

    // Dummy dropdown options
    const convertibilityOptions = ['Hot', 'Warm', 'Cold'];
    const responseOptions = ['Answered', 'Not Answered', 'Busy', 'Switch Off'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
            <div
                className={`bg-white dark:bg-[#1e1e1e] shadow-2xl transition-all duration-300 flex flex-col ${isMaximized
                    ? 'fixed inset-0 w-full h-full rounded-none'
                    : 'w-[600px] max-h-[90vh] rounded-lg'
                    }`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-100 bg-gray-50/50'}`}>
                    <div>
                        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rowData?.name || 'Gupta BHAI'}</h2>
                        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Follow Up ID : 2108290</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMaximize}
                            className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-600'}`}
                        >
                            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-600'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`px-6 pt-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`pb-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'edit'
                                ? 'border-[#f97316] text-[#f97316]'
                                : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`
                                }`}
                        >
                            <Edit2 size={16} />
                            Edit Response
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`pb-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history'
                                ? 'border-[#f97316] text-[#f97316]'
                                : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`
                                }`}
                        >
                            <History size={16} />
                            Response History
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {activeTab === 'edit' ? (
                        <div className="space-y-8">
                            {/* Response Properties */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Response Properties</h3>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'border-gray-500 text-gray-500' : 'border-gray-400 text-gray-400'}`}>i</div>
                                </div>

                                <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                    {/* Rows */}
                                    {[
                                        { label: 'Follow Up ID', value: '2108290' },
                                        { label: 'Follow Up On', value: rowData?.date || '02 Feb, 2026 11:50 PM', tag: rowData?.status || 'PENDING' },
                                        { label: 'Remarks/Summary', value: rowData?.comment || 'Birthday Wish' },
                                        { label: 'Assign to', value: rowData?.allocate || adminName || 'Admin' },
                                        { label: 'Schedule by', value: rowData?.scheduledBy || adminName || 'Admin' },
                                        { label: 'Follow Up Type', value: rowData?.type || 'Birthday', isTagLike: true },
                                        { label: 'Convertibility', value: rowData?.convertStatus || 'Hot', isTagChange: true },
                                    ].map((row, idx) => (
                                        <div key={idx} className={`flex items-center p-4 border-b last:border-0 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                            <span className={`w-1/3 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{row.label} :</span>
                                            <div className="flex-1 flex items-center gap-2">
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{row.value}</span>
                                                {row.tag && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${row.tag === 'PENDING' ? 'bg-[#ef4444]' : 'bg-[#f4a261]'}`}>{row.tag}</span>
                                                )}
                                                {row.isTagLike && (
                                                    <span className={`ml-2 px-3 py-1 rounded bg-[#fff7ed] border border-[#f97316]/30 text-[#f97316] text-xs font-bold`}>{row.value}</span>
                                                )}
                                                {row.isTagChange && (
                                                    <span className={`ml-2 px-3 py-1 rounded bg-[#ef4444] text-white text-xs font-bold`}>{row.value}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Update Response */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Update Response</h3>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'border-gray-500 text-gray-500' : 'border-gray-400 text-gray-400'}`}>i</div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Convertibility Status</label>
                                        <div className="relative">
                                            <select
                                                value={convertibility}
                                                onChange={(e) => setConvertibility(e.target.value)}
                                                className={`w-full appearance-none px-4 py-2.5 border rounded-lg text-sm bg-transparent outline-none ${isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-700'}`}
                                            >
                                                <option value="">Select</option>
                                                {convertibilityOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                            <ChevronDown size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Response*</label>
                                        <div className="relative">
                                            <select className={`w-full appearance-none px-4 py-2.5 border rounded-lg text-sm bg-transparent outline-none ${isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-700'}`}>
                                                <option>Select</option>
                                                {responseOptions.map(o => <option key={o}>{o}</option>)}
                                            </select>
                                            <ChevronDown size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Remarks*</label>
                                        <textarea
                                            placeholder="Type your Remarks here"
                                            rows={4}
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg text-sm outline-none resize-none ${isDarkMode ? 'bg-transparent border-white/10 text-white' : 'bg-transparent border-gray-200 text-gray-700'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Customer Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Customer Details</h3>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'border-gray-500 text-gray-500' : 'border-gray-400 text-gray-400'}`}>i</div>
                                </div>

                                <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                    {[
                                        { label: rowData?.name || 'Gupta BHAI', sub: rowData?.number ? `+91${rowData.number}` : '+917383898769', isHeader: true },
                                        { label: 'Mobile Number', value: rowData?.number ? `+91${rowData.number}` : '+917383898769' },
                                        { label: 'Date of Birth', value: '02 Feb, 2025' },
                                        { label: 'Email Address', value: '' }, // Empty as per screenshot
                                        { label: 'Anniversary Date', value: '' },
                                    ].map((row, idx) => (
                                        row.isHeader ? (
                                            <div key={idx} className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{row.label}</h4>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.sub}</p>
                                            </div>
                                        ) : (
                                            <div key={idx} className={`flex items-center p-4 border-b last:border-0 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                <span className={`w-1/3 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{row.label} :</span>
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{row.value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Response History */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Response History</h3>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'border-gray-500 text-gray-500' : 'border-gray-400 text-gray-400'}`}>i</div>
                                </div>

                                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Response Created on 02 Feb, 2026 | 06:40 AM</p>

                                <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                    {[
                                        { label: 'Follow Up ID', value: '2108290' },
                                        { label: 'Todo', value: rowData?.comment || 'Birthday Wish' },
                                        { label: 'Follow Up Schedule', value: rowData?.date || '02 Feb, 2026 11:50 PM' },
                                        { label: 'Follow Up Type', value: rowData?.type || 'Birthday', isTagLike: true },
                                        { label: 'Status', value: 'MISSED', isTagChange: true },
                                    ].map((row, idx) => (
                                        <div key={idx} className={`flex items-center p-4 border-b last:border-0 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                            <span className={`w-1/3 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{row.label} :</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm font-medium`}>{row.value}</span>
                                                {row.isTagLike && (
                                                    <span className={`px-3 py-1 rounded bg-[#fff7ed] border border-[#f97316]/30 text-[#f97316] text-xs font-bold`}>{row.value}</span>
                                                )}
                                                {row.isTagChange && (
                                                    <span className={`px-2 py-0.5 rounded bg-[#ef4444] text-white text-[10px] font-bold`}>{row.value}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Dot line connector indicator */}
                                <div className={`ml-4 h-8 border-l-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-100 bg-white'}`}>
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{rowData?.allocate || adminName || 'Admin'}</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enquiry Created by</span>
                    </div>
                    <button
                        onClick={() => {
                            if (onSubmit) {
                                onSubmit({ status: convertibility, comment: remarks, _id: rowData?._id });
                            }
                        }}
                        className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 transition-all"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FollowUpActionModal;
