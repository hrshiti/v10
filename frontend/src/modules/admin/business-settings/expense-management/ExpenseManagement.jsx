import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Trash2 // Added Trash2 for Delete Modal
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';

// --- Reusable Components ---

const Toast = ({ message, onClose, isDarkMode }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-10 right-10 z-[120] flex flex-col rounded-lg shadow-2xl overflow-hidden min-w-[350px] animate-in slide-in-from-right duration-300 ${isDarkMode ? 'bg-white text-black' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center p-4 gap-3">
        <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0">
          <Check size={16} className="text-white" strokeWidth={3} />
        </div>
        <p className="font-medium text-[15px] flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
      <div className="h-1 bg-[#f0fdf4] w-full">
        <div className="h-full bg-[#22c55e] animate-progress origin-left w-full"></div>
      </div>
    </div>
  );
};

const ReportModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
      <div className={`w-[400px] rounded-lg shadow-2xl transition-all ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h3 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Generate Report</h3>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>OTP*</label>
          <input
            type="text"
            placeholder="OTP"
            className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode
              ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 text-black placeholder-gray-400'
              }`}
          />
        </div>
        <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-[14px] font-bold shadow-md transition-none">
            Validate
          </button>
        </div>
      </div>
    </div>
  )
}

const CustomSelect = ({ options, value, onChange, placeholder, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316]' : 'border-gray-300'} text-gray-700`
          }`}
      >
        <span className={`${!value ? 'text-gray-400' : ''}`}>{value || placeholder}</span>
        <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-50 max-h-[200px] overflow-y-auto custom-scrollbar transition-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-none ${isDarkMode
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdvancedSingleDatePicker = ({ value, onChange, isDarkMode, placeholder = "dd-mm-yyyy" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Dropdown states for Calendar Header
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const containerRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const dateStr = `${String(day).padStart(2, '0')}-${String(currentMonth + 1).padStart(2, '0')}-${currentYear}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316]' : 'border-gray-300'} text-gray-700`
          }`}
      >
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-gray-400" />
          <span className={`${!value ? 'text-gray-400' : ''}`}>{value || placeholder}</span>
        </div>
        <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 z-50 w-[320px] shadow-2xl rounded-lg border overflow-visible p-4 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {/* Month/Year Selectors */}
          <div className="flex gap-2 mb-4 relative z-10">
            {/* Month Selector */}
            <div className="relative flex-1" ref={monthDropdownRef}>
              <div
                onClick={(e) => { e.stopPropagation(); setShowMonthDropdown(!showMonthDropdown); setShowYearDropdown(false); }}
                className={`border rounded px-3 py-2 text-center text-sm font-bold cursor-pointer ${isDarkMode ? 'border-white/20 text-white' : 'border-gray-300 text-gray-600'
                  }`}
              >
                {months[currentMonth]}
              </div>
              {showMonthDropdown && (
                <div className={`absolute top-full left-0 w-full mt-1 border rounded shadow-xl grid grid-cols-1 max-h-[200px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                  {months.map((m, i) => (
                    <div
                      key={m}
                      onClick={(e) => { e.stopPropagation(); setCurrentMonth(i); setShowMonthDropdown(false); }}
                      className={`px-3 py-2 text-xs font-bold cursor-pointer ${currentMonth === i
                        ? 'bg-blue-600 text-white'
                        : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50')
                        }`}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Year Selector */}
            <div className="relative flex-1" ref={yearDropdownRef}>
              <div
                onClick={(e) => { e.stopPropagation(); setShowYearDropdown(!showYearDropdown); setShowMonthDropdown(false); }}
                className={`border rounded px-3 py-2 text-center text-sm font-bold cursor-pointer ${isDarkMode ? 'border-white/20 text-white' : 'border-gray-300 text-gray-600'
                  }`}
              >
                {currentYear}
              </div>
              {showYearDropdown && (
                <div className={`absolute top-full left-0 w-full mt-1 border rounded shadow-xl max-h-[200px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                  {years.map((y) => (
                    <div
                      key={y}
                      onClick={(e) => { e.stopPropagation(); setCurrentYear(y); setShowYearDropdown(false); }}
                      className={`px-3 py-2 text-xs font-bold cursor-pointer ${currentYear === y
                        ? 'bg-blue-600 text-white'
                        : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50')
                        }`}
                    >
                      {y}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className={`text-center text-[12px] font-bold mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-800'}`}>
                {day}
              </div>
            ))}
            {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8"></div>
            ))}
            {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handleDateClick(i + 1)}
                className={`h-8 w-8 mx-auto flex items-center justify-center text-[13px] rounded hover:bg-[#f97316] hover:text-white transition-colors ${value === `${String(i + 1).padStart(2, '0')}-${String(currentMonth + 1).padStart(2, '0')}-${currentYear}`
                  ? 'bg-[#f97316] text-white font-bold'
                  : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DeleteExpenseModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
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

        <h2 className="text-[24px] font-bold mb-2 text-gray-900">Delete Expense?</h2>
        <p className="text-[14px] font-medium mb-8 text-gray-500 max-w-[260px]">
          Do you really want to delete?
          This process cannot be undone.
        </p>

        <button
          onClick={onConfirm}
          className="bg-[#ef4444] hover:bg-red-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
        >
          <Trash2 size={16} />
          Yes, Delete Expense
        </button>
      </div>
    </div>
  )
}

const AddExpenseModal = ({ isOpen, onClose, isDarkMode, onAddExpense, onEditExpense, initialData, isEditMode, employeesList }) => {
  if (!isOpen) return null;

  const [expenseData, setExpenseData] = useState({
    expenseType: '',
    description: '',
    amount: '',
    date: '',
    paymentMode: '',
    staffName: ''
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      // Format date for the picker if it's a full Date object/ISO string
      let dateValue = initialData.date;
      if (dateValue && (dateValue.includes('T') || !dateValue.includes('-'))) {
        const d = new Date(dateValue);
        dateValue = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      }
      setExpenseData({ ...initialData, date: dateValue });
    } else {
      setExpenseData({
        expenseType: '',
        description: '',
        amount: '',
        date: '',
        paymentMode: '',
        staffName: ''
      });
    }
  }, [isOpen, isEditMode, initialData]);

  const handleSubmit = () => {
    if (!expenseData.expenseType || !expenseData.amount || !expenseData.date || !expenseData.paymentMode || !expenseData.staffName) {
      alert("Please fill all required fields");
      return;
    }

    if (isEditMode) {
      onEditExpense(expenseData);
    } else {
      onAddExpense(expenseData);
    }
    // onClose(); // Handle onClose in parent after successful API call
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
      <div className={`w-[500px] rounded-xl shadow-2xl transition-all max-h-[90vh] overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              <span className="text-lg font-bold">$</span>
            </div>
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {isEditMode ? 'Edit Expenses' : 'Add Expenses'}
            </h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">

          {/* Expense Type */}
          <div>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Expense Type*</label>
            <input
              type="text"
              placeholder="Enter Expense Type"
              className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black'
                }`}
              value={expenseData.expenseType}
              onChange={(e) => setExpenseData({ ...expenseData, expenseType: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Description</label>
            <textarea
              rows={3}
              placeholder="Describe the plan here..."
              className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black'
                }`}
              value={expenseData.description}
              onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
            />
          </div>

          {/* Expense Amount */}
          <div>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Expense Amount*</label>
            <input
              type="number"
              placeholder="Enter Expense Amount"
              className={`w-full px-4 py-2.5 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black'
                }`}
              value={expenseData.amount}
              onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
            />
          </div>

          {/* Expense Date */}
          <div>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Expense Date*</label>
            <AdvancedSingleDatePicker
              isDarkMode={isDarkMode}
              value={expenseData.date}
              onChange={(val) => setExpenseData({ ...expenseData, date: val })}
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Payment Mode*</label>
            <CustomSelect
              options={["Credit Card", "Debit Card", "Google Pay", "BHIM", "NEFT", "RTGS", "IMPS", "Cash", "Cheque"]}
              placeholder="Select"
              isDarkMode={isDarkMode}
              value={expenseData.paymentMode}
              onChange={(val) => setExpenseData({ ...expenseData, paymentMode: val })}
            />
          </div>

          {/* Staff Name */}
          <div>
            <label className={`block text-[13px] font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Staff Name*</label>
            <CustomSelect
              options={employeesList}
              placeholder="Select"
              isDarkMode={isDarkMode}
              value={expenseData.staffName}
              onChange={(val) => setExpenseData({ ...expenseData, staffName: val })}
            />
          </div>

        </div>

        {/* Footer */}
        <div className={`p-5 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            onClick={handleSubmit}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md transition-none active:scale-95"
          >
            {isEditMode ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffDropdown = ({ isDarkMode, selected, onSelect, employeesList }) => {
  // Kept for the main filter (could also use CustomSelect but this has custom styling active for filter)
  const [isOpen, setIsOpen] = useState(false);
  const options = employeesList;
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
    <div className="relative min-w-[200px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-[#ffedd5] text-[#f97316]'}`
          }`}
      >
        <span>{selected || 'Staff Name'}</span>
        <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-[#f97316]'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-30 max-h-[200px] overflow-y-auto custom-scrollbar transition-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[14px] font-bold cursor-pointer uppercase transition-none ${isDarkMode
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-800 hover:bg-gray-50'
                }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Advanced Date Range Picker (For Filter) ---

const DateRangePicker = ({ isDarkMode }) => {
  // ... (Keep existing implementation)
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Dropdown states for Calendar Header
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const [activeSidebar, setActiveSidebar] = useState('Today');
  const containerRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);

  // Close logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
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
    return `${d}-${m}-${y}`;
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

  useEffect(() => { if (!startDate) setPredefinedRange('Today'); }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2.5 border rounded-lg min-w-[260px] cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-300'
          } ${isOpen && !isDarkMode ? 'border-[#f97316]' : ''}`}
      >
        <Calendar size={18} className="text-gray-400" />
        <span className={`text-[14px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
          {startDate ? `${formatDate(startDate)} - ${formatDate(endDate || startDate)}` : 'dd/mm/yyyy'}
        </span>
        <ChevronDown size={16} className={`ml-auto ${isOpen ? 'text-[#f97316]' : 'text-gray-400'}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 z-50 flex shadow-2xl rounded-lg border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`} style={{ width: '640px' }}>

          <div className={`w-[160px] border-r py-4 flex flex-col ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
            {['Today', 'Yesterday', 'Last Week', 'Last Months', 'This Year'].map(item => (
              <button
                key={item}
                onClick={() => setPredefinedRange(item)}
                className={`text-left px-6 py-3 text-[14px] font-medium transition-colors ${activeSidebar === item
                  ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-black')
                  : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:bg-gray-50')
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6">
            {/* Month/Year Selectors */}
            <div className="flex gap-4 mb-6 relative">
              {/* Month Selector */}
              <div className="relative flex-1" ref={monthDropdownRef}>
                <div
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className={`border rounded px-4 py-2 text-center font-bold cursor-pointer flex items-center justify-between ${isDarkMode ? 'border-white/20 text-white' : 'border-gray-300 text-gray-500'
                    }`}
                >
                  {months[currentMonth]}
                </div>
                {showMonthDropdown && (
                  <div className={`absolute top-full left-0 w-full mt-1 border rounded shadow-xl grid grid-cols-1 max-h-[200px] overflow-y-auto no-scrollbar z-[60] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                    {months.map((m, i) => (
                      <div
                        key={m}
                        onClick={() => { setCurrentMonth(i); setShowMonthDropdown(false); }}
                        className={`px-4 py-2 text-sm font-bold cursor-pointer ${currentMonth === i
                          ? 'bg-blue-600 text-white'
                          : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50')
                          }`}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Selector */}
              <div className="relative w-[120px]" ref={yearDropdownRef}>
                <div
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                  className={`border rounded px-4 py-2 text-center font-bold cursor-pointer ${isDarkMode ? 'border-white/20 text-white' : 'border-gray-300 text-gray-500'
                    }`}
                >
                  {currentYear}
                </div>
                {showYearDropdown && (
                  <div className={`absolute top-full left-0 w-full mt-1 border rounded shadow-xl max-h-[200px] overflow-y-auto no-scrollbar z-[60] ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
                    {years.map((y) => (
                      <div
                        key={y}
                        onClick={() => { setCurrentYear(y); setShowYearDropdown(false); }}
                        className={`px-4 py-2 text-sm font-bold cursor-pointer ${currentYear === y
                          ? 'bg-blue-600 text-white'
                          : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50')
                          }`}
                      >
                        {y}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
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
                  className={`h-10 w-10 mx-auto flex items-center justify-center text-[13px] rounded transition-all ${isStartOrEnd(i + 1)
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

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
              <button
                onClick={() => setIsOpen(false)}
                className={`px-5 py-2 rounded-lg text-[14px] font-bold ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 rounded-lg text-[14px] font-bold bg-[#f97316] hover:bg-orange-600 text-white shadow-md active:scale-95"
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

// --- Main Component ---

const ExpenseManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef(null);

  // State for active stat card
  const [selectedStat, setSelectedStat] = useState('');

  // Expenses State
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [toast, setToast] = useState(null); // { message }

  // Edit & Delete State
  const [editingExpense, setEditingExpense] = useState(null); // Stores the expense being edited
  const [deleteId, setDeleteId] = useState(null); // Stores ID of expense to delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // API States
  const [isLoading, setIsLoading] = useState(true);
  const [employeesList, setEmployeesList] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const params = new URLSearchParams();
      if (searchQuery) params.append('keyword', searchQuery);
      if (selectedStaff) params.append('staffName', selectedStaff);

      const response = await fetch(`${API_BASE_URL}/api/admin/expenses?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
        const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
        setTotalExpenses(total);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.employees || []);
        setEmployeesList(list.map(e => `${e.firstName} ${e.lastName}`));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  const handleAddExpense = async (newExpense) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      // Format date for backend
      const parts = newExpense.date.split('-');
      const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

      const response = await fetch(`${API_BASE_URL}/api/admin/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newExpense, date: formattedDate })
      });

      if (response.ok) {
        setToast({ message: 'Expense Added successfully.' });
        fetchData();
        handleAddModalClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense');
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setIsAddExpenseModalOpen(true);
  };

  const handleUpdateExpense = async (updatedData) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      // Format date for backend
      const parts = updatedData.date.split('-');
      const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

      const response = await fetch(`${API_BASE_URL}/api/admin/expenses/${editingExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updatedData, date: formattedDate })
      });

      if (response.ok) {
        setToast({ message: 'Edit Successfully' });
        fetchData();
        setEditingExpense(null);
        setIsAddExpenseModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Error updating expense');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/expenses/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setToast({ message: 'Expense Deleted successfully.' });
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleAddModalClose = () => {
    setIsAddExpenseModalOpen(false);
    setEditingExpense(null); // Clear editing state on close
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) {
        setIsRowsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-visible pb-10`}>

      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Expense Management</h1>
        <button
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none"
        >
          <Plus size={20} />
          Add Expenses
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none pt-2">
        <div
          onClick={() => setSelectedStat('Total Expenses')}
          className={`group p-6 rounded-xl flex items-center gap-6 transition-all duration-300 cursor-pointer min-w-[320px] shadow-sm 
            ${selectedStat === 'Total Expenses'
              ? 'bg-blue-600 text-white shadow-lg ring-1 ring-blue-400 hover:bg-blue-700'
              : (isDarkMode
                ? 'bg-[#1a1a1a] text-white hover:bg-blue-600 hover:shadow-lg'
                : 'bg-white border border-gray-100 text-black hover:bg-blue-600 hover:text-white hover:shadow-lg'
              )}`}
        >
          <div className={`p-4 rounded-xl transition-all duration-300 
            ${selectedStat === 'Total Expenses'
              ? 'bg-white/20 text-white'
              : (isDarkMode
                ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                : 'bg-[#f8f9fa] text-gray-400 group-hover:bg-white/20 group-hover:text-white'
              )}`}>
            <div className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-colors duration-300 
              ${selectedStat === 'Total Expenses' ? 'border-white' : 'border-gray-300 group-hover:border-white'}`}>
              <span className="text-[28px] font-black tracking-wider">₹</span>
            </div>
          </div>
          <div>
            <p className={`text-[36px] font-black leading-none transition-colors duration-300 ${selectedStat === 'Total Expenses' ? 'text-white' : 'group-hover:text-white'}`}>₹ {totalExpenses}</p>
            <p className={`text-[15px] font-bold mt-1 opacity-80 transition-colors duration-300 ${selectedStat === 'Total Expenses' ? 'text-white' : 'group-hover:text-white'}`}>Total Expenses</p>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 pt-6 transition-none">
        <StaffDropdown
          isDarkMode={isDarkMode}
          selected={selectedStaff}
          onSelect={setSelectedStaff}
          employeesList={employeesList}
        />

        <DateRangePicker isDarkMode={isDarkMode} />

        <button
          onClick={fetchData}
          className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setSelectedStaff('');
            setSearchQuery('');
            fetchData();
          }}
          className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md"
        >
          Clear
        </button>

        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ml-auto">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-6 py-2.5 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 shadow-sm text-gray-600'}`}
          >
            <Download size={20} className="text-gray-400" />
            Generate XLS Report
          </button>
        </div>
      </div>

      <p className="text-[13px] font-bold text-gray-500 pt-2 transition-none">Total Expenses (₹{totalExpenses})</p>

      {/* Table Section */}
      <div className={`rounded-lg overflow-hidden transition-none border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-6 py-4 border-b dark:border-white/5 flex gap-2">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Expenses</span>
        </div>

        <div className="overflow-x-auto min-h-[150px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-8 py-4">#</th>
                <th className="px-8 py-4">Expense Type</th>
                <th className="px-8 py-4">Description</th>
                <th className="px-8 py-4">Expense Date</th>
                <th className="px-8 py-4">Staff Name</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="transition-none">
              {expenses.length === 0 ? (
                <tr className="border-b dark:border-white/5">
                  <td colSpan={7} className="px-8 py-8 text-center text-gray-400 font-medium">No expenses found</td>
                </tr>
              ) : (
                expenses.map((expense, idx) => (
                  <tr key={expense._id} className={`border-b transition-none ${isDarkMode ? 'bg-transparent border-white/5 hover:bg-white/5' : 'bg-white border-gray-50 hover:bg-gray-50'}`}>
                    <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{idx + 1}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-block px-3 py-1 border rounded text-[13px] font-bold ${isDarkMode ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : 'border-orange-200 text-orange-600 bg-orange-50'}`}>
                        {expense.expenseType}
                      </span>
                    </td>
                    <td className={`px-8 py-5 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{expense.description}</td>
                    <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {new Date(expense.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-gray-800 uppercase'}`}>{expense.staffName}</td>
                    <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹ {expense.amount}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-block px-3 py-1 border rounded text-[12px] font-bold uppercase ${isDarkMode ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : 'border-orange-200 text-orange-600 bg-orange-50'}`}>
                        {expense.paymentMode}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(expense)}
                          className="bg-[#f97316] text-white px-4 py-1.5 rounded-lg text-[13px] font-bold shadow-sm hover:bg-orange-600 transition-none">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(expense._id)}
                          className="bg-[#f97316] text-white px-4 py-1.5 rounded-lg text-[13px] font-bold shadow-sm hover:bg-orange-600 transition-none">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[13px] font-bold bg-[#f97316] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative" ref={rowsDropdownRef}>
              <div
                onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                className={`flex items-center justify-between w-[60px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-600'
                  }`}
              >
                <span className="text-[13px] font-bold">{rowsPerPage}</span>
                <ChevronDown size={14} className="text-gray-400" />
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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={handleAddModalClose}
        isDarkMode={isDarkMode}
        onAddExpense={handleAddExpense}
        onEditExpense={handleUpdateExpense}
        initialData={editingExpense}
        isEditMode={!!editingExpense}
        employeesList={employeesList}
      />

      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDarkMode={isDarkMode}
      />

      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default ExpenseManagement;
