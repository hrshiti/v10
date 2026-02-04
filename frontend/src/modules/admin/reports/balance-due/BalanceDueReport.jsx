import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  User
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import SingleDatePicker from '../../components/SingleDatePicker';
import GenerateReportModal from '../../components/GenerateReportModal';
import { API_BASE_URL } from '../../../../config/api';

const BalanceDueReport = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('01-01-2026');
  const [toDate, setToDate] = useState('30-01-2026');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [dueMembers, setDueMembers] = useState([]);
  const [stats, setStats] = useState({ memberCount: 0, totalDue: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalanceDueData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const queryParams = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        search: searchQuery,
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/reports/balance-due?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      setDueMembers(data.members || []);
      setStats(data.stats || { memberCount: 0, totalDue: 0 });
      setTotalPages(data.pages || 1);

    } catch (error) {
      console.error("Error fetching balance due report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceDueData();
  }, [currentPage, rowsPerPage]);

  const handleApply = () => {
    setCurrentPage(1);
    fetchBalanceDueData();
  };

  const handleClear = () => {
    setSearchQuery('');
    setFromDate('01-01-2026');
    setToDate('30-01-2026');
    setCurrentPage(1);
    setTimeout(fetchBalanceDueData, 100);
  };

  const statCards = [
    { label: 'Members', value: stats.memberCount.toString(), icon: User, theme: 'blue' },
    { label: 'Balance Due', value: `₹ ${stats.totalDue.toFixed(2)}`, icon: User, theme: 'red' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
    red: { bg: 'bg-red-500', shadow: 'shadow-red-500/20' },
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Balance Due Report</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none">
        {statCards.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          return (
            <div
              key={idx}
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
          <button onClick={handleApply} className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-black shadow-md transition-none active:scale-95">Apply</button>
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
          <span className="text-[14px] font-black text-gray-800 dark:text-gray-200 tracking-tight uppercase">Balance Due Report</span>
        </div>
        <div className="overflow-x-auto min-h-[100px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Member ID</th>
                <th className="px-6 py-5">Name & Mobile</th>
                <th className="px-6 py-5">Package</th>
                <th className="px-6 py-5">Total Amount</th>
                <th className="px-6 py-5">Paid Amount</th>
                <th className="px-6 py-5">Due Amount</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr>
              ) : dueMembers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10">No members with balance due found</td></tr>
              ) : (
                dueMembers.map((member, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-8">{member.memberId}</td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-[#3b82f6] uppercase font-black">{member.firstName} {member.lastName}</span>
                        <span className="text-[#3b82f6] text-[12px] font-bold mt-0.5">{member.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">{member.packageName}</td>
                    <td className="px-6 py-8 font-black">₹{member.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-8 font-black">₹{member.paidAmount?.toFixed(2)}</td>
                    <td className="px-6 py-8 font-black text-red-600">₹{member.dueAmount?.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default BalanceDueReport;
