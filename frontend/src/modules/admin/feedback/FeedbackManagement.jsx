import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const FeedbackManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const feedbackData = [
    { id: '788', userName: 'Mili Harry', userMessage: 'please help me to make my everyday weight training program chart for Monday to Saturday', replyMessage: '', date: '21 Nov, 2025 01:19 PM' },
    { id: '701', userName: 'Tejpalsinh parmar', userMessage: 'how to contact ahemdabad ctm branch', replyMessage: '', date: '14 Aug, 2025 05:06 AM' },
    { id: '665', userName: 'Tejpalsinh parmar', userMessage: 'how to check diet plan', replyMessage: '', date: '08 Jul, 2025 06:40 PM' },
    { id: '664', userName: 'Tejpalsinh parmar', userMessage: 'diet plan', replyMessage: '', date: '08 Jul, 2025 06:35 PM' },
    { id: '646', userName: 'dhaval solanki', userMessage: 'how to check date plan', replyMessage: '', date: '17 Jun, 2025 07:25 PM' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Feedback Management</h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-md transition-none">
        <div className="relative">
          <Search size={22} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[16px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-6 py-5 border-b bg-white dark:bg-white/5 transition-none">
          <span className="text-[14px] font-black text-gray-800 dark:text-gray-200">Follow Ups</span>
        </div>
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Feed ID</th>
                <th className="px-6 py-5">User Name</th>
                <th className="px-6 py-5">User Message</th>
                <th className="px-6 py-5">Reply Message</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 w-24"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {feedbackData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8">{row.userName}</td>
                  <td className="px-6 py-8 leading-relaxed max-w-sm">{row.userMessage}</td>
                  <td className="px-6 py-8">{row.replyMessage}</td>
                  <td className="px-6 py-8 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-8 text-right">
                    <button className="bg-[#f97316] text-white px-6 py-2 rounded-lg text-[13px] font-bold shadow-md active:scale-95 transition-none">
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f4a261] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm'}`}>Next »</button>
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

export default FeedbackManagement;
