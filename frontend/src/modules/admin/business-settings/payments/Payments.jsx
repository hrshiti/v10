import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Payments = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Revenue', value: '₹ 6198261', icon: Wallet, color: 'bg-[#3b82f6]', textColor: 'text-white' },
    { label: 'Total Pending Payment', value: '0', icon: Wallet, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]', textColor: isDarkMode ? 'text-white' : 'text-gray-800' },
    { label: 'Total Renewal Payments', value: '0', icon: Wallet, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]', textColor: isDarkMode ? 'text-white' : 'text-gray-800' },
    { label: 'Total Due Paid Payments', value: '0', icon: Wallet, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]', textColor: isDarkMode ? 'text-white' : 'text-gray-800' },
  ];

  const payments = [
    { id: '1232', date: '29 Jan, 2026', name: 'NIRAJ GUPTA', number: '7778877207', planTotal: '₹9000', total: '₹5500.00', discount: '₹3500.00', paid: '₹5500.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '' },
    { id: '1231', date: '29 Jan, 2026', name: 'CHANDAN SINGH', number: '9998596909', planTotal: '₹9000', total: '₹5500.00', discount: '₹3500.00', paid: '₹5500.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '' },
    { id: '1230', date: '28 Jan, 2026', name: 'DEV LODHA', number: '7698523069', planTotal: '₹9000', total: '₹6000.00', discount: '₹3000.00', paid: '₹6000.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '' },
    { id: '5/1229', date: '29 Jan, 2026', name: 'KHETRAM KUMAWAT', number: '6376566316', planTotal: '₹9000', total: '₹5000.00', discount: '₹4000.00', paid: '₹5000.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '' },
    { id: '99/22', date: '28 Jan, 2026', name: 'KUNAL CHAUHAN', number: '9978145629', planTotal: '₹9000', total: '₹6000.00', discount: '₹3000.00', paid: '₹2000.00', balance: '4000', status: 'BALANCE UNPAID', type: 'General Training', dueDate: '31 Jan, 2026' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <h1 className="text-[28px] font-black tracking-tight">Payments</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-none">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl flex items-center gap-6 transition-none border-none shadow-sm ${stat.color} ${stat.textColor}`}>
            <div className={`p-3 rounded-xl ${stat.label === 'Total Revenue' ? 'bg-white/20' : (isDarkMode ? 'bg-white/5' : 'bg-white shadow-inner')}`}>
              <stat.icon size={28} className={stat.label === 'Total Revenue' ? 'text-white' : 'text-gray-400'} />
            </div>
            <div>
              <p className="text-[24px] font-black leading-none uppercase">{stat.value}</p>
              <p className="text-[12px] font-bold mt-1 opacity-80 uppercase leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 pt-4 transition-none">
        <div className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
          <Calendar size={18} className="text-gray-400" />
          <span className="text-[14px] font-bold text-gray-400">Select Due Date</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>

        <div className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
          <Calendar size={18} className="text-gray-400" />
          <span className="text-[14px] font-bold text-gray-400">Select Invoice Date</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>

        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
        <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>

        <div className="relative flex-1 max-w-sm ml-auto">
          <Search size={20} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-2.5 border rounded-xl text-[16px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Payments List Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b bg-white dark:bg-white/5">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Payments List</span>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Client Id</th>
                <th className="px-6 py-5">Invoice Date</th>
                <th className="px-6 py-5">Name & Mob. No.</th>
                <th className="px-6 py-5">Plan Total</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Discount</th>
                <th className="px-6 py-5">Paid</th>
                <th className="px-6 py-5">Balance</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Plan Type</th>
                <th className="px-6 py-5">Due Date</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {payments.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8">{row.date}</td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col">
                      <span className="uppercase">{row.name}</span>
                      <span className="text-[12px]">{row.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">{row.planTotal}</td>
                  <td className="px-6 py-8">{row.total}</td>
                  <td className="px-6 py-8">{row.discount}</td>
                  <td className="px-6 py-8">{row.paid}</td>
                  <td className={`px-6 py-8 ${row.balance !== '0' ? 'text-red-500' : ''}`}>{row.balance}</td>
                  <td className="px-6 py-8">
                    {row.status === 'PAID' ? (
                      <span className="px-4 py-2 rounded-lg border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] text-[11px] font-black leading-none">PAID</span>
                    ) : (
                      <span className="px-4 py-2 rounded-lg bg-[#ef4444] text-white text-[11px] font-black leading-none">BALANCE UNPAID</span>
                    )}
                  </td>
                  <td className="px-6 py-8">
                    <span className="px-4 py-2 rounded-lg border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] text-[11px] font-black leading-none">{row.type}</span>
                  </td>
                  <td className="px-6 py-8">{row.dueDate}</td>
                  <td className="px-6 py-8 text-right">
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
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${num === 1 ? 'bg-[#f4a261] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
            <span className="px-2">...</span>
            <button className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>233</button>
            <button className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>234</button>
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

export default Payments;
