import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MoreVertical, X, Maximize2, History, Edit3, Info, ChevronDown } from 'lucide-react';

const Dropdown = ({ options, value, onChange, isDarkMode, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold flex justify-between items-center cursor-pointer transition-all ${isDarkMode
                    ? 'bg-[#1a1a1a] border-white/10 text-white'
                    : isOpen ? 'bg-white border-orange-500 text-orange-500 shadow-lg shadow-orange-500/10' : 'bg-white border-gray-200 text-gray-400 shadow-sm'
                    }`}
            >
                <span className={value ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-2 py-1 rounded-xl shadow-2xl border z-[110] animate-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-100'}`}>
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${isDarkMode
                                ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                                }`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const FollowUpModal = ({ isOpen, onClose, followUp, memberName, memberMobile, isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('Edit Response');
    const [followUpData, setFollowUpData] = useState({
        convertibility: '',
        response: '',
        remarks: ''
    });

    if (!isOpen) return null;

    const statusColorsEdit = {
        'DONE': 'bg-[#ef4444]',
        'PENDING': 'bg-[#ef4444]',
        'MISSED': 'bg-[#ef4444]'
    };

    const getHistoryStatusClass = (status) => {
        if (status === 'DONE') {
            return isDarkMode
                ? 'bg-orange-500/10 border-orange-500/50 text-orange-500'
                : 'bg-orange-50 border-orange-200 text-orange-800';
        }
        if (status === 'PENDING') {
            return isDarkMode
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-500'
                : 'bg-blue-50 border-blue-200 text-blue-800';
        }
        if (status === 'MISSED') {
            return isDarkMode
                ? 'bg-red-500/10 border-red-500/50 text-red-500'
                : 'bg-red-50 border-red-200 text-red-800';
        }
        return 'bg-gray-500 text-white';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                {/* Header */}
                <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'bg-[#2a2a2a] border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                    <div>
                        <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{memberName}</h3>
                        <p className="text-[11px] text-gray-500 font-bold">Follow Up ID : {followUp?.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-700"><Maximize2 size={18} /></button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b dark:border-white/10 border-gray-100 px-4">
                    <button
                        onClick={() => setActiveTab('Edit Response')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${activeTab === 'Edit Response' ? 'text-orange-500' : 'text-gray-400'}`}
                    >
                        <Edit3 size={16} />
                        Edit Response
                        {activeTab === 'Edit Response' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('Response History')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${activeTab === 'Response History' ? 'text-orange-500' : 'text-gray-400'}`}
                    >
                        <History size={16} />
                        Response History
                        {activeTab === 'Response History' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    {activeTab === 'Edit Response' ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                Response Properties <Info size={16} />
                            </div>

                            <div className={`rounded-xl border divide-y overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 divide-white/10' : 'bg-white border-gray-200 divide-gray-100'}`}>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Follow Up ID :</span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{followUp?.id}</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Follow Up On :</span>
                                    <div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${statusColorsEdit[followUp?.status] || 'bg-gray-400'}`}>
                                            {followUp?.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Remarks/Summary:</span>
                                    <span className="text-sm font-bold">-</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Assign to :</span>
                                    <span className="text-sm font-bold">-</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Schedule by :</span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{followUp?.scheduleBy}</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Follow Up Type :</span>
                                    <div>
                                        <span className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-[#fff7ed] border-[#fdba74] text-[#9a3412]'}`}>
                                            {followUp?.membershipType}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Convertibility :</span>
                                    <div className="w-4 h-7 rounded-sm bg-red-500" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 pb-2 border-b dark:border-white/10 border-gray-100">
                                Update Response <Info size={16} />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Convertibility Status</label>
                                    <Dropdown
                                        options={['Hot', 'Warm', 'Cold']}
                                        value={followUpData.convertibility}
                                        onChange={(val) => setFollowUpData({ ...followUpData, convertibility: val })}
                                        isDarkMode={isDarkMode}
                                        placeholder="Select"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Customer Response*</label>
                                    <Dropdown
                                        options={[
                                            'Follow Up Again',
                                            'Successful Follow Up',
                                            'Not Interested',
                                            'Appointment Booked',
                                            'Rates To High',
                                            'Wrong Number',
                                            'Joined Other Gym'
                                        ]}
                                        value={followUpData.response}
                                        onChange={(val) => setFollowUpData({ ...followUpData, response: val })}
                                        isDarkMode={isDarkMode}
                                        placeholder="Select"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Customer Remarks*</label>
                                    <textarea
                                        placeholder="Type your Remarks here"
                                        value={followUpData.remarks}
                                        onChange={(e) => setFollowUpData({ ...followUpData, remarks: e.target.value })}
                                        className={`w-full h-24 rounded-xl p-4 border text-sm outline-none resize-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500' : 'bg-white border-gray-200 focus:border-orange-500'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                Customer Details <Info size={16} />
                            </div>
                            <div className={`rounded-xl border divide-y overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 divide-white/10' : 'bg-white border-gray-200 divide-gray-100'}`}>
                                <div className="p-3 flex flex-col items-start gap-1">
                                    <span className="text-sm font-bold">{memberName}</span>
                                    <span className="text-xs font-bold text-gray-500">+91{memberMobile}</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Mobile Number :</span>
                                    <span className="text-sm font-bold text-blue-500">+91{memberMobile}</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                                    <span className="text-sm font-bold">--</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Email Address :</span>
                                    <span className="text-sm font-bold">-</span>
                                </div>
                                <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                    <span className="text-sm font-medium text-gray-500">Anniversary Date :</span>
                                    <span className="text-sm font-bold">-</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                Response History <Info size={16} />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-500">Response Created on 03 Feb, 2026 | 06:04 AM</p>
                                    <div className={`rounded-xl border divide-y overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 divide-white/10' : 'bg-white border-gray-200 divide-gray-100'}`}>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Follow Up ID :</span>
                                            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>2109694</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Todo:</span>
                                            <span className={`text-sm font-bold italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>GYM WORKOUT, 12 months, renewal due on 18-02-2026.</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Follow Up Schedule :</span>
                                            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>03 Feb, 2026 11:50 PM</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Follow Up Type :</span>
                                            <div>
                                                <span className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-[#fff7ed] border-[#fdba74] text-[#9a3412]'}`}>
                                                    Membership Renewal
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                            <span className="text-sm font-medium text-gray-500">Status :</span>
                                            <div>
                                                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase border ${getHistoryStatusClass('MISSED')}`}>MISSED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-500">Response Created on 03 Mar, 2025 | 06:30 AM</p>
                                    <div className={`rounded-xl border divide-y overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 divide-white/10' : 'bg-white border-gray-200 divide-gray-100'}`}>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Follow Up ID :</span>
                                            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>1402447</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Todo:</span>
                                            <span className={`text-sm font-bold italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Follow up for balance payment of Rs. 3000 due on 06-03-2025 against invoice number V10FL/2024-2025/1.</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Remark:</span>
                                            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>-</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Call Response:</span>
                                            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>-</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Follow Up Schedule :</span>
                                            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>05 Mar, 2025 11:50 PM</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-start">
                                            <span className="text-sm font-medium text-gray-500">Follow Up Type :</span>
                                            <div>
                                                <span className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-[#fff7ed] border-[#fdba74] text-[#9a3412]'}`}>
                                                    Balance Due
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3 grid grid-cols-[140px_1fr] items-center">
                                            <span className="text-sm font-medium text-gray-500">Status :</span>
                                            <div>
                                                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase border ${getHistoryStatusClass('DONE')}`}>DONE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? 'bg-[#2a2a2a] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <div>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{memberName}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Enquiry Created by</p>
                    </div>
                    <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

const MemberFollowUps = () => {
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const {
        memberName,
        memberMobile,
        memberEmail,
        memberDOB,
        memberAnniversary,
        memberEmergencyName,
        memberEmergencyNo
    } = context || {};
    const [activeActionRow, setActiveActionRow] = useState(null);
    const [selectedFollowUp, setSelectedFollowUp] = useState(null);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const actionRef = useRef({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeActionRow !== null) {
                if (actionRef.current[activeActionRow] && !actionRef.current[activeActionRow].contains(event.target)) {
                    setActiveActionRow(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeActionRow]);

    // Dummy Follow Ups Data
    const followUps = [
        {
            id: '1402447',
            scheduleBy: 'Abdulla Pathan',
            membershipType: 'Balance Due',
            scheduleOn: '05 Mar, 2025 11:50 PM',
            assignedTrainer: 'Abdulla Pathan',
            status: 'DONE'
        },
        {
            id: '2109694',
            scheduleBy: 'Abdulla Pathan',
            membershipType: 'Membership Renewal',
            scheduleOn: '03 Feb, 2026 11:50 PM',
            assignedTrainer: 'Abdulla Pathan',
            status: 'PENDING'
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Follow Ups</h2>

            {/* Info Card (Same as Memberships) */}
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

            {/* Follow Ups Table */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="p-4 bg-white dark:bg-white/5 border-b dark:border-white/10 border-gray-100">
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Follow Ups</h3>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`text-xs font-bold border-b ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
                                <th className="px-6 py-4 whitespace-nowrap">Follow Up ID</th>
                                <th className="px-6 py-4 whitespace-nowrap">Schedule by</th>
                                <th className="px-6 py-4 whitespace-nowrap">Membership Type</th>
                                <th className="px-6 py-4 whitespace-nowrap">Schedule on</th>
                                <th className="px-6 py-4 whitespace-nowrap">Assigned Trainer</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {followUps.map((item, idx) => (
                                <tr key={idx} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'}`}>
                                    <td className="px-6 py-5">{item.id}</td>
                                    <td className="px-6 py-5">{item.scheduleBy}</td>
                                    <td className="px-6 py-5">{item.membershipType}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span>{item.scheduleOn.split(' ')[0]} {item.scheduleOn.split(' ')[1]} {item.scheduleOn.split(' ')[2]}</span>
                                            <span className="text-gray-400 text-[10px]">{item.scheduleOn.split(' ').slice(3).join(' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">{item.assignedTrainer}</td>
                                    <td className="px-6 py-5">{item.status}</td>
                                    <td className="px-6 py-5 text-right relative" ref={el => actionRef.current[idx] = el}>
                                        <button
                                            onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                        >
                                            <MoreVertical size={16} className="text-gray-500" />
                                        </button>

                                        {activeActionRow === idx && (
                                            <div className={`absolute right-12 top-2 w-[120px] rounded-lg shadow-xl border z-50 overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                                                <div className="py-1">
                                                    <div
                                                        onClick={() => {
                                                            setActiveActionRow(null);
                                                            setSelectedFollowUp(item);
                                                            setIsFollowUpModalOpen(true);
                                                        }}
                                                        className={`px-4 py-2 text-[13px] font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                                    >
                                                        View
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <FollowUpModal
                isOpen={isFollowUpModalOpen}
                onClose={() => setIsFollowUpModalOpen(false)}
                followUp={selectedFollowUp}
                memberName={memberName}
                memberMobile={memberMobile}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default MemberFollowUps;
