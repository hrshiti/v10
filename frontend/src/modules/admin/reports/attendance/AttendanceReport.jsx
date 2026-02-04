import React, { useState } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SingleDatePicker from '../../components/SingleDatePicker';
import GenerateReportModal from '../../components/GenerateReportModal';

const AttendanceReport = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [view, setView] = useState('attendance'); // 'attendance' or 'absent'
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('03-02-2026');
  const [toDate, setToDate] = useState('03-02-2026');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState('Membership Type');
  const [isMembershipDropdownOpen, setIsMembershipDropdownOpen] = useState(false);

  const [attendanceData, setAttendanceData] = useState([
    {
      id: '523425',
      name: 'Evenjleena CHRISTIAN',
      number: '8980209491',
      plan: 'GYM WORKOUT',
      type: 'General Training',
      attended: '88',
      total: '360',
      endDate: '27-04-2026',
      trainer: 'Abdulla Pathan',
      lastMarked: '03-02-2026 09:00 AM'
    }
  ]);

  const [absentData, setAbsentData] = useState([
    { id: '1226', name: 'PATEL DHRUV', mobile: '7179010403' },
    { id: '1227', name: 'SANDEEP PATEL', mobile: '7043484769' },
    { id: '1228', name: 'MODI PRATHAM', mobile: '6352560220' },
    { id: '1229', name: 'HEMIL MODI', mobile: '9512585046' },
    { id: '1233', name: 'DRUV RAVAL', mobile: '9428053837' },
  ]);

  const filteredAttendance = attendanceData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.number.includes(searchQuery) ||
    item.id.includes(searchQuery)
  );

  const filteredAbsent = absentData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mobile.includes(searchQuery) ||
    item.id.includes(searchQuery)
  );

  const stats = view === 'attendance' ? [
    { label: 'Total Attendance', value: filteredAttendance.length.toString(), icon: UserCheck, theme: 'blue' },
    { label: 'Absent', value: 'Absent', icon: UserCheck, theme: 'red' },
  ] : [
    { label: 'Total Absent', value: '413', icon: UserCheck, theme: 'blue' },
    { label: 'Days Absent', value: '', icon: UserCheck, theme: 'red' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
    red: { bg: 'bg-red-500', shadow: 'shadow-red-500/20' },
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">{view === 'attendance' ? 'Attendance Report' : 'Absent Report'}</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none">
        {stats.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          return (
            <div
              key={idx}
              onClick={() => {
                if (stat.label.includes('Absent')) {
                  setView('absent');
                  setSearchQuery('');
                } else if (stat.label.includes('Attendance')) {
                  setView('attendance');
                  setSearchQuery('');
                }
              }}
              className={`group p-5 rounded-lg flex items-center gap-4 transition-all duration-300 min-w-[220px] border cursor-pointer
                ${isDarkMode
                  ? `bg-[#1a1a1a] border-white/5 text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                  : `bg-[#fcfcfc] border-gray-100 text-gray-700 hover:text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                }`}
            >
              <div className={`p-4 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[24px] font-black leading-none transition-colors duration-300 group-hover:text-white">{stat.value}</p>
                <p className="text-[13px] font-bold mt-1 text-gray-500 transition-colors duration-300 group-hover:text-white/80">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Row */}
      <div className="space-y-6 pt-4 transition-none">
        <div className="flex flex-wrap items-center gap-4">
          <SingleDatePicker
            value={fromDate}
            onSelect={setFromDate}
            isDarkMode={isDarkMode}
          />
          <SingleDatePicker
            value={toDate}
            onSelect={setToDate}
            isDarkMode={isDarkMode}
          />

          {view === 'attendance' && (
            <div className="relative min-w-[220px]">
              <div
                onClick={() => setIsMembershipDropdownOpen(!isMembershipDropdownOpen)}
                className={`flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-all ${isDarkMode
                  ? 'bg-[#1a1a1a] border-white/10 text-white'
                  : isMembershipDropdownOpen ? 'border-[#f97316] text-[#f97316] bg-white' : 'bg-white border-gray-200 text-[#f97316] shadow-sm'}`}
              >
                <span className="text-[14px] font-bold">{selectedMembership}</span>
                <ChevronDown size={14} className={isMembershipDropdownOpen ? 'text-[#f97316]' : 'text-gray-400'} />
              </div>

              {isMembershipDropdownOpen && (
                <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                  {['General Training', 'Personal Training'].map(type => (
                    <div
                      key={type}
                      onClick={() => { setSelectedMembership(type); setIsMembershipDropdownOpen(false); }}
                      className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                        ? 'text-gray-300 hover:bg-white/5'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]'}`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Apply</button>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Weekly</button>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Monthly</button>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Clear</button>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 transition-none">
          <div className="relative flex-1 max-w-[400px]">
            <Search size={20} className="absolute left-4 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className={`w-full pl-12 pr-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-8 py-2.5 border rounded-lg text-[14px] font-black transition-none active:scale-95 shadow-md ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-700'}`}
          >
            <Download size={18} className="text-gray-500" />
            Generate XLS Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-5 border-b flex justify-between items-center bg-white dark:bg-white/5 transition-none">
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-black text-gray-800 dark:text-gray-200 tracking-tight uppercase">{view === 'attendance' ? 'Attendance Report' : 'Absent Report'}</span>
            <div className="flex items-center gap-3">
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronLeft size={20} />
              </button>
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[100px]">
          <table className="w-full text-left whitespace-nowrap">
            {view === 'attendance' ? (
              <>
                <thead>
                  <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                    <th className="px-6 py-5">Name & Number</th>
                    <th className="px-6 py-5">Membership Plan</th>
                    <th className="px-6 py-5">Membership Type</th>
                    <th className="px-6 py-5 text-center">Attended Sessions</th>
                    <th className="px-6 py-5 text-center">Total Sessions</th>
                    <th className="px-6 py-5">End Date</th>
                    <th className="px-6 py-5">Assigned Trainer</th>
                    <th className="px-6 py-5">Last Marked Attendance</th>
                  </tr>
                </thead>
                <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {filteredAttendance.slice(0, rowsPerPage).map((row, idx) => (
                    <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                      <td className="px-6 py-8">
                        <div
                          className="flex flex-col cursor-pointer"
                          onClick={() => navigate(`/admin/members/profile/memberships?id=${row.id}`)}
                        >
                          <span className="text-[#3b82f6] uppercase font-black hover:underline">{row.name}</span>
                          <span className="text-[#3b82f6] text-[12px] font-bold mt-0.5 hover:underline">{row.number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-8">{row.plan}</td>
                      <td className="px-6 py-8">{row.type}</td>
                      <td className="px-6 py-8 text-center font-black">{row.attended}</td>
                      <td className="px-6 py-8 text-center font-black">{row.total}</td>
                      <td className="px-6 py-8">{row.endDate}</td>
                      <td className="px-6 py-8">{row.trainer}</td>
                      <td className="px-6 py-8">{row.lastMarked}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                    <th className="px-6 py-5">Name</th>
                    <th className="px-6 py-5">Mobile Number</th>
                  </tr>
                </thead>
                <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {filteredAbsent.slice(0, rowsPerPage).map((row, idx) => (
                    <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                      <td
                        onClick={() => navigate(`/admin/members/profile/memberships?id=${row.id}`)}
                        className="px-6 py-8 text-[#3b82f6] uppercase font-black cursor-pointer hover:underline"
                      >
                        {row.name}
                      </td>
                      <td className="px-6 py-8 font-black">{row.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 shadow-sm text-gray-600'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">1</button>
            {view === 'absent' && [2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <button key={n} className={`w-10 h-10 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 text-gray-600'}`}>{n}</button>
            ))}
            {view === 'absent' && <span className="px-2 text-gray-400">...</span>}
            {view === 'absent' && [82, 83].map(n => (
              <button key={n} className={`w-10 h-10 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 text-gray-600'}`}>{n}</button>
            ))}
            <button className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 shadow-sm text-gray-600'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-black text-gray-500 uppercase tracking-tight">Rows per page</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                className={`appearance-none pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-black shadow-sm'}`}>
                {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
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

export default AttendanceReport;
