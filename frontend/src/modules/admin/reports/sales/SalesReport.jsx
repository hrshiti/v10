import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const SalesReport = () => {
  const { isDarkMode } = useOutletContext();
  const tableContainerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const statsRow1 = [
    { label: 'Invoice Generated', value: '65', icon: Wallet },
    { label: 'Total Amount', value: '327600.00', icon: Wallet },
    { label: 'Paid Amount', value: '324600.00', icon: Wallet },
    { label: 'Paid Balance Amount', value: '3000.00', icon: Wallet },
    { label: 'Tax Amount', value: '0.00', icon: Wallet },
  ];

  const statsRow2 = [
    { label: 'Online', value: '297100.00', icon: Wallet },
    { label: 'Wallet', value: '0.00', icon: Wallet },
    { label: 'Cash', value: '30500.00', icon: Wallet, active: true },
    { label: 'Cheque', value: '0.00', icon: Wallet },
    { label: 'Other', value: '0.00', icon: Wallet },
  ];

  const salesData = [
    { id: '1232', name: 'NIRAJ GUPTA', number: '7778877207', type: 'General Training', plan: 'GYM WORKOUT', start: '29-01-2026', duration: '12 Months', invoice: 'V10FL/2025-26/558', paid: '₹5500.00', sgst: '₹0.00', cgst: '₹0.00', mode: 'Google Pay', amount: '₹5500.00', discount: '₹3500.00', balance: '₹0.00', closedBy: 'Abdulla Pathan', handleBy: 'Abdulla Pathan', closeDate: '29-01-2026', payDate: '29-01-2026', trainer: 'Abdulla Pathan', saleType: 'Fresh Payment' },
    { id: '5/1229', name: 'KHETRAM KUMAWAT', number: '6376566316', type: 'General Training', plan: 'GYM WORKOUT', start: '28-01-2026', duration: '12 Months', invoice: 'V10FL/2025-26/555', paid: '₹5000.00', sgst: '₹0.00', cgst: '₹0.00', mode: 'Google Pay', amount: '₹5000.00', discount: '₹4000.00', balance: '₹0.00', closedBy: 'Abdulla Pathan', handleBy: 'Abdulla Pathan', closeDate: '28-01-2026', payDate: '28-01-2026', trainer: 'Abdulla Pathan', saleType: 'Renew Payment' },
    { id: '1230', name: 'DEV LODHA', number: '7698523069', type: 'General Training', plan: 'GYM WORKOUT', start: '28-01-2026', duration: '12 Months', invoice: 'V10FL/2025-26/556', paid: '₹6000.00', sgst: '₹0.00', cgst: '₹0.00', mode: 'Google Pay', amount: '₹6000.00', discount: '₹3000.00', balance: '₹0.00', closedBy: 'Abdulla Pathan', handleBy: 'Abdulla Pathan', closeDate: '28-01-2026', payDate: '28-01-2026', trainer: 'Abdulla Pathan', saleType: 'Resale Payment' },
    { id: '1231', name: 'CHANDAN SINGH', number: '9998596909', type: 'General Training', plan: 'GYM WORKOUT', start: '28-01-2026', duration: '12 Months', invoice: 'V10FL/2025-26/557', paid: '₹5500.00', sgst: '₹0.00', cgst: '₹0.00', mode: 'Google Pay', amount: '₹5500.00', discount: '₹3500.00', balance: '₹0.00', closedBy: 'Abdulla Pathan', handleBy: 'Abdulla Pathan', closeDate: '28-01-2026', payDate: '28-01-2026', trainer: 'Abdulla Pathan', saleType: 'Fresh Payment' },
    { id: '1225', name: 'NAYAN SIKLIGHAR', number: '7069487076', type: 'General Training', plan: 'GYM WORKOUT', start: '28-01-2026', duration: '1 Months', invoice: 'V10FL/2025-26/551', paid: '₹2000.00', sgst: '₹0.00', cgst: '₹0.00', mode: 'Cash', amount: '₹2000.00', discount: '₹500.00', balance: '₹0.00', closedBy: 'Abdulla Pathan', handleBy: 'Abdulla Pathan', closeDate: '27-01-2026', payDate: '27-01-2026', trainer: 'Abdulla Pathan', saleType: 'Fresh Payment' },
  ];

  const scrollTable = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollStats = (direction) => {
    if (statsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      statsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Sales Report</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => scrollStats('left')} className="p-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-none">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scrollStats('right')} className="p-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-none">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards Slider */}
      <div ref={statsContainerRef} className="overflow-x-auto scroll-smooth transition-none">
        <div className="flex flex-col gap-4 min-w-max transition-none pb-2">
          <div className="flex gap-4 transition-none">
            {statsRow1.map((stat, idx) => (
              <div key={idx} className={`p-4 rounded-lg flex items-center gap-4 transition-none border w-[280px] shrink-0 ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-100/30 border-gray-100/50'}`}>
                <div className={`p-3 rounded-lg bg-white shadow-sm dark:bg-white/5`}><stat.icon size={24} className="text-gray-400" /></div>
                <div>
                  <p className="text-[18px] font-black leading-none uppercase">{stat.value}</p>
                  <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 transition-none">
            {statsRow2.map((stat, idx) => (
              <div key={idx} className={`p-4 rounded-lg flex items-center gap-4 transition-none border w-[280px] shrink-0 ${stat.active ? 'bg-[#e76f51] text-white' : (isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-100/30 border-gray-100/50')}`}>
                <div className={`p-3 rounded-lg bg-white shadow-sm dark:bg-white/5`}><stat.icon size={24} className={stat.active ? 'text-[#e76f51]' : 'text-gray-400'} /></div>
                <div>
                  <p className="text-[18px] font-black leading-none uppercase">{stat.value}</p>
                  <p className={`text-[11px] font-bold mt-1 uppercase leading-tight ${stat.active ? 'text-white/80' : 'text-gray-500'}`}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Matrix */}
      <div className="space-y-4 transition-none pt-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className={`flex items-center gap-3 px-4 py-2 border rounded-lg min-w-[180px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
            <Calendar size={18} className="text-gray-400" />
            <span className="text-[14px] font-bold text-gray-400">01-01-2026</span>
            <ChevronDown size={14} className="text-gray-400 ml-auto" />
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 border rounded-lg min-w-[180px] transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
            <Calendar size={18} className="text-gray-400" />
            <span className="text-[14px] font-bold text-gray-400">30-01-2026</span>
            <ChevronDown size={14} className="text-gray-400 ml-auto" />
          </div>
          <div className="relative min-w-[180px]">
            <select className={`appearance-none w-full pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
              <option>Select Tax Type</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {['Select Membership Type', 'Select Sale Type', 'Select Trainer', 'Select Closed By', 'Select Handled By', 'Payment Mode'].map((label, idx) => (
            <div key={idx} className="relative min-w-[160px]">
              <select className={`appearance-none w-full pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                <option>{label}</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          ))}
          <button className="bg-[#f97316] text-white px-8 py-2 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
          <button className="bg-[#f97316] text-white px-8 py-2 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Clear</button>
        </div>
      </div>

      {/* Search Row */}
      <div className="flex justify-between items-center transition-none pt-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-11 pr-4 py-2 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 shadow-sm text-gray-700'}`}>
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Table Section with Slider Behavior */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b flex justify-between items-center bg-white dark:bg-white/5">
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Sales Report</span>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => scrollTable('left')} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollTable('right')} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div ref={tableContainerRef} className="overflow-x-auto scroll-smooth">
          <table className="min-w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Client Id</th>
                <th className="px-6 py-5">Name & Number</th>
                <th className="px-6 py-5">Membership Type</th>
                <th className="px-6 py-5">Plan Name</th>
                <th className="px-6 py-5">Package Start Date</th>
                <th className="px-6 py-5">Duration</th>
                <th className="px-6 py-5">Invoice Number</th>
                <th className="px-6 py-5">Paid Amount</th>
                <th className="px-6 py-5">SGST</th>
                <th className="px-6 py-5">CGST</th>
                <th className="px-6 py-5">Payment Mode</th>
                <th className="px-6 py-5">Invoice Amount</th>
                <th className="px-6 py-5">Discount</th>
                <th className="px-6 py-5">Balance Amount</th>
                <th className="px-6 py-5">Closed By</th>
                <th className="px-6 py-5">Handle By</th>
                <th className="px-6 py-5">Close Date/Invoice Date</th>
                <th className="px-6 py-5">Payment Date</th>
                <th className="px-6 py-5">Assign Trainer</th>
                <th className="px-6 py-5">Sale Types</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {salesData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col">
                      <span className="text-[#3b82f6] uppercase">{row.name}</span>
                      <span className="text-[#3b82f6] text-[12px]">{row.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="px-3 py-2 rounded-lg border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] uppercase text-[12px]">
                      {row.type}
                    </div>
                  </td>
                  <td className="px-6 py-8 uppercase">
                    <div className="px-3 py-2 rounded-lg border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] uppercase text-[12px]">
                      {row.plan}
                    </div>
                  </td>
                  <td className="px-6 py-8">{row.start}</td>
                  <td className="px-6 py-8">{row.duration}</td>
                  <td className="px-6 py-8 text-[#3b82f6] transition-none">{row.invoice}</td>
                  <td className="px-6 py-8 font-black">{row.paid}</td>
                  <td className="px-6 py-8">{row.sgst}</td>
                  <td className="px-6 py-8">{row.cgst}</td>
                  <td className="px-6 py-8">{row.mode}</td>
                  <td className="px-6 py-8 font-black">{row.amount}</td>
                  <td className="px-6 py-8">{row.discount}</td>
                  <td className="px-6 py-8">{row.balance}</td>
                  <td className="px-6 py-8 whitespace-nowrap">{row.closedBy}</td>
                  <td className="px-6 py-8 whitespace-nowrap">{row.handleBy}</td>
                  <td className="px-6 py-8">{row.closeDate}</td>
                  <td className="px-6 py-8">{row.payDate}</td>
                  <td className="px-6 py-8 whitespace-nowrap">{row.trainer}</td>
                  <td className="px-6 py-8 whitespace-nowrap">{row.saleType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${num === 1 ? 'bg-[#f4a261] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
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

export default SalesReport;
