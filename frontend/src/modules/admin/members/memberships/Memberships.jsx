import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Download,
  MoreVertical,
  User,
  ChevronDown,
  UserMinus,
  Calendar,
  X
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// --- Reusable Components ---

const GenerateReportModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generate Report</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <label className={`block text-[14px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>OTP*</label>
          <input
            type="text"
            placeholder="OTP"
            className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>

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

const Memberships = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionRef = useRef({});

  // State for active stat card
  const [selectedStat, setSelectedStat] = useState('');

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
    { label: 'General Training', value: '1080', icon: User, active: 'bg-blue-600', hover: 'hover:bg-blue-600', ring: 'ring-blue-400' },
    { label: 'Personal Training', value: '1', icon: User, active: 'bg-emerald-600', hover: 'hover:bg-emerald-600', ring: 'ring-emerald-400' },
    { label: 'Complete Fitness', value: '0', icon: User, active: 'bg-purple-600', hover: 'hover:bg-purple-600', ring: 'ring-purple-400' },
    { label: 'Group Ex', value: '0', icon: User, active: 'bg-red-500', hover: 'hover:bg-red-500', ring: 'ring-red-400' },
    { label: 'Delete Memberships', value: '15', icon: UserMinus, active: 'bg-slate-600', hover: 'hover:bg-slate-600', ring: 'ring-slate-400' },
  ];

  const membershipsData = [
    { id: '1232', name: 'NIRAJ GUPTA', mobile: '+917778877207', duration: '12 Month', sessions: 360, startDate: '29 Jan, 2026', endDate: '28 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
    { id: '1231', name: 'CHANDAN SINGH', mobile: '+91919998596909', duration: '12 Month', sessions: 360, startDate: '28 Jan, 2026', endDate: '27 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
    { id: '1230', name: 'DEV LODHA', mobile: '+917698523069', duration: '12 Month', sessions: 360, startDate: '28 Jan, 2026', endDate: '27 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
    { id: '5/1229', name: 'KHETRAM KUMAWAT', mobile: '+916376566316', duration: '12 Month', sessions: 360, startDate: '28 Jan, 2026', endDate: '27 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <h1 className="text-[28px] font-black tracking-tight">Membership Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-none">
        {stats.map((stat, idx) => {
          const isActive = selectedStat === stat.label;
          return (
            <div
              key={idx}
              onClick={() => setSelectedStat(stat.label)}
              className={`group p-6 rounded-xl flex items-center gap-5 transition-all duration-300 cursor-pointer 
                ${isActive
                  ? `${stat.active} text-white shadow-xl ring-1 ${stat.ring}`
                  : (isDarkMode
                    ? 'bg-[#1a1a1a] border border-white/5 text-white hover:border-transparent hover:shadow-lg'
                    : 'bg-white border border-gray-100 shadow-sm text-black hover:border-transparent hover:shadow-lg'
                  )} ${!isActive ? stat.hover : ''}`}
            >
              <div className={`p-4 rounded-xl transition-all duration-300 
                ${isActive
                  ? 'bg-white/20 text-white'
                  : (isDarkMode
                    ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                    : 'bg-[#fcfcfc] text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                  )}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className={`text-[28px] font-black leading-none transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{stat.value}</p>
                <p className={`text-[13px] font-black mt-1 uppercase tracking-tight transition-colors duration-300 
                  ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-white/80'}`}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center gap-4 transition-none pt-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-3 px-8 py-3.5 border rounded-xl text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-100 shadow-sm text-gray-700'}`}
        >
          <Download size={20} className="text-gray-400" />
          Generate XLS Report
        </button>
      </div>

      <div className={`mt-8 border rounded-xl overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-6 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5">
          <span className="text-[14px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Memberships</span>
        </div>
        <div className="overflow-x-auto scroll-smooth custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-[#fcfcfc] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-6 uppercase">Client ID</th>
                <th className="px-6 py-6 uppercase">Full Name</th>
                <th className="px-6 py-6 uppercase">Mobile Number</th>
                <th className="px-6 py-6 uppercase">Duration</th>
                <th className="px-6 py-6 uppercase">Sessions</th>
                <th className="px-6 py-6 uppercase">Start Date</th>
                <th className="px-6 py-6 uppercase">End Date</th>
                <th className="px-6 py-6 uppercase">Assigned Trainer</th>
                <th className="px-6 py-6 uppercase">Add on Days</th>
                <th className="px-6 py-6 uppercase">Status</th>
                <th className="px-6 py-6 border-l dark:border-white/5 w-[80px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[14px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {membershipsData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8 uppercase">{row.name}</td>
                  <td className="px-6 py-8">{row.mobile}</td>
                  <td className="px-6 py-8">{row.duration}</td>
                  <td className="px-6 py-8 text-center">{row.sessions}</td>
                  <td className="px-6 py-8">{row.startDate}</td>
                  <td className="px-6 py-8">{row.endDate}</td>
                  <td className="px-6 py-8">{row.trainer}</td>
                  <td className="px-6 py-8 text-center">{row.addOn}</td>
                  <td className="px-6 py-8">
                    <div className="px-4 py-1.5 rounded-lg text-[13px] font-black border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] inline-block uppercase">
                      {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-8 text-center relative border-l dark:border-white/5" ref={el => actionRef.current[idx] = el}>
                    <button
                      onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all active:scale-90"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeActionRow === idx && (
                      <div className={`absolute right-12 top-10 w-[220px] rounded-xl shadow-2xl border z-50 overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                        <div className="py-2">
                          {[
                            'Add Client Id',
                            'Add-On Days',
                            'Change Start Date',
                            'View Invoice'
                          ].map((action, i) => (
                            <div
                              key={i}
                              onClick={() => setActiveActionRow(null)}
                              className={`px-5 py-4 text-[14px] font-black border-b last:border-0 cursor-pointer hover:pl-7 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'
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

        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            <button className="w-11 h-11 border rounded-xl text-[13px] font-bold bg-[#f97316] text-white shadow-lg transition-none">1</button>
            <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-5 transition-none">
            <span className="text-[15px] font-black text-gray-500 tracking-tight">Rows per page</span>
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

export default Memberships;
