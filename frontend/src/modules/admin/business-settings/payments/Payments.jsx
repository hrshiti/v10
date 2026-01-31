import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MoreVertical,
  Calendar,
  ChevronDown,
  Wallet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// --- Reusable Components (AdvancedDateRangePicker) ---

const AdvancedDateRangePicker = ({ isDarkMode, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Sidebar Active State
  const [activeSidebar, setActiveSidebar] = useState('Today');

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    // Matching the format commonly expected: "dd Mon, yyyy" or similar based on request context? 
    // Image 3 shows "January" "2026" as inputs. The display in input field isn't explicitly shown selected, but let's stick to a clean format.
    // Actually, let's stick to the previous format we used which was acceptable, or standard DD/MM/YYYY. 
    // User request "monthly, yearly sab work karna chaiye" -> means the picker navigation.
    return `${d}/${m}/${y}`;
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);

    // Single date logic vs Range logic? 
    // The image "Select Due Date" suggests a range picker because of sidebar "Last Week", "Last Month".
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      setActiveSidebar('');
    } else {
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
      setActiveSidebar('');
    }
  };

  const isDateSelected = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    if (!startDate) return false;
    if (endDate) {
      return date >= startDate && date <= endDate;
    }
    return date.getTime() === startDate.getTime();
  };

  const isStartOrEnd = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    if (!startDate) return false;
    if (endDate) {
      return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
    }
    return date.getTime() === startDate.getTime();
  }

  const setPredefinedRange = (type) => {
    setActiveSidebar(type);
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (type) {
      case 'Today': break;
      case 'Yesterday':
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'Last Week':
        start.setDate(today.getDate() - 7);
        break;
      case 'Last Months':
        start.setDate(today.getDate() - 30);
        break;
      case 'This Year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default: break;
    }
    setStartDate(start);
    setEndDate(end);
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const displayValue = startDate ? `${formatDate(startDate)}${endDate ? ' - ' + formatDate(endDate) : ''}` : placeholder;

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'
          } ${isOpen && !isDarkMode ? 'border-[#f97316]' : ''}`}
      >
        <Calendar size={18} className="text-gray-400" />
        <span className={`text-[14px] font-bold ${startDate ? (isDarkMode ? 'text-white' : 'text-gray-800') : 'text-gray-400'}`}>
          {displayValue}
        </span>
        <ChevronDown size={14} className="text-gray-400 ml-auto" />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 z-50 flex shadow-2xl rounded-lg border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`} style={{ width: '600px' }}>

          {/* Sidebar */}
          <div className={`w-[160px] border-r py-3 flex flex-col ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
            {['Today', 'Yesterday', 'Last Week', 'Last Months', 'This Year'].map(item => (
              <button
                key={item}
                onClick={() => setPredefinedRange(item)}
                className={`text-left px-5 py-4 text-[14px] font-medium transition-colors ${activeSidebar === item
                  ? (isDarkMode ? 'bg-white/10 text-white' : 'text-black') // Removed bg-gray-100 for active state in light mode based on Image 3 (just text bold/black usually, or maybe subtle bg)
                  : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:bg-gray-50')
                  } ${activeSidebar === item ? 'font-bold' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Calendar Area */}
          <div className="flex-1 p-6">
            {/* Header: Month Year inputs */}
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className={`w-full appearance-none border rounded px-4 py-2.5 text-center font-bold outline-none cursor-pointer ${isDarkMode ? 'bg-transparent border-white/20 text-white' : 'bg-white border-gray-300 text-gray-400'
                    }`}
                >
                  {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              </div>
              <div className="relative w-[100px]">
                <input
                  type="number"
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className={`w-full border rounded px-4 py-2.5 text-center font-bold outline-none ${isDarkMode ? 'bg-transparent border-white/20 text-white' : 'bg-white border-gray-300 text-gray-400'
                    }`}
                />
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 mb-4 px-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className={`text-center text-[13px] font-bold mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-800'}`}>
                  {day}
                </div>
              ))}
              {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10"></div>
              ))}
              {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleDateClick(i + 1)}
                  className={`h-9 w-9 mx-auto flex items-center justify-center text-[13px] rounded transition-all mb-1 ${isStartOrEnd(i + 1)
                    ? 'bg-[#f97316] text-white font-bold'
                    : isDateSelected(i + 1)
                      ? 'bg-orange-100 text-orange-600 font-bold'
                      : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100')
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsOpen(false)}
                className={`px-6 py-2 rounded-lg text-[14px] font-bold ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-8 py-2 rounded-lg text-[14px] font-bold bg-[#f97316] hover:bg-orange-600 text-white shadow-md active:scale-95"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Custom Select for Status in FollowUps (will reside here if needed, but keeping scoped) ---
// Actually, I'll modify FollowUps separately.

// --- Main Component ---

const Payments = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Rows Per Page State
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef(null);

  // Active Action Menu Row
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionContainerRefs = useRef({});

  // Close handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Rows Per Page Dropdown
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) {
        setIsRowsDropdownOpen(false);
      }
      // Action Menu
      if (activeActionRow !== null) {
        const currentRef = actionContainerRefs.current[activeActionRow];
        if (currentRef && !currentRef.contains(event.target)) {
          setActiveActionRow(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeActionRow]);

  const stats = [
    { label: 'Total Revenue', value: '₹ 6198261', icon: Wallet, color: 'bg-[#3b82f6]', textColor: 'text-white' },
    { label: 'Total Pending Payment', value: '0', icon: Wallet, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]', textColor: isDarkMode ? 'text-white' : 'text-gray-800' },
    { label: 'Total Renewal Payments', value: '0', icon: Wallet, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]', textColor: isDarkMode ? 'text-white' : 'text-gray-800' },
    { label: 'Total Due Paid Payments', value: '0', icon: Wallet, color: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]', textColor: isDarkMode ? 'text-white' : 'text-gray-800' },
  ];

  const payments = [
    { id: '1232', date: '29 Jan, 2026', name: 'NIRAJ GUPTA', number: '7778877207', planTotal: '₹9000', total: '₹5500.00', discount: '₹3500.00', paid: '₹5500.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '31 Jan, 2026' },
    { id: '1231', date: '29 Jan, 2026', name: 'CHANDAN SINGH', number: '9998596909', planTotal: '₹9000', total: '₹5500.00', discount: '₹3500.00', paid: '₹5500.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '31 Jan, 2026' },
    { id: '1230', date: '28 Jan, 2026', name: 'DEV LODHA', number: '7698523069', planTotal: '₹9000', total: '₹6000.00', discount: '₹3000.00', paid: '₹6000.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '31 Jan, 2026' },
    { id: '5/1229', date: '29 Jan, 2026', name: 'KHETRAM KUMAWAT', number: '6376566316', planTotal: '₹9000', total: '₹5000.00', discount: '₹4000.00', paid: '₹5000.00', balance: '0', status: 'PAID', type: 'General Training', dueDate: '31 Jan, 2026' },
    { id: '99/22', date: '28 Jan, 2026', name: 'KUNAL CHAUHAN', number: '9978145629', planTotal: '₹9000', total: '₹6000.00', discount: '₹3000.00', paid: '₹2000.00', balance: '4000', status: 'BALANCE UNPAID', type: 'General Training', dueDate: '31 Jan, 2026' },
  ];

  const handleAction = (action, row) => {
    console.log(action, row);
    setActiveActionRow(null);
  };

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
        <AdvancedDateRangePicker isDarkMode={isDarkMode} placeholder="Select Due Date" />
        <AdvancedDateRangePicker isDarkMode={isDarkMode} placeholder="Select Invoice Date" />

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
                <th className="px-6 py-5 text-center">Plan Total</th>
                <th className="px-6 py-5 text-center">Total</th>
                <th className="px-6 py-5 text-center">Discount</th>
                <th className="px-6 py-5 text-center">Paid</th>
                <th className="px-6 py-5 text-center">Balance</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-center">Plan Type</th>
                <th className="px-6 py-5 text-center">Due Date</th>
                <th className="px-6 py-5 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {payments.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8">{row.date}</td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col">
                      <span className="uppercase text-[#3b82f6] font-black">{row.name}</span>
                      <span className="text-[12px] text-gray-500">{row.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-center">{row.planTotal}</td>
                  <td className="px-6 py-8 text-center">{row.total}</td>
                  <td className="px-6 py-8 text-center">{row.discount}</td>
                  <td className="px-6 py-8 text-center">{row.paid}</td>
                  <td className={`px-6 py-8 text-center ${row.balance !== '0' ? 'text-red-500' : ''}`}>{row.balance}</td>
                  <td className="px-6 py-8 text-center">
                    {row.status === 'PAID' ? (
                      <span className="px-4 py-2 rounded-lg border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] text-[11px] font-black leading-none">PAID</span>
                    ) : (
                      <span className="px-4 py-2 rounded-lg bg-[#ef4444] text-white text-[11px] font-black leading-none">BALANCE UNPAID</span>
                    )}
                  </td>
                  <td className="px-6 py-8 text-center">
                    <span className="px-4 py-2 rounded-lg border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] text-[11px] font-black leading-none">{row.type}</span>
                  </td>
                  <td className="px-6 py-8 text-center">{row.dueDate || '-'}</td>
                  <td className="px-6 py-8 relative text-center" ref={el => actionContainerRefs.current[idx] = el}>
                    <button
                      onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                      className={`transition-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 ${activeActionRow === idx ? 'text-[#f97316] bg-orange-50' : 'text-gray-400'}`}
                    >
                      <MoreVertical size={24} />
                    </button>

                    {/* Action Menu - Smart Position (Last rows open UPWARDS) */}
                    {activeActionRow === idx && (
                      <div
                        className={`absolute right-full mr-2 ${idx >= payments.length - 2 ? 'bottom-0 mb-4' : 'top-0 mt-2'} w-[220px] rounded-xl shadow-[0_10px_60px_rgba(0,0,0,0.25)] border z-[100] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
                          }`}
                      >
                        <div className="flex flex-col">
                          {["View Invoice", "Change Invoice Date", "Change Payment Date", "Mail Invoice", "Edit Invoice", "Delete"].map((action, i) => (
                            <div
                              key={i}
                              onClick={() => handleAction(action, row)}
                              className={`px-5 py-3.5 text-[13px] font-black border-b last:border-0 cursor-pointer flex items-center gap-2 hover:bg-orange-50 hover:text-[#f97316] transition-all uppercase tracking-tighter ${isDarkMode
                                ? 'text-gray-300 border-white/5 hover:bg-white/5'
                                : 'text-gray-700 border-gray-100'
                                }`}
                            >
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (Image 1 - Rows Per Page) */}
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
            <div className="relative" ref={rowsDropdownRef}>
              <div
                onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                className={`flex items-center justify-between w-[80px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white text-[#f97316] border-[#f97316] shadow-sm'
                  }`}
              >
                <span className="text-[14px] font-bold">{rowsPerPage}</span>
                <ChevronDown size={14} className="text-[#f97316]" />
              </div>

              {isRowsDropdownOpen && (
                <div className={`absolute bottom-full right-0 mb-1 w-[80px] rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                  {[5, 10, 20, 50].map((rows) => (
                    <div
                      key={rows}
                      onClick={() => {
                        setRowsPerPage(rows);
                        setIsRowsDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-[14px] font-bold text-center cursor-pointer hover:bg-gray-100 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
                    >
                      {rows}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
