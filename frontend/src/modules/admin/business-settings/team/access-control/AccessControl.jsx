import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

// Simple Custom Dropdown for consistency with design
const CustomDropdown = ({ options, value, onChange, isDarkMode, placeholder = "Select" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative min-w-[300px]" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 border rounded-lg text-[14px] font-bold flex justify-between items-center cursor-pointer transition-none ${isDarkMode
                        ? 'bg-[#1a1a1a] border-white/10 text-white'
                        : isOpen ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 text-[#f97316] shadow-sm'
                    }`}
            >
                <span className={`truncate ${value ? (isDarkMode ? 'text-white' : 'text-black') : 'text-[#f97316]'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#f97316]' : 'text-[#f97316]'}`} />
            </div>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 max-h-[250px] overflow-y-auto rounded-lg shadow-xl border z-50 custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 font-bold'
                    }`}>
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-3 text-[14px] cursor-pointer transition-colors ${isDarkMode
                                    ? 'text-gray-300 hover:bg-white/5'
                                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
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

const modulesData = [
    {
        title: "REPORTS",
        items: ["attendance report", "balance due report", "due membership report", "pt report", "sales report", "sms report"]
    },
    {
        title: "ANALYTICS",
        items: ["Analytics"]
    },
    {
        title: "BIOMETRIC",
        items: ["Biometric", "Add"]
    },
    {
        title: "CONFIGURATION",
        items: ["configuration"]
    },
    {
        title: "DASHBOARD",
        items: ["dashboard", "Financial Analytics", "Followup List", "Lead Type", "Member Trend", "Overview Card"]
    },
    {
        title: "DIET PLAN",
        items: ["Diet Plan", "Assign", "Create", "Delete", "Edit"]
    },
    {
        title: "EMPLOYEE ATTENDANCE",
        items: ["employee attendance"]
    },
    {
        title: "EMPLOYEES",
        items: ["employees", "Add", "Add to biometric", "Block biometric", "Delete", "Edit", "Unblock Biometric", "Update Status", "View QR"]
    },
    {
        title: "ENQUIRIES",
        items: ["enquiries", "Call not Connected", "Close Enquiry", "Edit Enquiry", "Generate Report", "Not Interested Enquiry", "Open Enquiry", "Sale Enquiry", "Schedule Follow up", "Send SMS"]
    },
    {
        title: "EXPENSE MANAGEMENT",
        items: ["expense management", "Add", "Delete", "Edit", "Generate Report"]
    },
    {
        title: "EXPIRED MEMBER REPORT",
        items: ["expired member report"]
    },
    {
        title: "FEEDBACK MANAGEMENT",
        items: ["feedback management", "Reply"]
    },
    {
        title: "FOLLOWUPS",
        items: ["followups", "Followup Done", "Edit Response", "Generate Report"]
    },
    {
        title: "GYM DETAILS",
        items: ["Gym Details", "Edit"]
    },
    {
        title: "MEMBER PROFILE",
        items: [
            "Add Biometric", "Add Finger", "Block Biometric", "Edit Profile", "Edit Invoice",
            "Add-on days", "Delete Membership", "Edit Membership", "Freeze Membership",
            "Renew Membership", "Resale Membership", "Transfer Membership", "Upgrade Membeship",
            "Pay Balance", "Unblock Biometric", "Upload Document", "View Attendance",
            "View Followup", "View Health Assesment", "View invoice", "View Report Card", "View Workout"
        ]
    },
    {
        title: "MEMBERS",
        items: [
            "members", "Generate Report", "Schedule Followup", "Send Notification", "Send SMS",
            "Vaccination", "View Absent", "View Active", "View All", "View Anniversary",
            "View Attendance", "View Birthday", "View Past", "View Profile", "View Upcoming"
        ]
    },
    {
        title: "MEMBERS WORKOUT CARD",
        items: ["members workout card", "Assign", "Create", "Delete", "Edit"]
    },
    {
        title: "MEMBERS REPORT CARD",
        items: ["members report card"]
    },
    {
        title: "MEMBERSHIP",
        items: ["membership", "Add Client ID", "Add on days", "Change Start Date", "Generate Report", "View Invoice"]
    },
    {
        title: "MEMBERSHIP ANALYTICS",
        items: ["membership analytics", "Generate Report"]
    },
    {
        title: "MEMBERSHIP PACKAGE",
        items: ["membership package", "Add", "Delete", "Edit", "Update Status"]
    },
    {
        title: "PAYMENTS",
        items: ["payments", "Change Invoice Date", "Change payment Date", "Edit Invoice", "Extend due date", "Mail invoice", "Pay Balance", "View Invoice"]
    },
    {
        title: "WHATSAPP WEB",
        items: ["WhatsApp Web", "Send Message"]
    }
];

const AccessControl = () => {
    const { isDarkMode } = useOutletContext();
    const navigate = useNavigate();

    // State
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedRole, setSelectedRole] = useState('');

    const roles = ["Branch Manager", "Diet Consultant", "Fitness Lead", "Freelancer", "Groupex Lead", "Housekeeping", "Manager"];

    const handleCheckboxChange = (category, item) => {
        const key = `${category}-${item}`;
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCategoryChange = (category, isChecked) => {
        const categoryModule = modulesData.find(m => m.title === category);
        const newCheckedItems = { ...checkedItems };

        categoryModule.items.forEach(item => {
            newCheckedItems[`${category}-${item}`] = isChecked;
        });

        setCheckedItems(newCheckedItems);
    };

    const isCategoryChecked = (category) => {
        const categoryModule = modulesData.find(m => m.title === category);
        if (!categoryModule) return false;
        return categoryModule.items.every(item => checkedItems[`${category}-${item}`]);
    };

    return (
        <div className={`transition-none pb-20 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-bold transition-none ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'bg-white border-gray-200 shadow-sm hover:bg-gray-50'}`}
                >
                    <ChevronLeft size={20} />
                    Back
                </button>
                <h1 className="text-[24px] font-black tracking-tight">Access Controls</h1>
            </div>

            {/* Info Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-12">
                <div className="space-y-3">
                    <p className="font-bold text-[15px]">Gym Name: <span className="font-black text-[16px]">V-10 Fitness Lab</span></p>
                    <p className="font-bold text-[15px]">Gym Branch Name:</p>
                </div>

                <div className="w-full md:w-auto">
                    <h2 className="text-[18px] font-black mb-3">Select Role</h2>
                    <CustomDropdown
                        placeholder="Select Role"
                        options={roles}
                        value={selectedRole}
                        onChange={setSelectedRole}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>

            {/* Grid Layout */}
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
                {modulesData.map((module, index) => (
                    <div
                        key={index}
                        className={`break-inside-avoid rounded-xl border p-6 ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
                    >
                        {/* Parent Category Checkbox */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id={`cat-${index}`}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#f97316] checked:border-[#f97316] transition-none"
                                    checked={isCategoryChecked(module.title)}
                                    onChange={(e) => handleCategoryChange(module.title, e.target.checked)}
                                />
                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <label htmlFor={`cat-${index}`} className="text-[15px] font-black uppercase cursor-pointer select-none tracking-wide text-gray-700 dark:text-gray-200">
                                {module.title}
                            </label>
                        </div>

                        {/* Child Items */}
                        <div className="pl-2 flex flex-col gap-4">
                            {module.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`item-${index}-${idx}`}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#f97316] checked:border-[#f97316] transition-none"
                                            checked={!!checkedItems[`${module.title}-${item}`]}
                                            onChange={() => handleCheckboxChange(module.title, item)}
                                        />
                                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" width="10" height="10" viewBox="0 0 12 12" fill="none">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <label htmlFor={`item-${index}-${idx}`} className={`text-[14px] font-medium cursor-pointer select-none tracking-tight transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'}`}>
                                        {item}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Submit Button */}
            <div className={`fixed bottom-0 left-0 right-0 p-4 border-t z-50 flex justify-start pl-8 md:pl-20 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'}`}>
                <button className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[15px] font-bold shadow-lg active:scale-95 transition-none hover:bg-orange-600">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AccessControl;
