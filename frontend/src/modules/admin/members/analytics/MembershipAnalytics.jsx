import React, { useState } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  User
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const MembershipAnalytics = () => {
  const { isDarkMode } = useOutletContext();
  const [selectedCategory, setSelectedCategory] = useState('General Training');

  const stats = [
    { label: 'General Training', value: 'General Training', icon: User, active: true },
    { label: 'Personal Training', value: 'Personal Training', icon: User },
    { label: 'Group Ex', value: 'Group Ex', icon: User },
    { label: 'Complete Fitness', value: 'Complete Fitness', icon: User },
  ];

  const reportData = [
    { name: 'GYM WORKOUT', duration: '12 Month', invoiceAmount: '320500.00', sessions: '360', paidAmount: '315000.00', sold: '78' },
    { name: 'GYM WORKOUT', duration: '1 Month', invoiceAmount: '6400.00', sessions: '30', paidAmount: '6400.00', sold: '6' },
    { name: 'GYM WORKOUT', duration: '3 Month', invoiceAmount: '3200.00', sessions: '90', paidAmount: '3200.00', sold: '3' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Membership Analytics</h1>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 transition-none">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedCategory(stat.label)}
            className={`p-5 rounded-lg flex items-center gap-4 transition-none cursor-pointer border ${stat.label === selectedCategory ? 'bg-blue-600 text-white shadow-lg border-blue-600' : (isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-[#f8f9fa] border-gray-100')}`}
          >
            <div className={`p-3 rounded-lg ${stat.label === selectedCategory ? 'bg-white/20' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-400')}`}>
              <stat.icon size={28} />
            </div>
            <span className={`text-[15px] font-bold ${stat.label === selectedCategory ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 transition-none pt-4">
        <div className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
          <Calendar size={18} className="text-gray-400" />
          <span className="text-[14px] font-bold">01-01-2026</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>

        <div className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
          <Calendar size={18} className="text-gray-400" />
          <span className="text-[14px] font-bold">30-01-2026</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>

        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>

        <div className="flex-1" />

        <button className={`flex items-center gap-2 px-6 py-2.5 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 shadow-sm text-gray-700'}`}>
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Report Header Info */}
      <div className="pt-6 space-y-1 transition-none">
        <p className="text-[14px] font-black text-gray-700 dark:text-gray-300">Current Report: GYM WORKOUT</p>
        <p className="text-[14px] font-black text-gray-700 dark:text-gray-300">Previous Report: N/A</p>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-[#f8f9fa] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-6">Package Name</th>
                <th className="px-6 py-6">Duration</th>
                <th className="px-6 py-6">Invoice Amount</th>
                <th className="px-6 py-6">Sessions</th>
                <th className="px-6 py-6">Paid Amount</th>
                <th className="px-6 py-6">Membership Sold</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {reportData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-7 uppercase">{row.name}</td>
                  <td className="px-6 py-7">{row.duration}</td>
                  <td className="px-6 py-7">{row.invoiceAmount}</td>
                  <td className="px-6 py-7">{row.sessions}</td>
                  <td className="px-6 py-7">{row.paidAmount}</td>
                  <td className="px-6 py-7">{row.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f4a261] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative">
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

export default MembershipAnalytics;
