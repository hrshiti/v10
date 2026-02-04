import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import SingleDatePicker from '../../components/SingleDatePicker';
import GenerateReportModal from '../../components/GenerateReportModal';

const PtReport = () => {
  const { isDarkMode } = useOutletContext();
  const tableContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('01-01-2026');
  const [toDate, setToDate] = useState('31-01-2026');
  const [selectedTrainer, setSelectedTrainer] = useState('Select Trainer');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isTrainerDropdownOpen, setIsTrainerDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const trainerRef = useRef(null);

  const [ptData, setPtData] = useState([]);

  const filteredData = ptData.filter(item =>
    item.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customerNumber.includes(searchQuery)
  );

  const stats = [
    { label: 'Total PT', value: filteredData.length.toString(), icon: User, theme: 'blue' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
  };

  const scrollTable = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">PT Report</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none">
        {stats.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          return (
            <div
              key={idx}
              className={`group p-5 rounded-lg flex items-center gap-4 transition-all duration-300 min-w-[240px] border cursor-pointer
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

          <div className="relative min-w-[200px]" ref={trainerRef}>
            <div
              onClick={() => setIsTrainerDropdownOpen(!isTrainerDropdownOpen)}
              className={`flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-all ${isDarkMode
                ? 'bg-[#1a1a1a] border-white/10 text-white'
                : isTrainerDropdownOpen ? 'border-[#f97316] text-[#f97316] bg-white' : 'bg-white border-gray-200 text-gray-500 shadow-sm'
                }`}
            >
              <span className="text-[14px] font-bold">{selectedTrainer}</span>
              <ChevronDown size={14} className={isTrainerDropdownOpen ? 'text-[#f97316]' : 'text-gray-400'} />
            </div>

            {isTrainerDropdownOpen && (
              <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                {['Abdulla Pathan', 'ANJALI KANWAR', 'V10 FITNESS LAB'].map(trainer => (
                  <div
                    key={trainer}
                    onClick={() => { setSelectedTrainer(trainer); setIsTrainerDropdownOpen(false); }}
                    className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                      ? 'text-gray-300 hover:bg-white/5'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]'
                      }`}
                  >
                    {trainer}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-black transition-none active:scale-95 shadow-md hover:bg-orange-600">Apply</button>
          <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-black transition-none active:scale-95 shadow-md hover:bg-orange-600">Clear</button>
        </div>

        <div className="flex justify-between items-center transition-none gap-4">
          <div className="relative w-full max-w-[400px]">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className={`w-full pl-11 pr-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-black placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-6 py-2.5 border rounded-lg text-[14px] font-black transition-none active:scale-95 whitespace-nowrap ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 shadow-md text-gray-700'}`}
          >
            <Download size={18} className="text-gray-500" />
            Generate XLS Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b flex justify-between items-center bg-white dark:bg-white/5 transition-none">
          <div className="flex items-center gap-4 transition-none">
            <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">PT Report</span>
            <div className="flex items-center gap-2 ml-4 transition-none">
              <button onClick={() => scrollTable('left')} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollTable('right')} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div ref={tableContainerRef} className="overflow-x-auto scroll-smooth transition-none">
          <table className="min-w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Trainer Name</th>
                <th className="px-6 py-5">Customer Name & Number</th>
                <th className="px-6 py-5">Package Start Date</th>
                <th className="px-6 py-5">Package End Date</th>
                <th className="px-6 py-5 text-center">Total Session</th>
                <th className="px-6 py-5 text-center">Attended Session</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {filteredData.slice(0, rowsPerPage).map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.trainerName}</td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col transition-none">
                      <span className="text-[#3b82f6] uppercase font-black">{row.customerName}</span>
                      <span className="text-[#3b82f6] text-[12px] font-bold mt-0.5">{row.customerNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">{row.startDate}</td>
                  <td className="px-6 py-8">{row.endDate}</td>
                  <td className="px-6 py-8 text-center font-black">{row.totalSession}</td>
                  <td className="px-6 py-8 text-center font-black">{row.attendedSession}</td>
                  <td className="px-6 py-8 font-black">{row.amount}</td>
                  <td className="px-6 py-8">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-black uppercase">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2 transition-none">
            <button className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">1</button>
            <button className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-black text-gray-500 uppercase tracking-tight">Rows per page</span>
            <div className="relative transition-none">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                className={`appearance-none pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-black shadow-sm'}`}
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

export default PtReport;
