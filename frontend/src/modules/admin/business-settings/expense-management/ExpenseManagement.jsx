import React, { useState } from 'react';
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  Download
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const ExpenseManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>

      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Expense Management</h1>
        <button className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none">
          <Plus size={20} />
          Add Expenses
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none">
        <div className={`p-6 rounded-xl flex items-center gap-6 transition-none min-w-[300px] shadow-sm bg-[#3b82f6] text-white`}>
          <div className="p-4 rounded-xl bg-white/20">
            <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-[24px] font-black">$</span>
            </div>
          </div>
          <div>
            <p className="text-[32px] font-black leading-none">₹ 0</p>
            <p className="text-[14px] font-bold mt-1 opacity-80">Total Expenses</p>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 pt-4 transition-none">
        <div className="relative min-w-[140px]">
          <select className={`appearance-none w-full pl-4 pr-10 py-3 border rounded-xl text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-500 shadow-sm'}`}>
            <option>Staff Name</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
        </div>

        <div className={`flex items-center gap-3 px-4 py-3 border rounded-xl min-w-[260px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
          <Calendar size={18} className="text-gray-400" />
          <span className="text-[14px] font-bold text-gray-400">dd/mm/yyyy</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>

        <button className="bg-[#f97316] text-white px-8 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
        <button className="bg-[#f97316] text-white px-8 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>

        <div className="relative flex-1 max-w-sm">
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[16px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ml-auto">
          <button className={`flex items-center gap-2 px-6 py-3 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f1f5f9] border-gray-100 shadow-sm text-gray-700'}`}>
            <Download size={20} className="text-gray-400" />
            Generate XLS Report
          </button>
        </div>
      </div>

      <p className="text-[13px] font-bold text-gray-500 pt-2 transition-none">Total Expenses (₹0)</p>

      {/* Table Section */}
      <div className={`border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b bg-white dark:bg-white/5">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Expenses</span>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">#</th>
                <th className="px-6 py-5">Expense Type</th>
                <th className="px-6 py-5">Description</th>
                <th className="px-6 py-5">Expense Date</th>
                <th className="px-6 py-5">Staff Name</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="transition-none">
              {/* Empty state matches the screenshot */}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f97316] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
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

export default ExpenseManagement;
