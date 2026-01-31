import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  MessageSquare,
  Send,
  MoreVertical,
  Calendar,
  Phone,
  Users,
  UserMinus,
  PhoneOff,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Enquiries = () => {
  const { isDarkMode } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);

  const stats = [
    { label: 'Open Enquiry', value: '743', icon: Users, color: 'bg-blue-600', active: true },
    { label: 'Close Enquiry', value: '477', icon: UserMinus, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Not Interested', value: '5', icon: UserMinus, color: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50' },
    { label: 'Call Done', value: '1', icon: CheckCircle2, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Call Not Connected', value: '0', icon: PhoneOff, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
  ];

  const enquiryData = [
    { id: '806642', date: '12 Jan, 2026', name: 'DHRUV SHIRESHIYA', mobile: '+918487833955', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806636', date: '12 Jan, 2026', name: 'MAGDUM SHAIKH', mobile: '+918200686685', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806632', date: '12 Jan, 2026', name: 'JAYESH BHAI', mobile: '+919022927826', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806630', date: '12 Jan, 2026', name: 'ATHARV BHAI', mobile: '+919875181649', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
    { id: '806629', date: '12 Jan, 2026', name: 'PAVAN BHAI', mobile: '+919079894819', trial: 'No', handle: 'Abdulla Pathan', type: 'Cold', created: 'Abdulla Pathan' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Enquiry</h1>
        <button className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none">
          <Plus size={20} />
          Add Enquiry
        </button>
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

      {/* Second Stats Row */}
      <div className="flex gap-4 transition-none">
        <div className={`p-5 rounded-lg flex items-center gap-4 w-full max-w-[215px] transition-none cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border border-white/5' : 'bg-gray-100/50 border border-gray-100'}`}>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-400'}`}>
            <BarChart2 size={28} />
          </div>
          <p className="text-[15px] font-bold text-gray-700 dark:text-gray-300">Enquiry Ratio</p>
        </div>
      </div>

      {/* Filters Row 1 */}
      <div className="flex flex-wrap gap-3 transition-none">
        {['Handle by', 'Lead Type', 'Trial Booked', 'Select gender', 'Follow up'].map((label, idx) => (
          <div key={idx} className="relative min-w-[130px]">
            <select className={`appearance-none w-full pl-4 pr-10 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-600'}`}>
              <option>{label}</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Filters Row 2 */}
      <div className="flex flex-wrap items-center gap-3 transition-none">
        <div className={`flex items-center gap-3 px-4 py-2 border rounded-lg min-w-[220px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-300'}`}>
          <Calendar size={18} className="text-gray-400" />
          <span className="text-[14px] font-bold text-gray-400">dd/mm/yyyy</span>
          <ChevronDown size={16} className="text-gray-400 ml-auto" />
        </div>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>
      </div>

      {/* Search & Export */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 transition-none pt-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg text-[15px] font-bold outline-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-black placeholder:text-gray-400'}`}
          />
        </div>
        <button className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[14px] font-bold border transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 shadow-sm'}`}>
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3 transition-none pt-2">
        <div className="relative min-w-[160px]">
          <select className={`appearance-none w-full pl-4 pr-10 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-600'}`}>
            <option>Assign Trainer</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative min-w-[150px]">
          <select className={`appearance-none w-full pl-4 pr-10 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-600'}`}>
            <option>Select Option</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>
        <button className="bg-gray-400 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95">Submit</button>
      </div>

      {/* Table Header Overlay */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="p-4 border-b flex justify-between items-center transition-none">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Enquiry</span>
          <button className={`flex items-center gap-3 px-6 py-2 rounded-full text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>
            <MessageSquare size={16} className="fill-current" />
            Send SMS (4998)
            <Send size={16} />
          </button>
        </div>
        <div className="overflow-x-auto min-h-[450px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-4"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></th>
                <th className="px-6 py-4">Enquiry No.</th>
                <th className="px-6 py-4">Enquiry Date</th>
                <th className="px-6 py-4">Name & Mob. No.</th>
                <th className="px-6 py-4">Trial Booked</th>
                <th className="px-6 py-4">Handle by</th>
                <th className="px-6 py-4">Lead Type</th>
                <th className="px-6 py-4">Remark/Summary</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {enquiryData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-5"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></td>
                  <td className="px-6 py-5">{row.id}</td>
                  <td className="px-6 py-5">{row.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="uppercase">{row.name}</span>
                      <span className="text-gray-500">{row.mobile}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-[#ef4444] text-white px-3 py-1 rounded text-[11px] font-black uppercase">No</span>
                  </td>
                  <td className="px-6 py-5">{row.handle}</td>
                  <td className="px-6 py-5">
                    <span className="bg-[#0ea5e9] text-white px-3 py-1 rounded text-[11px] font-black uppercase">Cold</span>
                  </td>
                  <td className="px-6 py-5"></td>
                  <td className="px-6 py-5">{row.created}</td>
                  <td className="px-6 py-5">
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
            <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>« Previous</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button key={num} className={`w-10 h-10 rounded-lg text-[13px] font-bold transition-none ${num === 1 ? 'bg-[#f97316] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
            <span className="px-2 text-gray-400">...</span>
            {[148, 149].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[13px] font-bold shadow-sm transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>
                {num}
              </button>
            ))}
            <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-3 transition-none">
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

export default Enquiries;
