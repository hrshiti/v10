import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const MembershipPackages = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [packages, setPackages] = useState([
    { id: 13590, name: 'Complementary', duration: '12 Months', sessions: 360, price: '0.00', status: true },
    { id: 13576, name: 'Anniversary Package But 1 and get 1 Free', duration: '12 Months', sessions: 360, price: '9000.00', status: false },
    { id: 13575, name: 'GYM WORKOUT', duration: '45 Days', sessions: 45, price: '4000.00', status: false },
    { id: 13574, name: 'GYM WORKOUT', duration: '15 Months', sessions: 450, price: '12000.00', status: false },
    { id: 13573, name: 'GYM WORKOUT', duration: '13 Months', sessions: 390, price: '10500.00', status: false },
  ]);

  const stats = [
    { label: 'General Training', value: 9, icon: User, color: 'bg-blue-600', active: true },
    { label: 'Personal Training', value: 9, icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Complete Fitness', value: 0, icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Group Ex', value: 0, icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
  ];

  const toggleStatus = (id) => {
    setPackages(packages.map(pkg =>
      pkg.id === id ? { ...pkg, status: !pkg.status } : pkg
    ));
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Memberships Package</h1>
        <button className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none">
          <Plus size={20} />
          Add Package
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-none">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-lg flex items-center gap-4 transition-none cursor-pointer ${stat.active ? 'bg-blue-600 text-white shadow-lg' : (isDarkMode ? 'bg-[#1a1a1a] border border-white/5' : 'bg-gray-100/50 border border-gray-100')}`}>
            <div className={`p-3 rounded-lg ${stat.active ? 'bg-white/20' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-400')}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[24px] font-black leading-none">{stat.value}</p>
              <p className={`text-[13px] font-bold mt-1 ${stat.active ? 'text-white/80' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-sm transition-none pt-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-11 pr-4 py-2 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-4 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Memberships Package</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Package Name</th>
                <th className="px-6 py-5">Duration</th>
                <th className="px-6 py-5">Sessions</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5 text-center">Active / Inactive</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {packages.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-7">{row.id}</td>
                  <td className="px-6 py-7">
                    <div className="border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] px-4 py-2.5 rounded-lg text-[13px] font-bold inline-block leading-snug max-w-[200px]">
                      {row.name}
                    </div>
                  </td>
                  <td className="px-6 py-7">{row.duration}</td>
                  <td className="px-6 py-7">{row.sessions}</td>
                  <td className="px-6 py-7">₹{row.price}</td>
                  <td className="px-6 py-7">
                    <div className="flex justify-center">
                      <div
                        onClick={() => toggleStatus(row.id)}
                        className={`relative w-16 h-8 rounded-lg cursor-pointer transition-none p-1 flex items-center ${row.status ? 'bg-[#059669]' : 'bg-gray-400'}`}
                      >
                        <div className={`w-6 h-6 rounded bg-white shadow-sm transform transition-none ${row.status ? 'translate-x-8' : 'translate-x-0'}`} />
                        <span className={`absolute ${row.status ? 'left-2' : 'right-2'} text-[10px] font-black text-white pointer-events-none uppercase`}>
                          {row.status ? 'On' : 'Off'}
                        </span>
                      </div>
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

export default MembershipPackages;
