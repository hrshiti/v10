import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  User,
  X,
  CheckCircle
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

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
        <span className={value ? (isDarkMode ? 'text-white' : 'text-gray-700') : 'text-gray-400'}>{value || '01-01-2026'}</span>
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

const GenerateReportModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generate Report</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <label className={`block text-[14px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>OTP*</label>
          <input
            type="text"
            placeholder="OTP"
            className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>

        <div className={`px-6 py-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600">
            Validate
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [selectedCategory, setSelectedCategory] = useState('General Training');
  const [startDate, setStartDate] = useState('01-01-2026');
  const [endDate, setEndDate] = useState('31-01-2026');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const stats = [
    { label: 'General Training', value: 'General Training', icon: User, active: true },
    { label: 'Personal Training', value: 'Personal Training', icon: User },
    { label: 'Group Ex', value: 'Group Ex', icon: User },
    { label: 'Complete Fitness', value: 'Complete Fitness', icon: User },
  ];

  const reportData = [
    { name: 'GYM WORKOUT', duration: '12 Month', invoiceAmount: '325500.00', sessions: '360', paidAmount: '320000.00', sold: '78' },
    { name: 'GYM WORKOUT', duration: '1 Month', invoiceAmount: '6400.00', sessions: '30', paidAmount: '6400.00', sold: '6' },
    { name: 'GYM WORKOUT', duration: '3 Month', invoiceAmount: '3200.00', sessions: '90', paidAmount: '3200.00', sold: '3' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Membership Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 transition-none">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedCategory(stat.label)}
            className={`p-6 rounded-xl flex items-center gap-5 transition-none cursor-pointer border-2 ${stat.label === selectedCategory ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : (isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm')}`}
          >
            <div className={`p-4 rounded-xl ${stat.label === selectedCategory ? 'bg-white/20' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-[#f8f9fa] text-gray-400')}`}>
              <stat.icon size={28} />
            </div>
            <span className={`text-[16px] font-black ${stat.label === selectedCategory ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 transition-none pt-4">
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

        <button className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600">Apply</button>
        <button
          onClick={() => { setStartDate(''); setEndDate(''); }}
          className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600"
        >
          Clear
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-3 px-8 py-3 border rounded-xl text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 shadow-sm text-gray-700'}`}
        >
          <Download size={20} className="text-gray-400" />
          Generate XLS Report
        </button>
      </div>

      <div className="pt-6 space-y-2 transition-none">
        <p className="text-[15px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">Current Report: GYM WORKOUT</p>
        <p className="text-[15px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tight">Previous Report: N/A</p>
      </div>

      <div className={`mt-4 border rounded-xl overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-[#fcfcfc] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-8 py-6 uppercase tracking-wider">Package Name</th>
                <th className="px-8 py-6 uppercase tracking-wider">Duration</th>
                <th className="px-8 py-6 uppercase tracking-wider">Invoice Amount</th>
                <th className="px-8 py-6 uppercase tracking-wider">Sessions</th>
                <th className="px-8 py-6 uppercase tracking-wider">Paid Amount</th>
                <th className="px-8 py-6 uppercase tracking-wider">Membership Sold</th>
              </tr>
            </thead>
            <tbody className={`text-[14px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {reportData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-8 py-8 uppercase">{row.name}</td>
                  <td className="px-8 py-8">{row.duration}</td>
                  <td className="px-8 py-8">{row.invoiceAmount}</td>
                  <td className="px-8 py-8">{row.sessions}</td>
                  <td className="px-8 py-8">{row.paidAmount}</td>
                  <td className="px-8 py-8">{row.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>« Previous</button>
            <button className="w-11 h-11 border rounded-xl text-[13px] font-bold bg-[#f97316] text-white shadow-lg transition-none">1</button>
            <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-5 transition-none">
            <span className="text-[15px] font-black text-gray-500">Rows per page</span>
            <RowsPerPageDropdown
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default MembershipAnalytics;
