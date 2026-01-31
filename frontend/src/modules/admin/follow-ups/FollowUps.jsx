import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  Download,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const FollowUps = () => {
  const { isDarkMode } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);

  const followUpData = [
    {
      date: '30 Jan, 2026 11:50 PM',
      status: 'PENDING',
      statusMode: 'pending',
      type: 'Expired Membership',
      name: 'HIMANSHU PARMAR',
      number: '8320918256',
      allocate: 'Abdulla Pathan',
      scheduledBy: 'Abdulla Pathan',
      convertStatus: 'Hot',
      comment: 'Today membership will be expired for HIMANSHU PARMAR, 8320918256'
    },
    {
      date: '30 Jan, 2026 11:50 PM',
      status: 'PENDING',
      statusMode: 'pending',
      type: 'Membership Renewal',
      name: 'Riya patel',
      number: '9099031248',
      allocate: 'Abdulla Pathan',
      scheduledBy: 'Abdulla Pathan',
      convertStatus: 'Hot',
      comment: 'GYM WORKOUT, 12 months, renewal due on 14-02-2026.'
    },
    {
      date: '30 Jan, 2026 11:50 PM',
      status: 'PENDING',
      statusMode: 'pending',
      type: 'Membership Renewal',
      name: 'satish badgujar',
      number: '8488800551',
      allocate: 'Abdulla Pathan',
      scheduledBy: 'Abdulla Pathan',
      convertStatus: 'Hot',
      comment: 'GYM WORKOUT, 12 months, renewal due on 14-02-2026.'
    },
    {
      date: '30 Jan, 2026 11:50 PM',
      status: 'PENDING',
      statusMode: 'pending',
      type: 'Balance Due',
      name: 'KUNAL CHAUHAN',
      number: '9978145629',
      allocate: 'Abdulla Pathan',
      scheduledBy: 'Abdulla Pathan',
      convertStatus: 'Hot',
      comment: 'Follow up for balance payment of Rs. 4000 due on 31-01-2026 against invoice number V10FL/2025-26/554.'
    },
    {
      date: '29 Jan, 2026 11:50 PM',
      status: 'MISSED',
      statusMode: 'missed',
      type: 'Expired Membership',
      name: 'PANCHAL TIRTH',
      number: '9227441544',
      allocate: 'Abdulla Pathan',
      scheduledBy: 'Abdulla Pathan',
      convertStatus: 'Hot',
      comment: 'Today membership will be expired for PANCHAL TIRTH, 9227441544'
    }
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none ">
        <h1 className="text-[28px] font-bold tracking-tight">Follow Ups</h1>
      </div>

      {/* Filters Row - Exactly like Image 2 */}
      <div className="flex flex-wrap items-center gap-4 transition-none">
        {['Follow Type', 'Convertible Type', 'Status', 'Select Allocate', 'Allocate To Me'].map((label, idx) => (
          <div key={idx} className="relative min-w-[150px]">
            <select className={`appearance-none w-full pl-4 pr-10 py-2.5 border rounded-lg text-[14px] font-medium outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
              <option>{label}</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        ))}

        <div className={`flex items-center gap-3 px-4 py-2 border rounded-lg min-w-[210px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <Calendar size={18} className="text-gray-400 outline-none" />
          <span className="text-[14px] font-medium text-gray-400">dd/mm/yyyy</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>

        <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-sm">Apply</button>
        <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-sm">Clear</button>
      </div>

      {/* Search & Export Row */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 transition-none pt-2">
        <div className="relative flex-1 max-w-[280px]">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-11 pr-4 py-2 border rounded-lg text-[14px] font-medium outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
          />
        </div>
        <button className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      <p className="text-[14px] font-bold text-gray-400 pt-2 tracking-tight">Total Follow Ups (1230)</p>

      {/* Table Container - Exactly like Image 2 */}
      <div className={`border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className={`px-5 py-4 border-b border-gray-50 dark:border-white/5 bg-white`}>
          <span className="text-[14px] font-bold text-black-strict tracking-tight transition-none">Follow Ups</span>
        </div>
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[13px] font-bold text-gray-500 border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
                <th className="px-6 py-5 whitespace-nowrap">Follow Up Date & Time</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Follow Up Type</th>
                <th className="px-6 py-5">Name & Number</th>
                <th className="px-6 py-5">Allocate</th>
                <th className="px-6 py-5">Scheduled By</th>
                <th className="px-6 py-5">Convertibility Status</th>
                <th className="px-6 py-5">Comment</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
              {followUpData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-7 font-medium whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-7">
                    <span className={`${row.statusMode === 'pending' ? 'bg-[#f4a261]' : 'bg-[#e76f51]'} text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase text-center min-w-[80px] inline-block`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-7">
                    <div className={`inline-block border border-[#f97316]/40 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] px-4 py-2.5 rounded-lg text-[12px] font-bold`}>
                      {row.type}
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex flex-col transition-none">
                      <span className={`text-[13px] font-bold uppercase transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>{row.name}</span>
                      <span className="text-[12px] font-bold mt-0.5 tracking-tight transition-none">{row.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7 font-bold">{row.allocate}</td>
                  <td className="px-6 py-7 font-bold">{row.scheduledBy}</td>
                  <td className="px-6 py-7">
                    <div className="bg-[#ef4444] text-white px-3 py-1.5 rounded-lg text-[12px] font-black uppercase text-center inline-block min-w-[50px]">
                      {row.convertStatus}
                    </div>
                  </td>
                  <td className="px-6 py-7 text-[13px] font-medium leading-relaxed max-w-sm">{row.comment}</td>
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

        {/* Pagination - Matching Image 3 exactly */}
        <div className={`px-6 py-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>« Previous</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button key={num} className={`w-10 h-10 rounded-lg text-[12px] font-bold transition-none ${num === 1 ? 'bg-[#f4a261] text-white' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
            <span className="px-1 text-gray-400">...</span>
            {[245, 246].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[12px] font-bold shadow-sm transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>
                {num}
              </button>
            ))}
            <button className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative">
              <select className={`appearance-none pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black shadow-sm'}`}>
                <option>5</option>
                <option>10</option>
                <option>25</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUps;
