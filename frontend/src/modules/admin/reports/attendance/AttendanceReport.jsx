import React, { useState, useEffect } from 'react';
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
import { API_BASE_URL } from '../../../../config/api';

const AttendanceReport = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [view, setView] = useState('audit'); // 'audit', 'attendance', or 'absent'
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayStr = `${dd}-${mm}-${yyyy}`;

  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedMembership, setSelectedMembership] = useState('Membership Type');
  const [isMembershipDropdownOpen, setIsMembershipDropdownOpen] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const queryParams = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        search: searchQuery,
        view: view,
        membershipType: selectedMembership,
        fromDate: fromDate?.split('-').reverse().join('-') || '',
        toDate: toDate?.split('-').reverse().join('-') || ''
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/reports/attendance?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      setReportData(data.members || []);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);

    } catch (error) {
      console.error("Error fetching attendance report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [view, currentPage, rowsPerPage, selectedMembership]);

  const handleApply = () => {
    setCurrentPage(1);
    fetchAttendanceData();
  };

  const handleClear = () => {
    setSearchQuery('');
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = `${dd}-${mm}-${yyyy}`;

    setFromDate(todayStr);
    setToDate(todayStr);
    setCurrentPage(1);
    setTimeout(fetchAttendanceData, 100);
  };

  const handleWeekly = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const formatDate = (date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };

    setFromDate(formatDate(lastWeek));
    setToDate(formatDate(today));
    setCurrentPage(1);
    setTimeout(fetchAttendanceData, 100);
  };

  const handleMonthly = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const formatDate = (date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };

    setFromDate(formatDate(lastMonth));
    setToDate(formatDate(today));
    setCurrentPage(1);
    setTimeout(fetchAttendanceData, 100);
  };

  const stats = view === 'audit' ? [
    { label: 'Total Check-ins', value: totalRecords.toString(), icon: UserCheck, theme: 'blue' },
    { label: 'Today', value: new Date().toLocaleDateString(), icon: Calendar, theme: 'emerald' },
  ] : view === 'attendance' ? [
    { label: 'Total Present Members', value: totalRecords.toString(), icon: UserCheck, theme: 'blue' },
    { label: 'Absent Members', value: 'Switch to view', icon: UserCheck, theme: 'red' },
  ] : [
    { label: 'Total Absent', value: totalRecords.toString(), icon: UserCheck, theme: 'blue' },
    { label: 'Days Absent', value: 'N/A', icon: UserCheck, theme: 'red' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
    red: { bg: 'bg-red-500', shadow: 'shadow-red-500/20' },
    emerald: { bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/20' },
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">
          {view === 'audit' ? 'Attendance Audit Log' : view === 'attendance' ? 'Attendance Summary' : 'Absent Report'}
        </h1>
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setView('audit')}
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${view === 'audit' ? 'bg-[#f97316] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'}`}
          >
            Audit Log
          </button>
          <button
            onClick={() => setView('attendance')}
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${view === 'attendance' ? 'bg-[#f97316] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'}`}
          >
            Summary
          </button>
          <button
            onClick={() => setView('absent')}
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${view === 'absent' ? 'bg-[#f97316] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'}`}
          >
            Absent List
          </button>
        </div>
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
                } else if (stat.label.includes('Present')) {
                  setView('attendance');
                  setSearchQuery('');
                } else if (stat.label.includes('Check-in')) {
                  setView('audit');
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
                {['Membership Type', 'General Training', 'Personal Training'].map(type => (
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

          <button onClick={handleApply} className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Apply</button>
          <button onClick={handleWeekly} className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Weekly</button>
          <button onClick={handleMonthly} className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Monthly</button>
          <button onClick={handleClear} className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Clear</button>
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

        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-5 border-b flex justify-between items-center bg-white dark:bg-white/5 transition-none">
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-black text-gray-800 dark:text-gray-200 tracking-tight uppercase">
              {view === 'audit' ? 'Attendance Audit Log' : view === 'attendance' ? 'Attendance Summary' : 'Absent Report'}
            </span>
            <div className="flex items-center gap-3">
              {totalPages > 1 && <span className="text-xs text-gray-400">Page {currentPage} of {totalPages}</span>}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[100px]">
          <table className="w-full text-left whitespace-nowrap">
            {view === 'audit' ? (
              <>
                <thead>
                  <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                    <th className="px-6 py-5 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-5 uppercase tracking-wider">Member Name</th>
                    <th className="px-6 py-5 uppercase tracking-wider">Mobile Number</th>
                    <th className="px-6 py-5 uppercase tracking-wider">Membership Plan</th>
                    <th className="px-6 py-5 uppercase tracking-wider">Check-in Method</th>
                    <th className="px-6 py-5 uppercase tracking-wider">Training Type</th>
                  </tr>
                </thead>
                <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {isLoading ? (
                    <tr><td colSpan="6" className="text-center py-10">Loading audit logs...</td></tr>
                  ) : reportData.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10">No logs found</td></tr>
                  ) : (
                    reportData.map((row, idx) => (
                      <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                        <td className="px-6 py-7">
                          <div className="flex flex-col">
                            <span className="text-sm font-black">
                              {row.checkIn ? new Date(row.checkIn).toLocaleDateString('en-GB') : 'N/A'}
                            </span>
                            <span className="text-xs text-gray-500 font-bold">
                              {row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-7 uppercase text-[#f97316] font-black">
                          {row.firstName || 'Unknown'} {row.lastName || ''}
                        </td>
                        <td className="px-6 py-7 font-black">{row.mobile || 'N/A'}</td>
                        <td className="px-6 py-7 uppercase">{row.packageName || 'N/A'}</td>
                        <td className="px-6 py-7">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black border ${row.method === 'QR' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-blue-500/30 bg-blue-500/10 text-blue-500'}`}>
                            {row.method || 'Manual'}
                          </span>
                        </td>
                        <td className="px-6 py-7">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black border ${row.trainingType === 'Personal' ? 'border-purple-500/30 bg-purple-500/10 text-purple-500' : 'border-gray-500/30 bg-gray-500/10 text-gray-500'}`}>
                            {row.trainingType || 'General'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </>
            ) : view === 'attendance' ? (
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
                  {isLoading ? (
                    <tr><td colSpan="8" className="text-center py-10">Loading...</td></tr>
                  ) : reportData.length === 0 ? (
                    <tr><td colSpan="8" className="text-center py-10">No attendance records found</td></tr>
                  ) : (
                    reportData.map((row, idx) => (
                      <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                        <td className="px-6 py-8">
                          <div
                            className="flex flex-col cursor-pointer"
                            onClick={() => navigate(`/admin/members/profile/${row._id}/edit`, { state: { member: row } })}
                          >
                            <span className="text-[#3b82f6] uppercase font-black hover:underline">{row.firstName} {row.lastName}</span>
                            <span className="text-[#3b82f6] text-[12px] font-bold mt-0.5 hover:underline">{row.mobile}</span>
                          </div>
                        </td>
                        <td className="px-6 py-8">{row.packageName || '-'}</td>
                        <td className="px-6 py-8">General Training</td>
                        <td className="px-6 py-8 text-center font-black">{row.attended}</td>
                        <td className="px-6 py-8 text-center font-black">-</td>
                        <td className="px-6 py-8">{row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-8">{row.trainerName || '-'}</td>
                        <td className="px-6 py-8">{row.lastMarked ? new Date(row.lastMarked).toLocaleString() : '-'}</td>
                      </tr>
                    )))}
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
                  {isLoading ? (
                    <tr><td colSpan="2" className="text-center py-10">Loading...</td></tr>
                  ) : reportData.length === 0 ? (
                    <tr><td colSpan="2" className="text-center py-10">No absent members found</td></tr>
                  ) : (
                    reportData.map((row, idx) => (
                      <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                        <td
                          onClick={() => navigate(`/admin/members/profile/${row._id}/edit`, { state: { member: row } })}
                          className="px-6 py-8 text-[#3b82f6] uppercase font-black cursor-pointer hover:underline"
                        >
                          {row.firstName} {row.lastName}
                        </td>
                        <td className="px-6 py-8 font-black">{row.mobile}</td>
                      </tr>
                    )))}
                </tbody>
              </>
            )}
          </table>
        </div>

        {/* Pagination Logic visual */}
        <div className={`p-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 shadow-sm text-gray-600'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">{currentPage}</button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 shadow-sm text-gray-600'}`}>Next »</button>
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


    </div>
  );
};

export default AttendanceReport;
