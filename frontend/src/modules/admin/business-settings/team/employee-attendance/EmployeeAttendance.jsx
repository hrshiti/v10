import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  Download,
  Users,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { API_BASE_URL } from '../../../../../config/api';

// --- Reusable Components ---

const CustomDropdown = ({ options, value, onChange, isDarkMode, placeholder = "Select", minWidth = "180px" }) => {
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

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" style={{ minWidth }} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold flex justify-between items-center cursor-pointer transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : isOpen ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 text-gray-500 shadow-sm text-gray-400'
          }`}
      >
        <span className={`truncate ${value ? (isDarkMode ? 'text-white' : (options.includes(value) ? 'text-black' : 'text-[#f97316]')) : ''}`}>
          {(options.includes(value) || !value) ? (value || placeholder) : value}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#f97316]' : 'text-gray-400'}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1 max-h-[250px] overflow-y-auto rounded-lg shadow-xl border z-50 custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomDatePicker = ({ value, onChange, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const pickerRef = useRef(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

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
    <div className="relative min-w-[260px]" ref={pickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold flex items-center gap-3 cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'
          }`}
      >
        <Calendar size={18} className="text-gray-400" />
        <span className={value ? (isDarkMode ? 'text-white' : 'text-gray-700') : 'text-gray-400'}>{value || 'dd-mm-yyyy'}</span>
        <ChevronDown size={14} className={`ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-2xl border z-50 w-[320px] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          <div className="flex gap-2 mb-4">
            <select
              value={months[currentDate.getMonth()]}
              onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), months.indexOf(e.target.value), 1))}
              className={`w-1/2 p-2 rounded border text-sm font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'}`}
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => setCurrentDate(new Date(e.target.value, currentDate.getMonth(), 1))}
              className={`w-1/2 p-2 rounded border text-sm font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'}`}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
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
                className={`h-8 flex items-center justify-center text-sm rounded hover:bg-orange-50 hover:text-orange-600 cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700'
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
        className={`flex items-center justify-between w-[70px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white text-[#333] border-gray-300 shadow-sm'
          }`}
      >
        <span className="text-[14px] font-bold">{rowsPerPage}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </div>

      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-1 w-[80px] rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
          {[5, 10, 20, 50].map((rows) => (
            <div
              key={rows}
              onClick={() => {
                setRowsPerPage(rows);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-[14px] font-bold text-center cursor-pointer hover:bg-gray-100 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {rows}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Generate Report Modal (Image 5)
const GenerateReportModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generate Report</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <label className={`block text-[14px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>OTP*</label>
          <input
            type="text"
            placeholder="OTP"
            className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600">
            Validate
          </button>
        </div>
      </div>
    </div>
  );
};

// Generate Multiple Log Modal (Image 3)
const GenerateMultipleLogModal = ({ isOpen, onClose, isDarkMode }) => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [employee, setEmployee] = useState('');

  if (!isOpen) return null;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(String);
  const employees = ['Abdulla Pathan', 'ANJALI KANWAR', 'PARI PANDYA'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[550px] rounded-lg shadow-2xl overflow-visible ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generate Multiple Log</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 overflow-visible">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Select Month*</label>
              <CustomDropdown
                placeholder="Select Month"
                options={months}
                value={month}
                onChange={setMonth}
                isDarkMode={isDarkMode}
                minWidth="100%"
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Select Year*</label>
              <CustomDropdown
                placeholder="Select Year"
                options={years}
                value={year}
                onChange={setYear}
                isDarkMode={isDarkMode}
                minWidth="100%"
              />
            </div>
          </div>

          <div>
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Select Employee</label>
            <CustomDropdown
              placeholder="Select Employee"
              options={employees}
              value={employee}
              onChange={setEmployee}
              isDarkMode={isDarkMode}
              minWidth="100%"
              labelStyle="orange"
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-6 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button className="bg-[#f97316] text-white px-10 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---


// --- Reusable Components ---
// ... (CustomDropdown, CustomDatePicker, RowsPerPageDropdown, GenerateReportModal, GenerateMultipleLogModal stay same or similar)

const EmployeeAttendance = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMultipleLogModalOpen, setIsMultipleLogModalOpen] = useState(false);

  // State for active view (Attendance Log or Manual Attendance)
  const [activeView, setActiveView] = useState('Attendance Log');

  // Toast State
  const [toast, setToast] = useState(null);

  // Real data states
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch employees for dropdowns and manual attendance
  const fetchEmployees = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const res = await fetch(`${API_BASE_URL}/api/admin/employees?pageSize=1000`, {
        headers: { 'Authorization': `Bearer ${adminInfo?.token}` }
      });
      const data = await res.json();
      if (res.ok) setEmployees(data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      let url = `${API_BASE_URL}/api/admin/employees/attendance?pageNumber=${currentPage}&pageSize=${rowsPerPage}`;
      if (selectedEmployeeId) url += `&employeeId=${selectedEmployeeId}`;
      if (selectedShift) url += `&shift=${selectedShift}`;
      if (startDate) url += `&fromDate=${startDate}`;
      if (endDate) url += `&toDate=${endDate}`;
      if (searchQuery) url += `&search=${searchQuery}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${adminInfo?.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
        setTotalPages(data.pages);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (activeView === 'Attendance Log') {
      fetchLogs();
    }
  }, [currentPage, rowsPerPage, activeView, selectedEmployeeId, selectedShift, startDate, endDate, searchQuery]);

  const handlePunch = async (employeeId, type) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const emp = employees.find(e => e._id === employeeId);

      const res = await fetch(`${API_BASE_URL}/api/admin/employees/attendance/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo?.token}`
        },
        body: JSON.stringify({
          employeeId,
          date: new Date().toISOString().split('T')[0],
          [type === 'in' ? 'inTime' : 'outTime']: new Date().toISOString(),
          shift: emp?.employeeType || 'Full Time'
        })
      });

      if (res.ok) {
        setToast({ message: `Punch ${type.toUpperCase()} done.`, type: 'success' });
        if (activeView === 'Attendance Log') fetchLogs();
      } else {
        const data = await res.json();
        setToast({ message: data.message || `Error punching ${type}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setToast({ message: 'Error marking attendance', type: 'error' });
    }
  };

  const handleCardClick = (view) => {
    setActiveView(view);
    setCurrentPage(1);
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      <h1 className="text-[28px] font-black tracking-tight">Employee Attendance Management</h1>

      {/* Stats Cards Row */}
      <div className="flex gap-6 transition-none">
        <div
          onClick={() => handleCardClick('Attendance Log')}
          className={`group p-6 rounded-xl flex items-center gap-6 transition-all duration-300 cursor-pointer min-w-[300px] border-2
            ${activeView === 'Attendance Log'
              ? (isDarkMode
                ? 'bg-[#1a1a1a] border-blue-500 shadow-xl shadow-blue-500/10 hover:bg-blue-600 hover:border-transparent hover:text-white'
                : 'bg-white border-blue-600 shadow-md hover:bg-blue-600 hover:border-transparent hover:text-white'
              )
              : (isDarkMode
                ? 'bg-[#1a1a1a] border-white/5 text-white hover:bg-blue-600 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/20'
                : 'bg-white border-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-blue-500/20'
              )}`}
        >
          <div className={`p-4 rounded-xl transition-all duration-300 
            ${activeView === 'Attendance Log'
              ? 'bg-blue-600/10 text-blue-600 group-hover:bg-white/20 group-hover:text-white'
              : (isDarkMode
                ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                : 'bg-[#f8f9fa] shadow-inner text-gray-400 group-hover:bg-white/20 group-hover:text-white'
              )}`}
          >
            <div className="relative">
              <Users size={32} />
              <div className={`absolute -top-1 -right-1 rounded-full p-0.5 transition-colors duration-300 ${activeView === 'Attendance Log' ? 'bg-blue-600' : 'bg-gray-400 group-hover:bg-blue-600'}`}>
                <Plus size={10} className="font-bold text-white transition-colors duration-300" />
              </div>
            </div>
          </div>
          <div>
            <p className={`text-[32px] font-black leading-none transition-colors duration-300 ${activeView === 'Attendance Log' ? (isDarkMode ? 'text-white' : 'text-blue-600') : 'text-inherit'} group-hover:text-white`}>{totalItems}</p>
            <p className={`text-[14px] font-bold mt-1 uppercase tracking-tight opacity-70 transition-colors duration-300 ${activeView === 'Attendance Log' ? (isDarkMode ? 'text-gray-400' : 'text-blue-600/80') : 'text-inherit'} group-hover:text-white/80`}>Attendance Log</p>
          </div>
        </div>

        <div
          onClick={() => handleCardClick('Manual Attendance')}
          className={`group p-6 rounded-xl flex items-center gap-6 transition-all duration-300 cursor-pointer min-w-[300px] border-2
            ${activeView === 'Manual Attendance'
              ? (isDarkMode
                ? 'bg-[#1a1a1a] border-orange-500 shadow-xl shadow-orange-500/10 hover:bg-orange-600 hover:border-transparent hover:text-white'
                : 'bg-white border-orange-600 shadow-md hover:bg-orange-600 hover:border-transparent hover:text-white'
              )
              : (isDarkMode
                ? 'bg-[#1a1a1a] border-white/5 text-white hover:bg-orange-600 hover:border-transparent hover:shadow-lg hover:shadow-orange-500/20'
                : 'bg-white border-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-orange-500/20'
              )}`}
        >
          <div className={`p-4 rounded-xl transition-all duration-300 
            ${activeView === 'Manual Attendance'
              ? 'bg-orange-600/10 text-orange-600 group-hover:bg-white/20 group-hover:text-white'
              : (isDarkMode
                ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                : 'bg-[#f8f9fa] shadow-inner text-gray-400 group-hover:bg-white/20 group-hover:text-white'
              )}`}
          >
            <Users size={32} />
          </div>
          <div>
            <p className={`text-[32px] font-black leading-none transition-colors duration-300 ${activeView === 'Manual Attendance' ? (isDarkMode ? 'text-white' : 'text-orange-600') : 'text-inherit'} group-hover:text-white`}>{employees.length}</p>
            <p className={`text-[14px] font-bold mt-1 uppercase tracking-tight opacity-70 transition-colors duration-300 ${activeView === 'Manual Attendance' ? (isDarkMode ? 'text-gray-400' : 'text-orange-600/80') : 'text-inherit'} group-hover:text-white/80`}>Employee Count</p>
          </div>
        </div>
      </div>

      {activeView === 'Attendance Log' && (
        <>
          <div className="flex flex-wrap items-center gap-4 pt-4 transition-none">
            <CustomDropdown
              placeholder="Select Employee"
              options={employees.map(e => `${e.firstName} ${e.lastName}`)}
              value={employees.find(e => e._id === selectedEmployeeId) ? `${employees.find(e => e._id === selectedEmployeeId).firstName} ${employees.find(e => e._id === selectedEmployeeId).lastName}` : ''}
              onChange={(val) => {
                const emp = employees.find(e => `${e.firstName} ${e.lastName}` === val);
                setSelectedEmployeeId(emp?._id || '');
              }}
              isDarkMode={isDarkMode}
            />

            <CustomDropdown
              placeholder="Select Shift"
              options={['Full Time', 'Shift Time']}
              value={selectedShift}
              onChange={setSelectedShift}
              isDarkMode={isDarkMode}
            />

            <input
              type="date"
              className={`px-4 py-3 border rounded-xl text-[14px] font-bold transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              className={`px-4 py-3 border rounded-xl text-[14px] font-bold transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button onClick={() => setCurrentPage(1)} className="bg-[#f97316] text-white px-8 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Apply</button>
          </div>

          <div className="transition-none">
            <button
              onClick={() => {
                setSelectedEmployeeId('');
                setSelectedShift('');
                setStartDate('');
                setEndDate('');
              }}
              className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md"
            >
              Clear
            </button>
          </div>

          <div className="flex justify-between items-center transition-none pt-4">
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
          </div>
        </>
      )}

      {activeView === 'Attendance Log' ? (
        <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="px-5 py-4 border-b bg-white dark:bg-white/5">
            <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Employee Attendance</span>
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Mobile Number</th>
                  <th className="px-6 py-5">Employee ID</th>
                  <th className="px-6 py-5">Shift</th>
                  <th className="px-6 py-5">In Time</th>
                  <th className="px-6 py-5">Out Time</th>
                  <th className="px-6 py-5">Total Hours</th>
                  <th className="px-6 py-5">Date</th>
                </tr>
              </thead>
              <tbody className="transition-none">
                {isLoading ? (
                  <tr><td colSpan="8" className="px-6 py-20 text-center text-gray-400">Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan="8" className="px-6 py-20 text-center text-gray-400">No logs found</td></tr>
                ) : (
                  logs.map(log => (
                    <tr key={log._id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className="px-6 py-5 font-bold uppercase">{log.employeeId?.firstName} {log.employeeId?.lastName}</td>
                      <td className="px-6 py-5">{log.employeeId?.mobile}</td>
                      <td className="px-6 py-5">{log.employeeId?.employeeId}</td>
                      <td className="px-6 py-5">{log.shift}</td>
                      <td className="px-6 py-5">{log.inTime ? new Date(log.inTime).toLocaleTimeString() : '-'}</td>
                      <td className="px-6 py-5">{log.outTime ? new Date(log.outTime).toLocaleTimeString() : '-'}</td>
                      <td className="px-6 py-5">{log.totalHours || '0.00'} hrs</td>
                      <td className="px-6 py-5">{new Date(log.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}
              >
                « Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${p === currentPage ? 'bg-[#f97316] text-white' : (isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-300')}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}
              >
                Next »
              </button>
            </div>
            <div className="flex items-center gap-4 transition-none">
              <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
              <RowsPerPageDropdown rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      ) : (
        <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="px-5 py-4 border-b bg-white dark:bg-white/5">
            <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Employee List</span>
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                  <th className="px-6 py-5">Emp ID</th>
                  <th className="px-6 py-5">Emp Name</th>
                  <th className="px-6 py-5">Mobile Number</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="transition-none">
                {employees.map((employee) => (
                  <tr key={employee._id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-6 py-5 text-[14px] font-bold">{employee.employeeId}</td>
                    <td className="px-6 py-5 text-[14px] font-bold uppercase">{employee.firstName} {employee.lastName}</td>
                    <td className="px-6 py-5 text-[14px] font-bold">{employee.mobile}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handlePunch(employee._id, 'in')} className="bg-[#f97316] text-white px-6 py-2 rounded-lg text-[13px] font-bold shadow-md hover:bg-orange-600 active:scale-95">Punch In</button>
                        <button onClick={() => handlePunch(employee._id, 'out')} className="bg-[#f97316] text-white px-6 py-2 rounded-lg text-[13px] font-bold shadow-md hover:bg-orange-600 active:scale-95">Punch Out</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <GenerateReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} isDarkMode={isDarkMode} />
      <GenerateMultipleLogModal isOpen={isMultipleLogModalOpen} onClose={() => setIsMultipleLogModalOpen(false)} isDarkMode={isDarkMode} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EmployeeAttendance;
