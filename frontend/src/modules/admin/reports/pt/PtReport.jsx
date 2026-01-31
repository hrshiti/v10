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

const PtReport = () => {
  const { isDarkMode } = useOutletContext();
  const tableContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total PT Members', value: '12', icon: User },
    { label: 'Active PT Sessions', value: '156', icon: User },
  ];

  const ptData = [
    { id: '442', name: 'RAJESH SHARMA', number: '9825098250', trainer: 'Abdulla Pathan', total: '24', used: '10', balance: '14', end: '15-02-2026' },
    { id: '445', name: 'MEHUL PATEL', number: '9904499044', trainer: 'Abdulla Pathan', total: '12', used: '12', balance: '0', end: '30-01-2026' },
  ];

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
      <div className="space-y-4 pt-4 transition-none">
        <div className="flex flex-wrap items-center gap-4">
          <div className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
            <Calendar size={18} className="text-gray-400" />
            <span className="text-[14px] font-bold text-gray-400">01-01-2026</span>
            <ChevronDown size={14} className="text-gray-400 ml-auto" />
          </div>

          <div className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
            <Calendar size={18} className="text-gray-400" />
            <span className="text-[14px] font-bold text-gray-400">31-01-2026</span>
            <ChevronDown size={14} className="text-gray-400 ml-auto" />
          </div>

          <div className="relative min-w-[200px]">
            <select className={`appearance-none w-full pl-4 pr-10 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-500 shadow-sm'}`}>
              <option>Select Trainer</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>

          <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
          <button className="bg-[#f4a261] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>
        </div>

        <div className="flex justify-between items-center pt-2 transition-none">
          <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className={`w-full pl-11 pr-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 shadow-sm text-gray-700'}`}>
            <Download size={18} />
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
                <th className="px-6 py-5">Client Id</th>
                <th className="px-6 py-5">Name & Number</th>
                <th className="px-6 py-5">Trainer Name</th>
                <th className="px-6 py-5 text-center">Total Sessions</th>
                <th className="px-6 py-5 text-center">Used Sessions</th>
                <th className="px-6 py-5 text-center">Balance Sessions</th>
                <th className="px-6 py-5">End Date</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {ptData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8 text-[#3b82f6] uppercase transition-none">
                    <div className="flex flex-col transition-none">
                      <span>{row.name}</span>
                      <span className="text-[12px]">{row.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">{row.trainer}</td>
                  <td className="px-6 py-8 text-center font-black">{row.total}</td>
                  <td className="px-6 py-8 text-center font-black">{row.used}</td>
                  <td className="px-6 py-8 text-center font-black">{row.balance}</td>
                  <td className="px-6 py-8">{row.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2 transition-none">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f4a261] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative transition-none">
              <select className={`appearance-none pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black shadow-sm'}`}>
                <option>5</option>
                <option>10</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PtReport;
