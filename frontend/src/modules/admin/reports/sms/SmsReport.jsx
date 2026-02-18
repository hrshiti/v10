import React, { useState } from 'react';
import {
  ChevronDown,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Download
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import SingleDatePicker from '../../components/SingleDatePicker';
import GenerateReportModal from '../../components/GenerateReportModal';
import Pagination from '../../../../components/Pagination';

const SmsReport = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('31-01-2026');
  const [toDate, setToDate] = useState('31-01-2026');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [smsData, setSmsData] = useState(Array.from({ length: 5 }, (_, i) => ({
    srNo: i + 1,
    mobile: `9876543${i}21`,
    message: 'Welcome to V10 Fitness Lab!',
    status: 'Delivered',
    send: '2026-01-31 10:00',
    delivered: '2026-01-31 10:01'
  })));

  const stats = [
    { label: 'Total SMS', value: smsData.length.toString(), icon: MessageSquare, theme: 'blue' },
    { label: 'Remaining SMS', value: '4998', icon: MessageSquare, theme: 'emerald' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
    emerald: { bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/20' },
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">SMS Report</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none">
        {stats.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          return (
            <div
              key={idx}
              className={`group p-5 rounded-lg flex items-center gap-4 transition-all duration-300 min-w-[220px] border cursor-pointer
                ${isDarkMode
                  ? `bg-[#1a1a1a] border-white/5 text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                  : `bg-[#f8f9fa] border-gray-100 text-gray-700 hover:text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                }`}
            >
              <div className={`p-3 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white' : 'bg-white text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>
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
      <div className="flex flex-wrap items-center gap-4 pt-4 transition-none">
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

        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600">Apply</button>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600">Clear</button>
      </div>

      {/* Search Row */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 transition-none pt-4">
        <div className="relative flex-1 max-w-md">
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
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-black border transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 shadow-sm text-gray-700'}`}
        >
          <Download size={18} className="text-gray-400" />
          Generate XLS Report
        </button>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b flex justify-between items-center bg-white dark:bg-white/5">
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">SMS Report</span>
            <div className="flex items-center gap-2 ml-4">
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
          <table className="min-w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Sr No</th>
                <th className="px-6 py-5">Mobile Number</th>
                <th className="px-6 py-5">Message</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Send</th>
                <th className="px-6 py-5">Delivered</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {smsData.slice(0, rowsPerPage).map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.srNo}</td>
                  <td className="px-6 py-8">{row.mobile}</td>
                  <td className="px-6 py-8">{row.message}</td>
                  <td className="px-6 py-8">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-bold">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-8">{row.send}</td>
                  <td className="px-6 py-8">{row.delivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={() => { }}
            isDarkMode={isDarkMode}
            size="small"
          />

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                className={`appearance-none pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black shadow-sm'}`}
              >
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

export default SmsReport;
