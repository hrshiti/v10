import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  User,
  X,
  Target,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';

// --- Reusable Components ---

const CustomDatePicker = ({ value, onChange, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const pickerRef = useRef(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() + 10 - i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateClick = (day) => {
    // Format for display: DD-MM-YYYY
    const dateString = `${String(day).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
    onChange(dateString);
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-[240px]" ref={pickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold flex items-center gap-3 cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'
          }`}
      >
        <Calendar size={18} className="text-gray-400" />
        <span className={value ? (isDarkMode ? 'text-white' : 'text-gray-700') : 'text-gray-400'}>{value || 'Select Date'}</span>
        <ChevronDown size={14} className={`ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-2xl border z-50 w-[320px] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          <div className="flex gap-2 mb-4">
            <div className="relative w-1/2">
              <select
                value={months[currentDate.getMonth()]}
                onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), months.indexOf(e.target.value), 1))}
                className={`w-full p-2.5 rounded-lg border text-sm font-bold outline-none appearance-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative w-1/2">
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => setCurrentDate(new Date(e.target.value, currentDate.getMonth(), 1))}
                className={`w-full p-2.5 rounded-lg border text-sm font-bold outline-none appearance-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-500">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
            {days.map(d => (
              <div
                key={d}
                onClick={() => handleDateClick(d)}
                className={`h-8 flex items-center justify-center text-sm rounded cursor-pointer transition-none ${value && parseInt(value.split('-')[0]) === d && parseInt(value.split('-')[1]) === (currentDate.getMonth() + 1) && parseInt(value.split('-')[2]) === currentDate.getFullYear()
                  ? 'bg-[#f97316] text-white'
                  : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600')
                  }`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AnalystCard = ({ title, value, subValue, icon: Icon, isDarkMode, colorClass }) => (
  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className={`text-[12px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Relation Analysis
      </div>
    </div>
    <h3 className={`text-[14px] font-black uppercase tracking-tight mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className={`text-[28px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</span>
      {subValue && <span className="text-[14px] font-bold text-emerald-500">{subValue}</span>}
    </div>
  </div>
);

const RowsPerPageDropdown = ({ rowsPerPage, setRowsPerPage, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-[90px] px-4 py-2 border rounded-xl cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white text-[#f97316] border-[#f97316]/30 shadow-sm'
          }`}
      >
        <span className="text-[14px] font-bold">{rowsPerPage}</span>
        <ChevronDown size={14} className="text-[#f97316]" />
      </div>

      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-1 w-[90px] rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
          {[5, 10, 20, 50].map((rows) => (
            <div
              key={rows}
              onClick={() => {
                setRowsPerPage(rows);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[14px] font-bold text-center cursor-pointer hover:bg-gray-100 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {rows}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

const MembershipAnalytics = () => {
  const { isDarkMode } = useOutletContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';
    const [d, m, y] = dateStr.split('-');
    return `${y}-${m}-${d}`;
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;

      let url = `${API_BASE_URL}/api/admin/reports/subscription-analytics`;
      const params = new URLSearchParams();
      if (startDate) params.append('fromDate', formatDateForAPI(startDate));
      if (endDate) params.append('toDate', formatDateForAPI(endDate));

      const res = await fetch(`${url}?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const performanceTable = analyticsData?.packagePerformance || [];
  const totalPages = Math.ceil(performanceTable.length / rowsPerPage);
  const displayData = performanceTable.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className={`space-y-8 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <div className="flex justify-between items-center transition-none">
        <div>
          <h1 className="text-[28px] font-black tracking-tight uppercase">Subscription Analysis</h1>
          <p className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Analyze membership performance and enquiry-to-subscription relations
          </p>
        </div>
      </div>

      {/* Date Filters */}
      <div className="flex flex-wrap items-center gap-4 transition-none">
        <CustomDatePicker
          value={startDate}
          onChange={setStartDate}
          isDarkMode={isDarkMode}
        />

        <CustomDatePicker
          value={endDate}
          onChange={setEndDate}
          isDarkMode={isDarkMode}
        />

        <button
          onClick={fetchAnalytics}
          className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600 uppercase tracking-wider"
        >
          Apply Filter
        </button>
        <button
          onClick={() => { setStartDate(''); setEndDate(''); fetchAnalytics(); }}
          className={`px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 border ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          Reset
        </button>
      </div>

      {/* Relation Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalystCard
          title="Total Enquiries"
          value={analyticsData?.conversion?.totalEnquiries || 0}
          icon={Users}
          colorClass="bg-blue-500"
          isDarkMode={isDarkMode}
        />
        <AnalystCard
          title="Converted Members"
          value={analyticsData?.conversion?.convertedMembers || 0}
          subValue={analyticsData?.conversion?.conversionRate ? `${analyticsData.conversion.conversionRate.toFixed(1)}% Rate` : ''}
          icon={Target}
          colorClass="bg-emerald-500"
          isDarkMode={isDarkMode}
        />
        <AnalystCard
          title="Active Subscriptions"
          value={analyticsData?.statusBreakdown?.find(s => s._id === 'Active')?.count || 0}
          icon={CheckCircle}
          colorClass="bg-purple-500"
          isDarkMode={isDarkMode}
        />
        <AnalystCard
          title="Total Revenue"
          value={`₹${analyticsData?.revenueOverTime?.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString() || 0}`}
          icon={TrendingUp}
          colorClass="bg-[#f97316]"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Table Section */}
      <div className={`border rounded-xl overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-8 py-6 border-b bg-white dark:bg-white/5 flex items-center justify-between">
          <h2 className="text-[14px] font-black uppercase tracking-wider">Plan-wise Performance Analysis</h2>
          <div className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Showing transactional data from sales
          </div>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-[#fcfcfc] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-8 py-6 uppercase tracking-wider">Package / Membership Name</th>
                <th className="px-8 py-6 uppercase tracking-wider text-center">Subscriptions Sold</th>
                <th className="px-8 py-6 uppercase tracking-wider text-right">Revenue Generated</th>
                <th className="px-8 py-6 uppercase tracking-wider text-center">Avg. Price</th>
              </tr>
            </thead>
            <tbody className={`text-[14px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 uppercase tracking-widest text-[12px]">Processing analysis...</span>
                    </div>
                  </td>
                </tr>
              ) : displayData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-500 uppercase tracking-widest text-[12px]">
                    No performance data available for this period
                  </td>
                </tr>
              ) : (
                displayData.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#f97316]">
                          <User size={18} />
                        </div>
                        <span className="uppercase font-black text-[15px]">{row._id || 'Standard Membership'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[13px] font-black ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        {row.count}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right font-black text-[16px]">₹{row.totalCollected.toLocaleString()}</td>
                    <td className="px-8 py-8 text-center text-gray-500">₹{(row.totalCollected / row.count).toFixed(0)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'} ${currentPage === 1 ? 'opacity-50' : ''}`}
            >
              « Previous
            </button>
            <button className="w-11 h-11 border rounded-xl text-[13px] font-bold bg-[#f97316] text-white shadow-lg transition-none">{currentPage}</button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'} ${currentPage === totalPages ? 'opacity-50' : ''}`}
            >
              Next »
            </button>
          </div>

          <div className="flex items-center gap-5 transition-none">
            <span className="text-[15px] font-black text-gray-500 uppercase tracking-tight">Rows per page</span>
            <RowsPerPageDropdown
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipAnalytics;
