import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    Users,
    RotateCcw,
    User,
    MessageSquare,
    BarChartBig,
    Utensils,
    ShieldCheck,
    CircleDollarSign,
    WalletCards,
    Grid,
    Fingerprint,
    ChevronDown,
    Info
} from 'lucide-react';

const Sidebar = ({ isOpen, isDarkMode }) => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState(['Members', 'Reports', 'Team']);

    const toggleSubMenu = (menu) => {
        setExpandedMenus(prev =>
            prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
        );
    };

    const menuItems = [
        { title: 'Dashboard', path: '/admin/dashboard', icon: <LayoutGrid size={20} /> },
        { title: 'Enquiries', path: '/admin/enquiries', icon: <Users size={20} /> },
        { title: 'Follow Ups', path: '/admin/follow-ups', icon: <RotateCcw size={20} /> },
        {
            title: 'Members',
            icon: <User size={20} />,
            subItems: [
                { title: 'Database', path: '/admin/members/list' },
                { title: 'Packages', path: '/admin/members/packages' },
                { title: 'Subscriptions', path: '/admin/members/memberships' },
                { title: 'Workout Cards', path: '/admin/members/workout-cards' },
                { title: 'Analytics', path: '/admin/members/analytics' },
                // { title: 'Mark Attendance', path: '/admin/members/attendance' },
            ]
        },
        { title: 'Feedback Management', path: '/admin/feedback', icon: <MessageSquare size={20} /> },
        {
            title: 'Reports',
            icon: <BarChartBig size={20} />,
            subItems: [
                { title: 'Balance Due', path: '/admin/reports/balance-due' },
                // { title: 'Sales Report', path: '/admin/reports/sales' },
                { title: 'Expired Members', path: '/admin/reports/expired' },
                // { title: 'Report Cards', path: '/admin/reports/members' },
                // { title: 'Expiring Soon', path: '/admin/reports/due' },
                { title: 'Attendance Audit', path: '/admin/reports/attendance' },
                { title: 'PT Report', path: '/admin/reports/pt' },
            ]
        },
        { title: 'DietPlan Management', path: '/admin/diet-plan', icon: <Utensils size={20} /> },
        { header: 'Business Setting' },
        {
            title: 'Team',
            icon: <ShieldCheck size={20} />,
            subItems: [
                { title: 'Employees', path: '/admin/business/employees' },
                { title: 'Employee Attendance', path: '/admin/business/attendance' },
            ]
        },
        { title: 'Payments', path: '/admin/business/payments', icon: <CircleDollarSign size={20} /> },
        { title: 'Expense Management', path: '/admin/business/expenses', icon: <WalletCards size={20} /> },
        // { title: 'Slot Management', path: '/admin/business/slots', icon: <Grid size={20} /> },
        { header: 'Setting' },
        { title: 'Biometric', path: '/admin/settings/biometric', icon: <Fingerprint size={20} /> },
        { title: 'Gym Details', path: '/admin/settings/gym', icon: <Info size={20} /> },
    ];

    return (
        <>
            <aside className={`fixed left-0 top-0 h-full border-r z-40 transition-none ${isOpen ? 'w-64' : 'w-20'} ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="h-16" />

                <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto pt-4 pb-10 scrollbar-hide">
                    <nav className="px-3 space-y-1">
                        {menuItems.map((item, idx) => {
                            if (item.header) {
                                return (
                                    <div key={idx} className={`px-4 pt-6 pb-2 text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {isOpen ? item.header : <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>}
                                    </div>
                                );
                            }

                            const isSubMenu = !!item.subItems;
                            const isExpanded = expandedMenus.includes(item.title);
                            const isActive = item.path && location.pathname.startsWith(item.path);
                            const isAnySubActive = isSubMenu && item.subItems.some(sub => location.pathname === sub.path);

                            return (
                                <div key={idx}>
                                    {isSubMenu ? (
                                        <>
                                            <button
                                                onClick={() => toggleSubMenu(item.title)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${isAnySubActive
                                                    ? (isDarkMode ? 'bg-[#f97316]/20 text-[#f97316]' : 'bg-orange-50 text-orange-600')
                                                    : (isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-black hover:bg-gray-50')
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`${isAnySubActive ? 'text-[#f97316]' : (isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-black opacity-70 group-hover:opacity-100')}`}>{item.icon}</span>
                                                    {isOpen && <span className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.title}</span>}
                                                </div>
                                                {isOpen && (
                                                    <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <ChevronDown size={14} className="text-gray-400" />
                                                    </span>
                                                )}
                                            </button>
                                            {isOpen && isExpanded && (
                                                <div className="mt-1 ml-4 space-y-1">
                                                    {item.subItems.map((sub, sIdx) => {
                                                        const subActive = location.pathname === sub.path;
                                                        return (
                                                            <NavLink
                                                                key={sIdx}
                                                                to={sub.path}
                                                                className={`block px-5 py-2 text-[13px] font-bold transition-colors rounded-md ${subActive
                                                                    ? 'text-[#f97316] bg-orange-50 dark:bg-[#f97316]/10'
                                                                    : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-black hover:bg-gray-50')
                                                                    }`}
                                                            >
                                                                {sub.title}
                                                            </NavLink>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                                ? (isDarkMode ? 'bg-[#f97316]/20 text-[#f97316]' : 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100')
                                                : (isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-black hover:bg-gray-50')
                                                }`}
                                        >
                                            <span className={`${isActive ? 'text-[#f97316]' : (isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-black opacity-70 group-hover:opacity-100')}`}>{item.icon}</span>
                                            {isOpen && <span className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.title}</span>}
                                        </NavLink>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
