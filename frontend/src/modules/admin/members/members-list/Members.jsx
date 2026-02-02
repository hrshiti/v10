import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Bell,
  MoreVertical,
  User,
  UserPlus,
  UserMinus,
  Users,
  Activity,
  Send,
  X,
  Plus,
  Calendar
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// --- Reusable Components ---

const CustomDropdown = ({ options, value, onChange, isDarkMode, placeholder = "Select", minWidth = "150px" }) => {
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
    <div className="relative" style={{ minWidth }} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-xl text-[14px] font-bold flex justify-between items-center cursor-pointer transition-none ${isDarkMode
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
        <div className={`absolute top-full left-0 right-0 mt-1 max-h-[250px] overflow-y-auto rounded-lg shadow-xl border z-50 custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
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

const GenerateReportModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generate Report</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <label className={`block text-[14px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>OTP*</label>
          <input
            type="text"
            placeholder="OTP"
            className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 shadow-inner'}`}
          />
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600">
            Validate
          </button>
        </div>
      </div>
    </div>
  );
};

const RowsPerPageDropdown = ({ rowsPerPage, setRowsPerPage, isDarkMode }) => {
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
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-[90px] px-4 py-2 border rounded-xl cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white text-[#f97316] border-[#f97316]/30 shadow-sm'
          }`}
      >
        <span className="text-[14px] font-bold">{rowsPerPage}</span>
        <ChevronDown size={14} className="text-[#f97316]" />
      </div>

      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-1 w-[90px] rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
          {[5, 10, 20, 50].map((rows) => (
            <div
              key={rows}
              onClick={() => {
                setRowsPerPage(rows);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[14px] font-bold text-center cursor-pointer hover:bg-gray-100 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {rows}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

const Members = () => {
  const { isDarkMode } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(null);
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

  const stats = [
    { label: 'All Members', value: '1080', icon: User, color: 'bg-blue-600', active: true },
    { label: 'Active Members', value: '413', icon: Activity, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Upcoming Members', value: '4', icon: UserPlus, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Past Members', value: '547', icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Today Attendance', value: '0', icon: Users, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
  ];

  const membersData = [
    { id: '1232', name: 'NIRAJ GUPTA', mobile: '+917778877207', gender: 'Male', status: 'Active', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '1231', name: 'CHANDAN SINGH', mobile: '+91919998596909', gender: 'Male', status: 'Active', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '1230', name: 'DEV LODHA', mobile: '+917698523069', gender: 'Male', status: 'Active', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '5/1229', name: 'KHETRAM KUMAWAT', mobile: '+916376566316', gender: 'Male', status: 'Active', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '99/22', name: 'KUNAL CHAUHAN', mobile: '+919978145629', gender: 'Male', status: 'Active', executive: 'Abdulla Pathan', vaccination: 'NO' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Membership Management</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-none">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl flex items-center gap-5 transition-none cursor-pointer border ${stat.active ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : (isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-sm hover:shadow-md')}`}>
            <div className={`p-4 rounded-xl ${stat.active ? 'bg-white/20' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-[#fcfcfc] text-gray-400')}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[28px] font-black leading-none">{stat.value}</p>
              <p className={`text-[13px] font-black mt-1 uppercase tracking-tight ${stat.active ? 'text-white/80' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 transition-none pt-4">
        <CustomDropdown
          placeholder="Gender"
          options={['Male', 'FeMale']}
          value={selectedGender}
          onChange={setSelectedGender}
          isDarkMode={isDarkMode}
          minWidth="130px"
        />

        <button className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600">Apply</button>
        <button
          onClick={() => { setSelectedGender(''); setSearchQuery(''); }}
          className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600"
        >
          Clear
        </button>

        <div className="relative flex-1 max-w-sm">
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-2.5 border rounded-xl text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-3 px-8 py-3.5 border rounded-xl text-[14px] font-bold transition-none active:scale-95 border-gray-200 shadow-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] text-gray-700'}`}
        >
          <Download size={20} className="text-gray-400" />
          Generate XLS Report
        </button>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-xl overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-6 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5">
          <span className="text-[14px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Memberships</span>
          <div className="flex gap-4">
            <button className={`flex items-center gap-3 px-8 py-2.5 rounded-full text-[13px] font-black transition-none shadow-sm border ${isDarkMode ? 'bg-white/5 text-white border-white/10' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}>
              <MessageSquare size={16} className="fill-current text-gray-400" />
              Send SMS (4998)
              <Send size={16} className="text-gray-400" />
            </button>
            <button className={`flex items-center gap-3 px-8 py-2.5 rounded-full text-[13px] font-black transition-none shadow-sm border ${isDarkMode ? 'bg-white/5 text-white border-white/10' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}>
              <Bell size={16} className="text-gray-400" />
              Send Notification
              <Send size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
        <div className="overflow-x-visible">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-[#fcfcfc] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-6 w-10"><input type="checkbox" className="w-5 h-5 rounded accent-[#f97316] cursor-pointer" /></th>
                <th className="px-6 py-6 uppercase tracking-wider">Client ID</th>
                <th className="px-6 py-6 uppercase tracking-wider">Name & Mob. No.</th>
                <th className="px-6 py-6 uppercase tracking-wider text-center">Gender</th>
                <th className="px-6 py-6 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-6 uppercase tracking-wider">Customer Service Executive</th>
                <th className="px-6 py-6 uppercase tracking-wider text-center">Vaccination(Coivid-19)</th>
                <th className="px-6 py-6 border-l dark:border-white/5 w-[80px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {membersData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8"><input type="checkbox" className="w-5 h-5 rounded accent-[#f97316] cursor-pointer" /></td>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col transition-none">
                      <span className="text-[#3b82f6] text-[15px] font-black hover:underline cursor-pointer uppercase">{row.name}</span>
                      <span className="text-[#3b82f6] text-[13px] mt-0.5 font-bold">{row.mobile}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-center">{row.gender}</td>
                  <td className="px-6 py-8 text-center">
                    <div className="px-5 py-2 rounded-lg text-[13px] font-black border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] inline-block uppercase tracking-wider">
                      {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-8">{row.executive}</td>
                  <td className="px-6 py-8 text-center">{row.vaccination}</td>
                  <td className="px-6 py-8 text-center relative border-l dark:border-white/5" ref={el => actionRef.current[idx] = el}>
                    <button
                      onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all active:scale-90"
                    >
                      <MoreVertical size={22} />
                    </button>

                    {activeActionRow === idx && (
                      <div className={`absolute right-12 top-12 w-[220px] rounded-xl shadow-2xl border z-50 overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 font-bold'}`}>
                        <div className="py-2">
                          {[
                            'View Profile',
                            'Vaccination',
                            'Schedule Followup'
                          ].map((action, i) => (
                            <div
                              key={i}
                              onClick={() => setActiveActionRow(null)}
                              className={`px-5 py-4 text-[15px] font-black border-b last:border-0 cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'
                                }`}
                            >
                              {action}
                            </div>
                          ))}
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
        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-[#f9f9f9]/30'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50`}>« Previous</button>
            <button className="w-11 h-11 border rounded-xl text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">1</button>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button key={num} className={`w-11 h-11 border rounded-xl text-[13px] font-bold transition-none border-gray-300 text-gray-600 hover:bg-gray-50`}>
                {num}
              </button>
            ))}
            <span className="px-2 text-gray-400 font-black">...</span>
            {[215, 216].map(num => (
              <button key={num} className={`w-11 h-11 border rounded-xl text-[13px] font-bold transition-none border-gray-300 text-gray-600 hover:bg-gray-50`}>
                {num}
              </button>
            ))}
            <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50`}>Next »</button>
          </div>

          <div className="flex items-center gap-5 transition-none">
            <span className="text-[15px] font-black text-gray-500 uppercase tracking-tight">Rows per page</span>
            <RowsPerPageDropdown
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Members;
