import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Bell,
  MoreVertical,
  User,
  UserPlus,
  UserMinus,
  Users,
  Cake,
  PartyPopper,
  Activity,
  Send
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Members = () => {
  const { isDarkMode } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);

  const stats = [
    { label: 'All Members', value: '963', icon: User, color: 'bg-blue-600', active: true },
    { label: 'Active Members', value: '413', icon: Activity, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Upcoming Members', value: '4', icon: UserPlus, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Past Members', value: '546', icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Today Attendance', value: '0', icon: Users, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Today Absents', value: '413', icon: UserMinus, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Birthday', value: '0', icon: Cake, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Anniversary', value: '0', icon: PartyPopper, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
  ];

  const membersData = [
    { id: '1232', name: 'NIRAJ GUPTA', mobile: '7778877207', gender: 'Male', status: 'Active Member', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '1231', name: 'CHANDAN SINGH', mobile: '9998596909', gender: 'Male', status: 'Active Member', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '1225', name: 'NAYAN SIKLIGHAR', mobile: '7069487076', gender: 'Male', status: 'Active Member', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '1223', name: 'KAMLESH RATHOD', mobile: '9106968155', gender: 'Male', status: 'Upcoming Member', executive: 'Abdulla Pathan', vaccination: 'NO' },
    { id: '1222', name: 'RISHI PARIHAL', mobile: '9023761850', gender: 'Male', status: 'Active Member', executive: 'Abdulla Pathan', vaccination: 'NO' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Members Management</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-none">
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 transition-none pt-4">
        <div className="relative min-w-[150px]">
          <select className={`appearance-none w-full pl-4 pr-10 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-600 shadow-sm'}`}>
            <option>Gender</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
        </div>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>

        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-11 pr-4 py-2 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
          />
        </div>

        <div className="flex-1" />

        <button className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[14px] font-bold border transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 shadow-sm text-gray-700'}`}>
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-4 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Members</span>
          <div className="flex gap-4">
            <button className={`flex items-center gap-3 px-6 py-2 rounded-full text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <MessageSquare size={16} className="fill-current" />
              Send SMS (4998)
              <Send size={16} />
            </button>
            <button className={`flex items-center gap-3 px-6 py-2 rounded-full text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <Bell size={16} />
              Send Notification
              <Send size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5 w-10"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></th>
                <th className="px-6 py-5">Client ID</th>
                <th className="px-6 py-5">Name & Mob. No.</th>
                <th className="px-6 py-5">Gender</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Customer Service Executive</th>
                <th className="px-6 py-5">Vaccination(Coivid-19)</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {membersData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-7"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></td>
                  <td className="px-6 py-7">{row.id}</td>
                  <td className="px-6 py-7">
                    <div className="flex flex-col transition-none">
                      <span className="text-[#3b82f6] uppercase">{row.name}</span>
                      <span className="text-[#3b82f6] text-[12px] mt-0.5">{row.mobile}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">{row.gender}</td>
                  <td className="px-6 py-7">
                    <div className={`px-4 py-2.5 rounded-lg text-[12px] font-bold border inline-block ${row.status === 'Active Member'
                        ? 'bg-[#fff7ed] border-[#f97316]/30 text-[#f97316]'
                        : 'bg-[#fff7ed] border-[#f97316]/30 text-[#f97316]'
                      }`}>
                      {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-7">{row.executive}</td>
                  <td className="px-6 py-7">{row.vaccination}</td>
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
        <div className={`px-6 py-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${num === 1 ? 'bg-[#f97316] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
            <span className="px-1 text-gray-400">...</span>
            {[192, 193].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>
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

export default Members;
