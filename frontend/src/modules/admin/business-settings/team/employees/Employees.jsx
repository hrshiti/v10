import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Upload,
  Calendar,
  CheckCircle,
  Bell
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const ToastNotification = ({ message, onClose, isDarkMode }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-[120] flex flex-col min-w-[320px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in slide-in-from-right duration-500 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border border-white/10 text-white' : 'bg-white text-gray-800'
      }`}>
      <div className="flex items-center gap-4 px-6 py-5">
        <div className="w-10 h-10 rounded-full bg-[#ecfdf5] dark:bg-[#064e3b] flex items-center justify-center border border-[#10b981]/20">
          <CheckCircle size={22} className="text-[#10b981]" />
        </div>
        <div className="flex-1">
          <span className="text-[15px] font-black tracking-tight">{message}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#10b981]" />
      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-white/5 w-full relative">
        <div className="h-full bg-[#10b981] transition-all duration-[3000ms] ease-linear" style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

// Custom Dropdown Component
const CustomDropdown = ({ label, options, value, onChange, isMulti = false, isDarkMode, placeholder = "Select" }) => {
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
    if (isMulti) {
      const newValue = value.includes(option)
        ? value.filter(item => item !== option)
        : [...value, option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-lg text-[14px] flex justify-between items-center cursor-pointer transition-all ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : isOpen ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 text-gray-500'
          }`}
      >
        <span className={`font-medium truncate ${value.length > 0 ? (isDarkMode ? 'text-white' : 'text-black') : ''}`}>
          {isMulti
            ? value.length > 0 ? value.join(', ') : placeholder
            : value || placeholder}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#f97316]' : 'text-gray-400'}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border z-50 custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2.5 text-[14px] font-medium cursor-pointer flex items-center gap-3 transition-colors ${isDarkMode
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              {isMulti && (
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(option) ? 'bg-[#f97316] border-[#f97316]' : 'border-gray-300'
                  }`}>
                  {value.includes(option) && <CheckCircle size={10} className="text-white" />}
                </div>
              )}
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Date Picker (matches Image 2)
const CustomDatePicker = ({ label, value, onChange, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // For calendar navigation
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
    <div className="relative" ref={pickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-4 py-3 border rounded-lg text-[14px] outline-none flex items-center cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'
          }`}
      >
        <span className={value ? '' : 'text-gray-400 font-medium'}>{value || 'dd-mm-yyyy'}</span>
        <Calendar size={18} className="absolute left-4 top-3.5 text-gray-400" />
        <ChevronDown size={16} className={`absolute right-4 top-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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

const AddEmployeeModal = ({ isOpen, onClose, isDarkMode }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', mobile: '', email: '', gender: '', marital: '',
    birthDate: '', anniversaryDate: '',
    language: [], gymRole: [],
    gymActivities: '',
    address: '',
    country: '', state: '', city: '',
    employeeType: ''
  });

  const handleMultiChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className={`w-full max-w-2xl my-8 rounded-lg shadow-2xl transition-all ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-100/50 border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1 rounded-md">
              <Plus size={16} />
            </div>
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Employee</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Personal Info */}
          <h3 className={`text-[15px] font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>Personal Info</h3>

          {/* Profile Upload */}
          <div className="flex justify-center mb-8">
            <input
              type="file"
              id="employee-photo-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  // Handle file upload here if needed
                  console.log("File selected:", e.target.files[0].name);
                }
              }}
            />
            <label
              htmlFor="employee-photo-upload"
              className={`w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${isDarkMode ? 'border-white/20 hover:bg-white/5' : 'border-gray-300'}`}
            >
              <Upload size={24} className="text-gray-400 mb-1" />
              <span className={`text-[13px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>First Name*</label>
              <input type="text" placeholder="First Name" className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`} />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Last Name*</label>
              <input type="text" placeholder="Last Name" className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`} />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Mobile Number*</label>
              <input type="text" placeholder="Ex : 9988776655" className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`} />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Email Address*</label>
              <input type="email" placeholder="Ex : abc@gmail.com" className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`} />
            </div>
          </div>

          {/* Radio Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-[13px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Gender*</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="w-5 h-5 accent-[#f97316]" />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="w-5 h-5 accent-[#f97316]" />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Female</span>
                </label>
              </div>
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Marital Status</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="marital" className="w-5 h-5 accent-[#f97316]" onChange={() => handleChange('marital', 'Single')} />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Single</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="marital" className="w-5 h-5 accent-[#f97316]" onChange={() => handleChange('marital', 'Married')} />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Married</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dates & Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Birth Date*</label>
              <CustomDatePicker
                value={formData.birthDate}
                onChange={(date) => handleChange('birthDate', date)}
                isDarkMode={isDarkMode}
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Anniversary Date</label>
              <CustomDatePicker
                value={formData.anniversaryDate}
                onChange={(date) => handleChange('anniversaryDate', date)}
                isDarkMode={isDarkMode}
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Language*</label>
              <CustomDropdown
                label="Language"
                options={['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu']}
                value={formData.language}
                onChange={(val) => handleMultiChange('language', val)}
                isMulti={true}
                isDarkMode={isDarkMode}
                placeholder="Select Languages"
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Gym Role*</label>
              <CustomDropdown
                label="Gym Role"
                options={['Branch Manager', 'Diet Consultant', 'Trainer', 'Receptionist', 'Sales Consultant', 'Gym Owner']}
                value={formData.gymRole}
                onChange={(val) => handleMultiChange('gymRole', val)}
                isMulti={true}
                isDarkMode={isDarkMode}
                placeholder="Select Role"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Gym Activities</label>
            <CustomDropdown
              label="Gym Activities"
              options={['Gym', 'Cardio', 'Zumba', 'Yoga', 'Crossfit']}
              value={formData.gymActivities}
              onChange={(val) => handleChange('gymActivities', val)}
              isDarkMode={isDarkMode}
              placeholder="Gym Services"
            />
          </div>

          <div className="mb-6">
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Residential Address*</label>
            <textarea placeholder="Type your Address here..." rows={3} className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Country*</label>
              <CustomDropdown
                label="Country"
                options={['India', 'USA', 'UK', 'Canada', 'Australia']}
                value={formData.country}
                onChange={(val) => handleChange('country', val)}
                isDarkMode={isDarkMode}
                placeholder="Select Country"
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>State*</label>
              <CustomDropdown
                label="State"
                options={['Gujarat', 'Maharashtra', 'Karnataka', 'Delhi', 'Rajasthan']}
                value={formData.state}
                onChange={(val) => handleChange('state', val)}
                isDarkMode={isDarkMode}
                placeholder="Select State"
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>City*</label>
              <CustomDropdown
                label="City"
                options={['Ahmedabad', 'Surat', 'Mumbai', 'Pune', 'Bangalore', 'Delhi']}
                value={formData.city}
                onChange={(val) => handleChange('city', val)}
                isDarkMode={isDarkMode}
                placeholder="Select City"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Employee Type*</label>
            <CustomDropdown
              label="Employee Type"
              options={['Full Time', 'Shift Time']}
              value={formData.employeeType}
              onChange={(val) => handleChange('employeeType', val)}
              isDarkMode={isDarkMode}
              placeholder="Select"
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none"
          >
            Submit
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


const Employees = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // States for interactive table
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [employees, setEmployees] = useState([
    { id: '492360', name: 'PARI PANDYA', mobile: '9586638773', activities: '', role: 'Trainer,Receptionist,Sales consultant', active: true },
    { id: '491419', name: 'V10 FITNESS LAB', mobile: '8347008511', activities: '', role: 'Trainer', active: true },
    { id: '489895', name: 'ANJALI KANWAR', mobile: '9824060468', activities: '', role: 'Trainer,Receptionist,Sales consultant', active: true },
    { id: '489291', name: 'Abdulla Pathan', mobile: '8320350506', activities: '', role: 'Gym owner,Trainer,Sales consultant', active: true },
  ]);

  const actionRef = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionRow !== null) {
        const currentRef = actionRef.current[activeActionRow];
        if (currentRef && !currentRef.contains(event.target)) {
          setActiveActionRow(null);
        }
      }
    };
    window.addEventListener('scroll', () => setActiveActionRow(null), true);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', () => setActiveActionRow(null), true);
    };
  }, [activeActionRow]);

  const toggleStatus = (id) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
    setNotification('Employee Status Updated Successfully.');
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>

      {notification && (
        <ToastNotification
          message={notification}
          onClose={() => setNotification(null)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Employee Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md transition-none">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[16px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-5 border-b bg-white dark:bg-white/5 flex justify-between items-center">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Employees</span>
          <div className="flex gap-3">
            <button className="bg-[#f97316] text-white px-5 py-2 rounded-lg text-[14px] font-bold shadow-sm active:scale-95 transition-none">View Gym QR</button>
            <button
              onClick={() => navigate('access-control')}
              className="bg-[#f97316] text-white px-5 py-2 rounded-lg text-[14px] font-bold shadow-sm active:scale-95 transition-none"
            >
              Access Control
            </button>
          </div>
        </div>
        <div className="overflow-x-visible min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-50 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Emp ID</th>
                <th className="px-6 py-5">Emp Name</th>
                <th className="px-6 py-5">Mobile Number</th>
                <th className="px-6 py-5">Activities</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Active / Inactive</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {employees.slice(0, rowsPerPage).map((emp, idx) => (
                <tr key={emp.id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{emp.id}</td>
                  <td className="px-6 py-8 uppercase">{emp.name}</td>
                  <td className="px-6 py-8">{emp.mobile}</td>
                  <td className="px-6 py-8">{emp.activities}</td>
                  <td className="px-6 py-8">{emp.role}</td>
                  <td className="px-6 py-8">
                    <div className="flex items-center">
                      <div
                        onClick={() => toggleStatus(emp.id)}
                        className={`relative w-[50px] h-[24px] rounded-full flex items-center px-1 border cursor-pointer transition-colors ${emp.active
                          ? 'bg-[#10b981] border-black/10'
                          : 'bg-[#64748b] border-black/10'
                          }`}
                      >
                        <span className="text-white text-[10px] font-black ml-1">{emp.active ? 'On' : 'Off'}</span>
                        <div className={`absolute w-[20px] h-[18px] bg-white rounded-lg shadow-sm border border-black/5 transition-transform duration-200 ${emp.active ? 'right-1' : 'left-1'
                          }`}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-right relative" ref={el => actionRef.current[idx] = el}>
                    <button
                      onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                      className="text-gray-400 hover:text-black dark:hover:text-white transition-none"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {/* Action Menu Popup */}
                    {activeActionRow === idx && (
                      <div className={`absolute right-0 w-[180px] rounded-xl shadow-2xl border z-[100] overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
                        } ${idx >= employees.slice(0, rowsPerPage).length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                        <div className="py-2">
                          {['Edit', 'Delete', 'Add to Essl', 'UnBlock from Essl'].map((action, i) => (
                            <div
                              key={i}
                              onClick={() => setActiveActionRow(null)}
                              className={`px-5 py-3.5 text-[14px] font-black border-b last:border-0 cursor-pointer hover:pl-7 transition-all ${isDarkMode
                                ? 'text-gray-300 border-white/5 hover:bg-white/5'
                                : action === 'Delete' ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 border-gray-50 hover:bg-orange-50 hover:text-[#f97316]'
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

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f97316] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <RowsPerPageDropdown
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Employees;
