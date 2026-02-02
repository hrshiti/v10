import React, { useState } from 'react';
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

const BalanceDueReport = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('01-01-2026');
  const [toDate, setToDate] = useState('30-01-2026');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const stats = [
    { label: 'Members', value: '3', icon: User, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100/50' },
    { label: 'Balance Due', value: '₹ 15000.00', icon: User, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100/50' },
  ];

  const reportData = Array.from({ length: 10 }, (_, i) => ({
    idx: i + 1,
    id: `CL${442 + i}`,
    name: 'RAJESH SHARMA',
    number: '9825098250',
    invoice: `INV-2026-00${i + 1}`,
    due: '₹ 5000.00',
    dueDate: '2026-02-15',
    closedBy: 'Abdulla Pathan',
    closedDate: '2026-01-31'
  }));

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Balance Due Report</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-lg flex items-center gap-4 transition-none min-w-[240px] border ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-[#f8f9fa] border-gray-100'}`}>
            <div className={`p-3 rounded-lg bg-white dark:bg-white/5`}>
              <stat.icon size={28} className="text-gray-300" />
            </div>
            <div>
              <p className="text-[24px] font-black leading-none">{stat.value}</p>
              <p className={`text-[13px] font-bold mt-1 text-gray-500`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 transition-none pt-4">
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

        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>
      </div>

      {/* Search Row */}
      <div className="flex justify-between items-center transition-none pt-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-11 pr-4 py-2 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 shadow-sm text-gray-700'}`}
        >
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b bg-white dark:bg-white/5 transition-none text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">
          Balance Due Report
        </div>
        <div className="overflow-x-auto transition-none">
          <table className="w-full text-left whitespace-nowrap transition-none">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Sr No</th>
                <th className="px-6 py-5">Client Name & Number</th>
                <th className="px-6 py-5">Invoice Number</th>
                <th className="px-6 py-5">Balance Due</th>
                <th className="px-6 py-5">Due Date</th>
                <th className="px-6 py-5">Closed By</th>
                <th className="px-6 py-5">Closed Date</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {reportData.slice(0, rowsPerPage).map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-7">{row.idx}</td>
                  <td className="px-6 py-7">
                    <div className="flex flex-col">
                      <span className="text-[#3b82f6] uppercase">{row.name}</span>
                      <span className="text-[12px] text-gray-500">{row.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">{row.invoice}</td>
                  <td className="px-6 py-7 text-red-500">{row.due}</td>
                  <td className="px-6 py-7">{row.dueDate}</td>
                  <td className="px-6 py-7">{row.closedBy}</td>
                  <td className="px-6 py-7">{row.closedDate}</td>
                  <td className="px-6 py-7"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2 transition-none">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f4a261] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative transition-none">
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

export default BalanceDueReport;
