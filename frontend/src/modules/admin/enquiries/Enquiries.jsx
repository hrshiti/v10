import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  MessageSquare,
  Send,
  MoreVertical,
  Calendar,
  Phone,
  Users,
  UserMinus,
  PhoneOff,
  CheckCircle2,
  BarChart2,
  X,
  RefreshCcw,
  Check
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import AddEnquiryModal from './AddEnquiryModal';
import DateRangeFilter from '../components/DateRangeFilter';
import GenerateReportModal from '../components/GenerateReportModal';

const CustomFilterDropdown = ({ options, label, isDarkMode, isOpen, onToggle, onSelect, activeVal }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative min-w-[130px]" ref={dropdownRef}>
      <div
        onClick={onToggle}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-300 text-gray-500'}`
          }`}
      >
        <span>{activeVal || label}</span>
        <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-full min-w-[160px] rounded-lg shadow-xl border z-30 transition-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => onSelect(opt)}
              className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-none ${isDarkMode
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Removed manual DateRangeFilter

// Local ReportModal removed

const Enquiries = () => {
  const { isDarkMode } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Interactive tooltips / active rows
  const [activeActionRow, setActiveActionRow] = useState(null);

  // Refs for checking clicks outside
  const actionContainerRefs = useRef({});

  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);
  const [isSelectOptionOpen, setIsSelectOptionOpen] = useState(false);
  const rowsDropdownRef = useRef(null);
  const selectOptionRef = useRef(null);

  // States for filter dropdowns logic
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const filterOptions = {
    'Handle by': ['Abdulla Pathan', 'ANJALI KANWAR', 'V10 FITNESS LAB'],
    'Lead Type': ['Hot', 'Warm', 'Cold'],
    'Trial Booked': ['Yes', 'No', 'Clear'],
    'Select gender': ['Male', 'Female'],
    'Follow up': ['Yes', 'No']
  };

  // State for active stat card
  const [selectedStat, setSelectedStat] = useState('');

  const stats = [
    { label: 'Open Enquiry', value: '743', icon: Users, color: 'bg-blue-600', hover: 'hover:bg-blue-700', active: 'bg-blue-700', ring: 'ring-blue-400' },
    { label: 'Close Enquiry', value: '477', icon: UserMinus, color: 'bg-purple-600', hover: 'hover:bg-purple-600', active: 'bg-purple-700', ring: 'ring-purple-400' },
    { label: 'Not Interested', value: '5', icon: UserMinus, color: 'bg-red-500', hover: 'hover:bg-red-500', active: 'bg-red-600', ring: 'ring-red-400' },
    { label: 'Call Done', value: '1', icon: CheckCircle2, color: 'bg-emerald-500', hover: 'hover:bg-emerald-500', active: 'bg-emerald-600', ring: 'ring-emerald-400' },
    { label: 'Call Not Connected', value: '0', icon: PhoneOff, color: 'bg-slate-600', hover: 'hover:bg-slate-600', active: 'bg-slate-700', ring: 'ring-slate-400' },
  ];

  const enquiryData = [
    { id: '806642', date: '12 Jan, 2026', name: 'DHRUV SHIRESHIYA', mobile: '+918487833955', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806636', date: '12 Jan, 2026', name: 'MAGDUM SHAIKH', mobile: '+918200686685', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806632', date: '12 Jan, 2026', name: 'JAYESH BHAI', mobile: '+919022927826', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806630', date: '12 Jan, 2026', name: 'ATHARV BHAI', mobile: '+919875181649', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806629', date: '12 Jan, 2026', name: 'PAVAN BHAI', mobile: '+919079894819', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
  ];

  const toggleFilter = (label) => {
    if (activeFilter === label) {
      setActiveFilter(null);
    } else {
      setActiveFilter(label);
    }
  };

  const [isAssignTrainerOpen, setIsAssignTrainerOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const trainerOptions = ['Abdulla Pathan', 'ANJALI KANWAR', 'V10 FITNESS LAB'];
  const assignTrainerRef = useRef(null);

  const handleFilterSelect = (label, value) => {
    setFilterValues(prev => ({ ...prev, [label]: value }));
    setActiveFilter(null);
  };

  // Close dropdowns on click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Assign Trainer Dropdown
      if (assignTrainerRef.current && !assignTrainerRef.current.contains(event.target)) {
        setIsAssignTrainerOpen(false);
      }
      // Select Option Dropdown
      if (selectOptionRef.current && !selectOptionRef.current.contains(event.target)) {
        setIsSelectOptionOpen(false);
      }
      // Rows Per Page Dropdown
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) {
        setIsRowsDropdownOpen(false);
      }

      // Action Menu - Check if click is outside the specific active row's container
      if (activeActionRow !== null) {
        const currentRef = actionContainerRefs.current[activeActionRow];
        if (currentRef && !currentRef.contains(event.target)) {
          setActiveActionRow(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeActionRow]); // Re-bind when activeActionRow changes to ensure closure is correct if needed, though ref should be stable

  // Handle Action Row Toggle
  const toggleActionRow = (idx) => {
    if (activeActionRow === idx) setActiveActionRow(null);
    else setActiveActionRow(idx);
  }

  // Auto-Close Action Menu on Selection
  const handleActionSelect = () => {
    setActiveActionRow(null);
  };


  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Enquiry</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none"
        >
          <Plus size={20} />
          Add Enquiry
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-none">
        {stats.map((stat, idx) => {
          const isActive = selectedStat === stat.label;
          return (
            <div
              key={idx}
              onClick={() => setSelectedStat(stat.label)}
              className={`group p-5 rounded-lg flex items-center gap-4 transition-all duration-300 cursor-pointer 
                ${isActive
                  ? `${stat.active} text-white shadow-lg ring-1 ${stat.ring} ${stat.hover}`
                  : (isDarkMode
                    ? `bg-[#1a1a1a] border border-white/5 text-white ${stat.hover} hover:border-transparent hover:shadow-lg`
                    : `bg-white border border-gray-200 text-black ${stat.hover} hover:text-white hover:border-transparent hover:shadow-lg`
                  )}`}
            >
              <div className={`p-3 rounded-lg transition-all duration-300 
                ${isActive
                  ? 'bg-white/20 text-white'
                  : (isDarkMode
                    ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                  )}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className={`text-[24px] font-black leading-none transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{stat.value}</p>
                <p className={`text-[13px] font-bold mt-1 transition-colors duration-300 
                  ${isActive
                    ? 'text-white/80'
                    : (isDarkMode ? 'text-gray-500 group-hover:text-white/80' : 'text-gray-500 group-hover:text-white/80')
                  }`}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Second Stats Row */}
      <div className="flex gap-4 transition-none">
        <div
          onClick={() => setSelectedStat('Enquiry Ratio')}
          className={`group p-5 rounded-lg flex items-center gap-4 w-full max-w-[215px] transition-all duration-300 cursor-pointer 
            ${selectedStat === 'Enquiry Ratio'
              ? 'bg-orange-600 text-white shadow-lg ring-1 ring-orange-400'
              : (isDarkMode
                ? 'bg-[#1a1a1a] border border-white/5 hover:bg-orange-600 hover:border-orange-600 hover:shadow-lg'
                : 'bg-white border border-gray-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:shadow-lg'
              )}`}
        >
          <div className={`p-3 rounded-lg transition-all duration-300 
            ${selectedStat === 'Enquiry Ratio'
              ? 'bg-white/20 text-white'
              : (isDarkMode
                ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                : 'bg-gray-100 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
              )}`}>
            <BarChart2 size={28} />
          </div>
          <p className={`text-[15px] font-bold transition-colors duration-300 
            ${selectedStat === 'Enquiry Ratio'
              ? 'text-white'
              : (isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-white')
            }`}>
            Enquiry Ratio
          </p>
        </div>
      </div>

      {/* Filters Row 1 - Custom Dropdowns */}
      <div className="flex flex-wrap gap-3 transition-none">
        {Object.keys(filterOptions).map((label, idx) => (
          <CustomFilterDropdown
            key={idx}
            label={label}
            options={filterOptions[label]}
            isDarkMode={isDarkMode}
            isOpen={activeFilter === label}
            onToggle={() => toggleFilter(label)}
            onSelect={(val) => handleFilterSelect(label, val)}
            activeVal={filterValues[label]}
          />
        ))}
      </div>

      {/* Filters Row 2 - DateRangeFilter + Buttons */}
      <div className="flex flex-wrap items-center gap-3 transition-none">
        <DateRangeFilter
          isDarkMode={isDarkMode}
          onApply={(range) => console.log('Range Applied:', range)}
        />
      </div>

      {/* Search & Export */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 transition-none pt-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg text-[15px] font-bold outline-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-black placeholder:text-gray-400'}`}
          />
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[14px] font-bold border transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 shadow-sm'}`}
        >
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3 transition-none pt-2">
        {/* Assign Trainer Custom Dropdown */}
        <div className="relative min-w-[170px]" ref={assignTrainerRef}>
          <div
            onClick={() => setIsAssignTrainerOpen(!isAssignTrainerOpen)}
            className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between ${isDarkMode
              ? 'bg-[#1a1a1a] border-white/10 text-white'
              : `bg-white ${isAssignTrainerOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-300 text-gray-600'}`
              }`}
          >
            <span>{selectedTrainer || 'Assign Trainer'}</span>
            <ChevronDown size={16} className={isAssignTrainerOpen ? 'text-[#f97316]' : 'text-gray-400'} />
          </div>

          {isAssignTrainerOpen && (
            <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-30 transition-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
              }`}>
              {trainerOptions.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedTrainer(opt);
                    setIsAssignTrainerOpen(false);
                  }}
                  className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-none ${isDarkMode
                    ? 'text-gray-300 hover:bg-white/5'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Select Option Dropdown */}
        <div className="relative min-w-[150px]" ref={selectOptionRef}>
          <div
            onClick={() => setIsSelectOptionOpen(!isSelectOptionOpen)}
            className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : `bg-white ${isSelectOptionOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-300 text-gray-600'}`
              }`}
          >
            <span>Select Option</span>
            <ChevronDown size={16} className={isSelectOptionOpen ? 'text-[#f97316]' : 'text-gray-400'} />
          </div>

          {isSelectOptionOpen && (
            <div className={`absolute top-full left-0 w-[200px] mt-1 rounded-lg shadow-xl border z-20 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
              }`}>
              {['All', 'Row Per Page', 'Selected Items'].map((opt, i) => (
                <div
                  key={i}
                  onClick={() => setIsSelectOptionOpen(false)}
                  className={`px-4 py-3 text-[14px] font-medium hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="bg-gray-500 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Submit</button>
      </div>

      {/* Table Header Overlay */}
      <div className={`mt-8 border rounded-lg transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="p-4 border-b flex justify-between items-center transition-none">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Enquiry</span>
          <button className={`flex items-center gap-3 px-6 py-2 rounded-full text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>
            <MessageSquare size={16} className="fill-current" />
            Send SMS (4998)
            <Send size={16} />
          </button>
        </div>
        <div className="overflow-visible min-h-[450px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-4"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></th>
                <th className="px-6 py-4">Enquiry No.</th>
                <th className="px-6 py-4">Enquiry Date</th>
                <th className="px-6 py-4">Name & Mob. No.</th>
                <th className="px-6 py-4">Trial Booked</th>
                <th className="px-6 py-4">Handle by</th>
                <th className="px-6 py-4">Lead Type</th>
                <th className="px-6 py-4">Remark/Summary</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {enquiryData.slice(0, rowsPerPage).map((row, idx) => (
                <tr key={idx} className={`border-b transition-none relative ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-5"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></td>
                  <td className="px-6 py-5">{row.id}</td>
                  <td className="px-6 py-5">{row.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="uppercase">{row.name}</span>
                      <span className="text-gray-500">{row.mobile}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-[#ef4444] text-white px-3 py-1 rounded text-[11px] font-black uppercase">No</span>
                  </td>
                  <td className="px-6 py-5">{row.handle}</td>
                  <td className="px-6 py-5">
                    <span className="bg-[#0ea5e9] text-white px-3 py-1 rounded text-[11px] font-black uppercase">Cold</span>
                  </td>
                  <td className="px-6 py-5"></td>
                  <td className="px-6 py-5">{row.created}</td>
                  <td className="px-6 py-5 relative" ref={el => actionContainerRefs.current[idx] = el}>
                    <button
                      onClick={() => toggleActionRow(idx)}
                      className={`transition-none ${activeActionRow === idx ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                    >
                      <MoreVertical size={20} />
                    </button>
                    {/* Action Menu attached to this specific row */}
                    {activeActionRow === idx && (
                      <div
                        className={`absolute right-10 top-0 mt-2 w-56 rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}
                      >
                        {["Sale Enquiry", "Edit Enquiry", "Not Interested", "Call Done", "Call Not Connected"].map((action, i) => (
                          <div
                            key={i}
                            className={`px-4 py-3 text-[14px] font-medium border-b last:border-0 cursor-pointer ${isDarkMode
                              ? 'text-gray-300 border-white/5 hover:bg-white/5'
                              : 'text-gray-700 border-gray-50 hover:bg-orange-50 hover:text-orange-600'
                              }`}
                            onClick={handleActionSelect}
                          >
                            {action}
                          </div>
                        ))}
                        <div
                          className={`px-4 py-3 text-[14px] font-medium cursor-pointer flex items-center gap-2 ${isDarkMode
                            ? 'text-gray-300 hover:bg-white/5'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                          onClick={handleActionSelect}
                        >
                          <RefreshCcw size={14} className="" />
                          Schedule Follow Up
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>« Previous</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button key={num} className={`w-10 h-10 rounded-lg text-[13px] font-bold transition-none ${num === 2 ? 'bg-[#f97316] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
            <span className="px-2 text-gray-400">...</span>
            {[148, 149].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[13px] font-bold shadow-sm transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>
                {num}
              </button>
            ))}
            <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-3 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative" ref={rowsDropdownRef}>
              <div
                onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                className={`flex items-center justify-between w-[70px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-[#f97316] text-[#f97316]'
                  }`}
              >
                <span className="text-[14px] font-bold">{rowsPerPage}</span>
                <ChevronDown size={14} className={isRowsDropdownOpen ? 'text-[#f97316]' : 'text-[#f97316]'} />
              </div>

              {isRowsDropdownOpen && (
                <div className={`absolute bottom-full right-0 mb-1 w-[80px] rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                  {[5, 10, 20, 50].map((rows) => (
                    <div
                      key={rows}
                      onClick={() => {
                        setRowsPerPage(rows);
                        setIsRowsDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-[14px] font-bold text-center cursor-pointer hover:bg-gray-100 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
                    >
                      {rows}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Enquiries;
