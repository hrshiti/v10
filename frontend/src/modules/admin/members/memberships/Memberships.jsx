import React, { useState } from 'react';
import {
  Search,
  Download,
  MoreVertical,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserMinus
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Memberships = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const stats = [
    { label: 'General Training', value: '1080', icon: User, color: 'bg-blue-600', active: true },
    { label: 'Personal Training', value: '1', icon: User, color: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-600/80', active: false, specialColor: true },
    { label: 'Complete Fitness', value: '0', icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-100/50' },
    { label: 'Group Ex', value: '0', icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-100/50' },
    { label: 'Delete Memberships', value: '15', icon: UserMinus, color: isDarkMode ? 'bg-white/5' : 'bg-gray-100/50' },
  ];

  const membershipsData = [
    { id: '1232', name: 'NIRAJ GUPTA', mobile: '+917778877207', duration: '12 Month', sessions: 360, startDate: '29 Jan, 2026', endDate: '28 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
    { id: '1231', name: 'CHANDAN SINGH', mobile: '+91919998596909', duration: '12 Month', sessions: 360, startDate: '28 Jan, 2026', endDate: '27 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
    { id: '1230', name: 'DEV LODHA', mobile: '+917698523069', duration: '12 Month', sessions: 360, startDate: '28 Jan, 2026', endDate: '27 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
    { id: '5/1229', name: 'KHETRAM KUMAWAT', mobile: '+916376566316', duration: '12 Month', sessions: 360, startDate: '28 Jan, 2026', endDate: '27 Jan, 2027', trainer: 'Abdulla Pathan', addOn: 0, status: 'Active' },
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
          <div key={idx} className={`p-5 rounded-lg flex items-center gap-4 transition-none cursor-pointer ${stat.active ? 'bg-blue-600 text-white shadow-lg' : stat.specialColor ? `${stat.color} text-white shadow-lg` : (isDarkMode ? 'bg-[#1a1a1a] border border-white/5' : 'bg-gray-100/50 border border-gray-100')}`}>
            <div className={`p-3 rounded-lg ${stat.active || stat.specialColor ? 'bg-white/20' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-400')}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[24px] font-black leading-none">{stat.value}</p>
              <p className={`text-[13px] font-bold mt-1 ${stat.active || stat.specialColor ? 'text-white/80' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Row */}
      <div className="flex justify-between items-center gap-4 transition-none pt-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-11 pr-4 py-2 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[14px] font-bold border transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 shadow-sm text-gray-700'}`}>
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="p-4 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Memberships</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Client ID</th>
                <th className="px-6 py-5">Full Name</th>
                <th className="px-6 py-5 whitespace-nowrap">Mobile Number</th>
                <th className="px-6 py-5">Duration</th>
                <th className="px-6 py-5">Sessions</th>
                <th className="px-6 py-5 whitespace-nowrap">Start Date</th>
                <th className="px-6 py-5 whitespace-nowrap">End Date</th>
                <th className="px-6 py-5">Assigned Trainer</th>
                <th className="px-6 py-5">Add on Days</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {membershipsData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-7">{row.id}</td>
                  <td className="px-6 py-7 uppercase">{row.name}</td>
                  <td className="px-6 py-7">{row.mobile}</td>
                  <td className="px-6 py-7">{row.duration}</td>
                  <td className="px-6 py-7">{row.sessions}</td>
                  <td className="px-6 py-7">{row.startDate}</td>
                  <td className="px-6 py-7">{row.endDate}</td>
                  <td className="px-6 py-7">{row.trainer}</td>
                  <td className="px-6 py-7">{row.addOn}</td>
                  <td className="px-6 py-7">
                    <div className="px-3 py-2 rounded-lg text-[12px] font-bold border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] inline-block">
                      {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-7 text-right">
                    <button className="text-gray-400 hover:text-black dark:hover:text-white transition-none">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            {[1, 2].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${num === 1 ? 'bg-[#f97316] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
            <button className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
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

export default Memberships;
