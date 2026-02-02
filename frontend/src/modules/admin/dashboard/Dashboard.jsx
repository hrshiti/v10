import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronDown,
    RefreshCcw,
    Calendar,
    MoreVertical
} from 'lucide-react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area
} from 'recharts';
import { useOutletContext, useNavigate } from 'react-router-dom';
import DateRangeFilter from '../components/DateRangeFilter';

const Dashboard = () => {
    const { isDarkMode } = useOutletContext();
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Dropdown states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showFollowUpType, setShowFollowUpType] = useState(false);
    const [showRowsPerPage, setShowRowsPerPage] = useState(false);
    const [showYearFilter, setShowYearFilter] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedDateRange, setSelectedDateRange] = useState('Today');
    const [selectedDateRangeText, setSelectedDateRangeText] = useState('');

    // Refs for click outside detection
    const datePickerRef = useRef(null);
    const followUpTypeRef = useRef(null);
    const rowsPerPageRef = useRef(null);
    const yearFilterRef = useRef(null);
    const menuRefs = useRef({});

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            window.location.reload();
        }, 500);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
            if (followUpTypeRef.current && !followUpTypeRef.current.contains(event.target)) {
                setShowFollowUpType(false);
            }
            if (rowsPerPageRef.current && !rowsPerPageRef.current.contains(event.target)) {
                setShowRowsPerPage(false);
            }
            if (yearFilterRef.current && !yearFilterRef.current.contains(event.target)) {
                setShowYearFilter(false);
            }
            // Close three-dot menus
            if (activeMenu !== null) {
                const menuRef = menuRefs.current[activeMenu];
                if (menuRef && !menuRef.contains(event.target)) {
                    setActiveMenu(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenu]);

    // Year filter options
    const yearFilterOptions = ['Today', 'Yesterday', 'This month'];

    // Follow Ups Data
    const followUps = [
        {
            name: 'KUNAL CHAUHAN',
            number: '9978145629',
            type: 'Balance Due',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'Follow up for balance payment of Rs. 4000 due on 31-01-2026 against invoice number V10FL/2025-26/554.'
        },
        {
            name: 'Riya patel',
            number: '9099031248',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 14-02-2026.'
        },
        {
            name: 'satish badgujar',
            number: '8488800551',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 14-02-2026.'
        },
        {
            name: 'KRISHNA PRAJAPATI',
            number: '9726540860',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 13-02-2026.'
        },
        {
            name: 'SHASTHA MUDOLIAR',
            number: '9712244420',
            type: 'Membership Renewal',
            dateTime: '30 Jan, 2026 11:50 PM',
            status: 'Hot',
            comment: 'GYM WORKOUT, 12 months, renewal due on 13-02-2026.'
        }
    ];

    // Chart Data
    const leadTypesData = [
        { name: 'Hot Leads', value: 10, color: '#ef4444' },
        { name: 'Warm Leads', value: 33, color: '#f97316' },
        { name: 'Cold Leads', value: 649, color: '#0ea5e9' },
    ];

    const membersTrendData = [
        { name: 'Jan', active: 58, inactive: 5, upcoming: 5 },
        { name: 'Feb', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Mar', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Apr', active: 0, inactive: 0, upcoming: 0 },
        { name: 'May', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Jun', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Jul', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Aug', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Sep', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Oct', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Nov', active: 0, inactive: 0, upcoming: 0 },
        { name: 'Dec', active: 0, inactive: 0, upcoming: 0 },
    ];

    const financialData = [
        { name: 'Jan', amount: 330000 },
        { name: 'Feb', amount: 0 },
        { name: 'Mar', amount: 0 },
        { name: 'Apr', amount: 0 },
        { name: 'May', amount: 0 },
        { name: 'Jun', amount: 0 },
        { name: 'Jul', amount: 0 },
        { name: 'Aug', amount: 4800 },
        { name: 'Sep', amount: 0 },
        { name: 'Oct', amount: 0 },
        { name: 'Nov', amount: 0 },
        { name: 'Dec', amount: 0 },
    ];

    // Date picker quick options
    const dateOptions = ['Today', 'Yesterday', 'Last Week', 'Last Months', 'This Year'];

    // Follow up type options
    const followUpTypes = ['Balance Due', 'Enquiry', 'Feedback'];

    // Rows per page options
    const rowsOptions = [5, 10, 20, 50];

    // Handle card navigation
    const handleCardClick = (route) => {
        navigate(route);
    };

    return (
        <div className={`space-y-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className={`text-[28px] font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Dashboard</h1>
                <button
                    onClick={handleRefresh}
                    className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-2 rounded-md text-[14px] font-bold transition-colors active:scale-95"
                >
                    <RefreshCcw size={16} className={`inline mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Search & Date Filter */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                <div className="relative w-full lg:max-w-xs">
                    <input
                        type="text"
                        placeholder='Search & Create "New Sales"'
                        className={`w-full px-4 py-2.5 border rounded-md text-[14px] font-normal outline-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-black placeholder:text-gray-400'
                            }`}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-[14px] font-normal ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>Sort by</span>
                    <div className="relative">
                        <DateRangeFilter
                            isDarkMode={isDarkMode}
                            selectedRangeLabel={selectedDateRange}
                            align="right"
                            onApply={(range) => {
                                setSelectedDateRange(range.label);
                                setSelectedDateRangeText(`${range.startDate.toLocaleDateString()} - ${range.endDate.toLocaleDateString()}`);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Follow Ups Section */}
            <section className="space-y-3">
                <p className={`text-[13px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Follow Ups (5)</p>
                <div className={`border rounded-lg ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                    {/* Table Header */}
                    <div className={`px-5 py-3 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-white'}`}>
                        <span className={`font-bold text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Follow Ups</span>
                        <div className="flex items-center gap-4">
                            <button className="text-[13px] font-normal text-[#f97316] hover:underline">Hide</button>

                            {/* Follow Up Type Dropdown */}
                            <div className="relative" ref={followUpTypeRef}>
                                <div
                                    onClick={() => setShowFollowUpType(!showFollowUpType)}
                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-black'
                                        }`}
                                >
                                    <span className="text-[13px] font-normal">Follow up Type</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>

                                {showFollowUpType && (
                                    <div className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl border z-50 py-2 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'
                                        }`}>
                                        {followUpTypes.map((type, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    setShowFollowUpType(false);
                                                }}
                                                className={`px-4 py-2.5 text-[14px] font-normal cursor-pointer ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-black'
                                                    }`}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-[13px] font-bold border-b ${isDarkMode ? 'border-white/5 text-gray-400' : 'border-gray-100 text-black'}`}>
                                    <th className="px-5 py-3 font-bold">Name & Number</th>
                                    <th className="px-5 py-3 font-bold">Follow Up Type</th>
                                    <th className="px-5 py-3 font-bold">Follow Up Date & Time</th>
                                    <th className="px-5 py-3 font-bold">Convertibility Status</th>
                                    <th className="px-5 py-3 font-bold">Comment</th>
                                    <th className="px-5 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className={`text-[13px] ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                {followUps.slice(0, rowsPerPage).map((item, idx) => (
                                    <tr key={idx} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-blue-500 font-normal hover:underline cursor-pointer">{item.name}</span>
                                                <span className="text-blue-400 font-normal text-[12px]">{item.number}</span>
                                            </div>
                                        </td>
                                        <td className={`px-5 py-4 font-normal ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{item.type}</td>
                                        <td className={`px-5 py-4 font-normal ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{item.dateTime}</td>
                                        <td className="px-5 py-4">
                                            <span className="bg-[#ef4444] text-white px-2.5 py-1 rounded-md text-[11px] font-bold">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className={`px-5 py-4 text-[12px] font-normal max-w-md ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>
                                            {item.comment}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="relative inline-block" ref={(el) => menuRefs.current[idx] = el}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenu(activeMenu === idx ? null : idx);
                                                    }}
                                                    className={`p-1 rounded transition-colors ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {/* Three Dot Menu */}
                                                {activeMenu === idx && (
                                                    <div
                                                        className={`absolute right-0 ${idx >= (followUps.length - 2) ? 'bottom-full mb-2' : 'top-full mt-1'} w-48 rounded-lg shadow-2xl border z-[999] py-2 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'
                                                            }`}
                                                    >
                                                        <div
                                                            onClick={() => setActiveMenu(null)}
                                                            className={`px-4 py-2.5 text-[14px] font-normal cursor-pointer ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-black'
                                                                }`}
                                                        >
                                                            Followup Response
                                                        </div>
                                                        <div
                                                            onClick={() => setActiveMenu(null)}
                                                            className={`px-4 py-2.5 text-[14px] font-normal cursor-pointer ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-black'
                                                                }`}
                                                        >
                                                            Done
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className={`px-5 py-3 border-t flex justify-between items-center ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-white'}`}>
                        <div className="flex items-center gap-2">
                            <button className={`px-3 py-1.5 border rounded-md text-[12px] font-normal ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-black'
                                }`}>« Previous</button>
                            <button className="w-8 h-8 bg-[#f97316] text-white rounded-md font-bold text-[12px]">1</button>
                            <button className={`w-8 h-8 border rounded-md text-[12px] font-normal ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-black'
                                }`}>2</button>
                            <button className={`w-8 h-8 border rounded-md text-[12px] font-normal ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-black'
                                }`}>3</button>
                            <button className={`w-8 h-8 border rounded-md text-[12px] font-normal ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-black'
                                }`}>4</button>
                            <button className={`px-3 py-1.5 border rounded-md text-[12px] font-normal ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-black'
                                }`}>Next »</button>
                        </div>

                        {/* Rows Per Page Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className={`text-[13px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Rows per page</span>
                            <div className="relative" ref={rowsPerPageRef}>
                                <div
                                    onClick={() => setShowRowsPerPage(!showRowsPerPage)}
                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer ${isDarkMode ? 'bg-[#1e1e1e] border-white/10 text-white' : 'bg-white border-[#f97316] text-[#f97316]'
                                        }`}
                                >
                                    <span className="text-[14px] font-normal text-[#f97316]">{rowsPerPage}</span>
                                    <ChevronDown size={14} className="text-[#f97316]" />
                                </div>

                                {showRowsPerPage && (
                                    <div className={`absolute right-0 top-full mt-1 rounded-lg shadow-xl border z-[100] ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'
                                        }`}>
                                        <div className="flex items-center gap-0 p-2">
                                            {rowsOptions.map((option, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setRowsPerPage(option);
                                                        setShowRowsPerPage(false);
                                                    }}
                                                    className={`px-4 py-2 text-[14px] font-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 ${rowsPerPage === option ? 'text-[#f97316] font-bold' : isDarkMode ? 'text-gray-300' : 'text-black'
                                                        }`}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section className="space-y-3">
                <p className={`text-[13px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Overview</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Members Card */}
                    <div
                        onClick={() => handleCardClick('/admin/members/list')}
                        className="bg-[#3b82f6] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="px-4 py-2 border-b border-white/10">
                            <span className="text-[12px] font-bold text-white">Members</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-4 border-r border-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">413</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Active</p>
                            </div>
                            <div className="p-4 bg-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">4</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Upcoming</p>
                            </div>
                        </div>
                    </div>

                    {/* Follow Ups Overview Card */}
                    <div
                        onClick={() => handleCardClick('/admin/follow-ups')}
                        className="bg-[#f97316] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="px-4 py-2 border-b border-white/10">
                            <span className="text-[12px] font-bold text-white">Follow Ups Overview</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-4 border-r border-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">18</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Total</p>
                            </div>
                            <div className="p-4 bg-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Done</p>
                            </div>
                        </div>
                    </div>

                    {/* Enquiry Overview Card */}
                    <div
                        onClick={() => handleCardClick('/admin/enquiries')}
                        className="bg-[#10b981] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="px-4 py-2 border-b border-white/10">
                            <span className="text-[12px] font-bold text-white">Enquiry Overview</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-4 border-r border-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">New Enquiries</p>
                            </div>
                            <div className="p-4 bg-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Sales</p>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Card */}
                    <div className="bg-[#f59e0b] rounded-lg overflow-hidden">
                        <div className="grid grid-cols-2 h-full">
                            <div className="p-4 border-r border-white/10 flex flex-col">
                                <p className="text-[11px] font-bold text-white/80">Attendance</p>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Attendance</p>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">413</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Absent</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 flex flex-col">
                                <p className="text-[11px] font-bold text-white/80">Date</p>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Birthday</p>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Anniversary</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Row of Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Sales Card */}
                    <div
                        onClick={() => handleCardClick('/admin/reports/sales')}
                        className="bg-[#10b981] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="px-4 py-2 border-b border-white/10">
                            <span className="text-[12px] font-bold text-white">Total Sales</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-4 border-r border-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Number</p>
                            </div>
                            <div className="p-4 bg-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Fresh/Renewal Sales Card */}
                    <div
                        onClick={() => handleCardClick('/admin/reports/sales')}
                        className="bg-[#a855f7] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="grid grid-cols-2 h-full">
                            <div className="p-4 border-r border-white/10 flex flex-col">
                                <p className="text-[11px] font-bold text-white/80">Fresh Sales</p>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Number</p>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Amount</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 flex flex-col">
                                <p className="text-[11px] font-bold text-white/80">Renewal Sales</p>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Number</p>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Amount</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Balance Payment Card */}
                    <div
                        onClick={() => handleCardClick('/admin/reports/balance-due')}
                        className="bg-[#84cc16] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="px-4 py-2 border-b border-white/10">
                            <span className="text-[12px] font-bold text-white">Balance Payment</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-4 border-r border-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Paid</p>
                            </div>
                            <div className="p-4 bg-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Due</p>
                            </div>
                        </div>
                    </div>

                    {/* PT Sales Card */}
                    <div
                        onClick={() => handleCardClick('/admin/reports/sales')}
                        className="bg-[#a855f7] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="grid grid-cols-2 h-full">
                            <div className="p-4 border-r border-white/10 flex flex-col">
                                <p className="text-[11px] font-bold text-white/80">Fresh PT Sales</p>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Number</p>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Amount</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 flex flex-col">
                                <p className="text-[11px] font-bold text-white/80">PT Renewal Sales</p>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Number</p>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-[24px] font-bold text-white leading-none">0</h3>
                                    <p className="text-[10px] font-normal text-white/70 mt-0.5">Amount</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Third Row - Total PT Sales & Sales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total PT Sales Card */}
                    <div
                        onClick={() => handleCardClick('/admin/reports/sales')}
                        className="bg-[#10b981] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="px-4 py-2 border-b border-white/10">
                            <span className="text-[12px] font-bold text-white">Total PT Sales</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-4 border-r border-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Number</p>
                            </div>
                            <div className="p-4 bg-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Sales Card */}
                    <div
                        onClick={() => handleCardClick('/admin/reports/sales')}
                        className="bg-[#f97316] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="px-4 py-2 border-b border-white/10">
                            <span className="text-[12px] font-bold text-white">Sales</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-4 border-r border-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0/0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Upgrade</p>
                            </div>
                            <div className="p-4 bg-white/10">
                                <h3 className="text-[32px] font-bold text-white leading-none">0/0</h3>
                                <p className="text-[11px] font-normal text-white/80 mt-1">Transfer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Members Overview */}
            <section className="space-y-3">
                <p className={`text-[13px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Members Overview</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lead Types Donut */}
                    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <span className={`font-bold text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Lead Types</span>
                            <div className="relative" ref={yearFilterRef}>
                                <div
                                    onClick={() => setShowYearFilter(!showYearFilter)}
                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#f97316] text-[#f97316]'
                                        }`}
                                >
                                    <span className="text-[13px] font-normal">This year</span>
                                    <ChevronDown size={14} className="text-[#f97316]" />
                                </div>

                                {/* Year Filter Dropdown */}
                                {showYearFilter && (
                                    <div className={`absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl border z-50 py-2 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'
                                        }`}>
                                        {['Today', 'Yesterday', 'This month'].map((option, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    setShowYearFilter(false);
                                                }}
                                                className={`px-4 py-2.5 text-[14px] font-normal cursor-pointer ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-black'
                                                    }`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-full h-[280px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={leadTypesData}
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {leadTypesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className={`text-[40px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>692</span>
                                </div>
                            </div>
                            <div className="space-y-4 w-full md:w-auto">
                                {leadTypesData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                                            <span className={`text-[14px] font-normal ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{item.name}</span>
                                        </div>
                                        <span className={`text-[15px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Members Count Bar Chart */}
                    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                        <span className={`font-bold text-[14px] mb-6 block ${isDarkMode ? 'text-white' : 'text-black'}`}>Members Counting by Trend</span>
                        <div className="flex flex-wrap gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                                <span className="text-[12px] font-normal text-[#10b981]">Active Members : 1</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                                <span className="text-[12px] font-normal text-[#ef4444]">Inactive Members : 1</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                                <span className="text-[12px] font-normal text-[#f97316]">Upcoming Members : 1</span>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={membersTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#333' : '#eee'} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDarkMode ? '#666' : '#999' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDarkMode ? '#666' : '#999' }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="active" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="inactive" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="upcoming" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* Financial Analytics */}
            <section className="space-y-3">
                <p className={`text-[13px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Financial Analytics</p>
                <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="flex flex-wrap gap-6 mb-6">
                        {[
                            { color: '#06b6d4', label: 'Paid Amount' },
                            { color: '#84cc16', label: 'Paid Balance Amount' },
                            { color: '#f97316', label: 'Pending Payment' },
                            { color: '#ef4444', label: 'Total Expenses' },
                            { color: '#22c55e', label: 'Total Profit' },
                        ].map((indicator, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: indicator.color }} />
                                <span className="text-[12px] font-normal" style={{ color: indicator.color }}>{indicator.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333' : '#eee'} vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="amount" stroke="#10b981" fill="url(#colorAmount)" strokeWidth={2} />
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-gray-100 dark:border-white/5 pt-6 mt-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                                <span className={`text-[12px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Total Revenue</span>
                            </div>
                            <h2 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>₹343600.00</h2>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                <span className={`text-[12px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Pending Payment</span>
                            </div>
                            <h2 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>₹11500.00</h2>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span className={`text-[12px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Total Expenses</span>
                            </div>
                            <h2 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>₹0.00</h2>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                <span className={`text-[12px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Total Profit</span>
                            </div>
                            <h2 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>₹343600.00</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
