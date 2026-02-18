import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MoreVertical,
  Calendar,
  ChevronDown,
  Wallet,
  Trash2,
  X,
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';
import Pagination from '../../../../components/Pagination';

// --- Reusable Components (AdvancedDateRangePicker) ---

const AdvancedDateRangePicker = ({ isDarkMode, placeholder, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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
    return `${d}/${m}/${y}`;
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
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
    if (endDate) return date >= startDate && date <= endDate;
    return date.getTime() === startDate.getTime();
  };

  const isStartOrEnd = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    if (!startDate) return false;
    if (endDate) return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
    return date.getTime() === startDate.getTime();
  };

  const setPredefinedRange = (type) => {
    setActiveSidebar(type);
    const today = new Date();
    let start = new Date();
    let end = new Date();
    switch (type) {
      case 'Today': break;
      case 'Yesterday': start.setDate(today.getDate() - 1); end.setDate(today.getDate() - 1); break;
      case 'Last Week': start.setDate(today.getDate() - 7); break;
      case 'Last Months': start.setDate(today.getDate() - 30); break;
      case 'This Year': start = new Date(today.getFullYear(), 0, 1); end = new Date(today.getFullYear(), 11, 31); break;
      default: break;
    }
    setStartDate(start);
    setEndDate(end);
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const displayValue = startDate ? `${formatDate(startDate)}${endDate ? ' - ' + formatDate(endDate) : ''}` : placeholder;

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[200px] cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'} ${isOpen && !isDarkMode ? 'border-[#f97316]' : ''}`}>
        <Calendar size={18} className="text-gray-400" />
        <span className={`text-[14px] font-bold ${startDate ? (isDarkMode ? 'text-white' : 'text-gray-800') : 'text-gray-400'}`}>{displayValue}</span>
        <ChevronDown size={14} className="text-gray-400 ml-auto" />
      </div>
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 z-50 flex shadow-2xl rounded-lg border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`} style={{ width: '600px' }}>
          <div className={`w-[160px] border-r py-3 flex flex-col ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
            {['Today', 'Yesterday', 'Last Week', 'Last Months', 'This Year'].map(item => (
              <button key={item} onClick={() => setPredefinedRange(item)} className={`text-left px-5 py-4 text-[14px] font-medium transition-colors ${activeSidebar === item ? (isDarkMode ? 'bg-white/10 text-white' : 'text-black font-bold') : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:bg-gray-50')}`}>{item}</button>
            ))}
          </div>
          <div className="flex-1 p-6">
            <div className="flex gap-4 mb-8">
              <select value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))} className={`flex-1 appearance-none border rounded px-4 py-2.5 text-center font-bold outline-none cursor-pointer ${isDarkMode ? 'bg-transparent border-white/20 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <input type="number" value={currentYear} onChange={(e) => setCurrentYear(parseInt(e.target.value))} className={`w-[100px] border rounded px-4 py-2.5 text-center font-bold outline-none ${isDarkMode ? 'bg-transparent border-white/20 text-white' : 'bg-white border-gray-300 text-gray-400'}`} />
            </div>
            <div className="grid grid-cols-7 mb-4 px-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className={`text-center text-[13px] font-bold mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-800'}`}>{day}</div>)}
              {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }).map((_, i) => <div key={`empty-${i}`} className="h-10"></div>)}
              {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, i) => (
                <button key={i + 1} onClick={() => handleDateClick(i + 1)} className={`h-9 w-9 mx-auto flex items-center justify-center text-[13px] rounded transition-all mb-1 ${isStartOrEnd(i + 1) ? 'bg-[#f97316] text-white font-bold' : isDateSelected(i + 1) ? 'bg-orange-100 text-orange-600 font-bold' : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100')}`}>{i + 1}</button>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setActiveSidebar('');
                onChange({ start: null, end: null });
                setIsOpen(false);
              }} className={`px-6 py-2 rounded-lg text-[14px] font-bold ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Clear</button>
              <button onClick={() => {
                onChange({ start: startDate, end: endDate });
                setIsOpen(false);
              }} className="px-8 py-2 rounded-lg text-[14px] font-bold bg-[#f97316] hover:bg-orange-600 text-white shadow-md active:scale-95">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
      <div className={`w-[400px] rounded-lg shadow-2xl relative pt-10 pb-8 px-6 flex flex-col items-center text-center ${isDarkMode ? 'bg-white' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded transition-colors text-gray-400 hover:text-gray-600`}
        >
          <X size={20} />
        </button>

        <div className="mb-6 bg-red-100 p-4 rounded-xl">
          <Trash2 size={40} className="text-red-500" />
        </div>

        <h2 className="text-[24px] font-bold mb-2 text-gray-900">Delete Transaction?</h2>
        <p className="text-[14px] font-medium mb-8 text-gray-500 max-w-[260px]">
          Do you really want to delete this record?
          This process cannot be undone.
        </p>

        <button
          onClick={onConfirm}
          className="bg-[#ef4444] hover:bg-red-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
        >
          <Trash2 size={16} />
          Yes, Delete Record
        </button>
      </div>
    </div>
  )
}

const Payments = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionContainerRefs = useRef({});

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      let url = `${API_BASE_URL}/api/admin/sales?pageNumber=${currentPage}&pageSize=${rowsPerPage}`;
      if (searchQuery) url += `&keyword=${searchQuery}`;
      if (dateRange.start) url += `&fromDate=${dateRange.start.toISOString()}`;
      if (dateRange.end) url += `&toDate=${dateRange.end.toISOString()}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSales(data.sales || []);
        setTotalPages(data.pages || 1);
        setTotalSales(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentPage, rowsPerPage, searchQuery, dateRange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) setIsRowsDropdownOpen(false);
      if (activeActionRow !== null) {
        const currentRef = actionContainerRefs.current[activeActionRow];
        if (currentRef && !currentRef.contains(event.target)) setActiveActionRow(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeActionRow]);

  const handleAction = (action, sale) => {
    setActiveActionRow(null);
    if (action === "View Invoice") {
      navigate(`/admin/business/payments/invoice-detail?id=${sale.invoiceNumber}`);
    } else if (action === "Delete") {
      setDeleteId(sale._id);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/sales/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchSales();
        setIsDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert("Error deleting transaction");
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
  const stats = [
    { label: 'Total Revenue', value: `₹ ${totalRevenue.toFixed(2)}`, icon: Wallet },
    { label: 'Total Transactions', value: totalSales.toString(), icon: Wallet },
    { label: 'Recent Sales', value: sales.length.toString(), icon: Wallet },
    { label: 'Average Ticket', value: `₹ ${(totalRevenue / (sales.length || 1)).toFixed(2)}`, icon: Wallet },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <h1 className="text-[28px] font-black tracking-tight uppercase">Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`group p-6 rounded-xl flex items-center gap-6 border-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]'}`}>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white shadow-inner text-gray-400'}`}><stat.icon size={28} /></div>
            <div>
              <p className="text-[24px] font-black leading-none uppercase">{stat.value}</p>
              <p className="text-[12px] font-bold mt-1 opacity-80 uppercase leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 pt-4">
        <AdvancedDateRangePicker
          isDarkMode={isDarkMode}
          placeholder="Select Invoice Date"
          onChange={(range) => setDateRange(range)}
        />
        <button onClick={fetchSales} className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md active:scale-95">Refresh</button>
        <div className="relative flex-1 max-w-sm ml-auto">
          <Search size={20} className="absolute left-4 top-3 text-gray-400" />
          <input type="text" placeholder="Search Invoice/Name/Mobile" className={`w-full pl-12 pr-4 py-2.5 border rounded-xl text-[16px] font-bold outline-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className={`mt-4 border rounded-lg overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b bg-white dark:bg-white/5 uppercase font-black text-[13px] text-gray-800 dark:text-gray-200 tracking-wider">Payments List</div>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-gray-600'}`}>
                <th className="px-6 py-5">Invoice No</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Member Details</th>
                <th className="px-6 py-5 text-center">Sub Total</th>
                <th className="px-6 py-5 text-center">Discount</th>
                <th className="px-6 py-5 text-center">Tax</th>
                <th className="px-6 py-5 text-center">Total Amount</th>
                <th className="px-6 py-5 text-center">Paid Amount</th>
                <th className="px-6 py-5 text-center">Payment Mode</th>
                <th className="px-6 py-5 text-center">Type</th>
                <th className="px-6 py-5 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {isLoading ? (
                <tr><td colSpan="11" className="px-6 py-20 text-center"><div className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div><span>Loading...</span></div></td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan="11" className="px-6 py-20 text-center text-gray-500">No payment records found</td></tr>
              ) : sales.map((row, idx) => (
                <tr key={idx} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.invoiceNumber}</td>
                  <td className="px-6 py-8">{row.date ? new Date(row.date).toLocaleDateString('en-GB') : '-'}</td>
                  <td className="px-6 py-8"><div className="flex flex-col"><span className="uppercase text-[#3b82f6] font-black">{row.memberId ? `${row.memberId.firstName} ${row.memberId.lastName}` : 'N/A'}</span><span className="text-[12px] text-gray-500">{row.memberId?.mobile || '-'}</span></div></td>
                  <td className="px-6 py-8 text-center">₹{row.subTotal?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-8 text-center">₹{row.discountAmount?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-8 text-center">₹{row.taxAmount?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-8 text-center font-black">₹{((row.subTotal || 0) + (row.taxAmount || 0) - (row.discountAmount || 0)).toFixed(2)}</td>
                  <td className="px-6 py-8 text-center text-emerald-500 font-black">₹{row.amount?.toFixed(2)}</td>
                  <td className="px-6 py-8 text-center"><span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] uppercase font-black">{row.paymentMode}</span></td>
                  <td className="px-6 py-8 text-center"><span className="px-4 py-2 rounded-lg border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] text-[11px] font-black leading-none">{row.type}</span></td>
                  <td className="px-6 py-8 relative text-center" ref={el => actionContainerRefs.current[idx] = el}>
                    <button onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 ${activeActionRow === idx ? 'text-[#f97316] bg-orange-50' : 'text-gray-400'}`}><MoreVertical size={24} /></button>
                    {activeActionRow === idx && (
                      <div className={`absolute right-full mr-2 ${idx >= sales.length - 2 && sales.length > 2 ? 'bottom-0 mb-4' : 'top-0 mt-2'} w-[200px] rounded-xl shadow-2xl border z-[100] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                        <div className="flex flex-col py-1">
                          {["View Invoice", "Mail Invoice", "Delete"].map((action, i) => (
                            <div key={i} onClick={() => handleAction(action, row)} className={`px-5 py-3 text-[13px] font-black border-b last:border-0 cursor-pointer hover:bg-orange-50 hover:text-[#f97316] uppercase ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-100'}`}>{action}</div>
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
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isDarkMode={isDarkMode}
            size="small"
          />
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500">Rows per page</span>
            <div className="relative" ref={rowsDropdownRef}>
              <div onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)} className="flex items-center justify-between w-20 px-3 py-2 border rounded-lg cursor-pointer">
                <span className="text-sm font-bold">{rowsPerPage}</span>
                <ChevronDown size={14} className="text-[#f97316]" />
              </div>
              {isRowsDropdownOpen && (
                <div className={`absolute bottom-full right-0 mb-1 w-20 rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                  {[5, 10, 20, 50].map(rows => (
                    <div key={rows} onClick={() => { setRowsPerPage(rows); setIsRowsDropdownOpen(false); setCurrentPage(1); }} className="px-3 py-2 text-sm font-bold text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5">{rows}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Payments;
