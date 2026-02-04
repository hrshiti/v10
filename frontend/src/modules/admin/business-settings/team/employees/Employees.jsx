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
  Bell,
  Trash2, // Added for Delete Modal

} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../../../config/api';

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
        <span className={`font-medium truncate ${(value && value.length > 0) ? (isDarkMode ? 'text-white' : 'text-black') : ''}`}>
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

const DeleteEmployeeModal = ({ isOpen, onClose, onConfirm, isDarkMode, employees, selectedEmployeeId }) => {
  const [newTrainerId, setNewTrainerId] = useState('');
  if (!isOpen) return null;

  const otherEmployees = employees.filter(e => e._id !== selectedEmployeeId);

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

        <h2 className="text-[24px] font-bold mb-2 text-gray-900">Delete Employee?</h2>
        <p className="text-[14px] font-medium mb-4 text-gray-500 max-w-[260px]">
          Do you really want to delete?
          This process cannot be undone.
        </p>

        <p className="text-[14px] font-medium mb-2 text-gray-800">Assign Members To (Optional)</p>
        <div className="w-full mb-6">
          <CustomDropdown
            isDarkMode={false}
            placeholder="Select New Trainer"
            options={otherEmployees.map(e => `${e.firstName} ${e.lastName}`)}
            value={otherEmployees.find(e => e._id === newTrainerId) ? `${otherEmployees.find(e => e._id === newTrainerId).firstName} ${otherEmployees.find(e => e._id === newTrainerId).lastName}` : ''}
            onChange={(val) => {
              const emp = otherEmployees.find(e => `${e.firstName} ${e.lastName}` === val);
              setNewTrainerId(emp?._id || '');
            }}
          />
        </div>

        <button
          onClick={() => onConfirm(newTrainerId)}
          className="bg-[#ef4444] hover:bg-red-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
        >
          <Trash2 size={16} />
          Yes, Delete Employee
        </button>
      </div>
    </div>
  )
}

const AddEmployeeModal = ({ isOpen, onClose, isDarkMode, onAddEmployee, onEditEmployee, initialData, isEditMode }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', mobile: '', email: '', gender: 'Male', maritalStatus: 'Single',
    birthDate: '', anniversaryDate: '',
    language: [], gymRole: [],
    gymActivities: [],
    address: '',
    country: 'India', state: '', city: '',
    employeeType: 'Full Time'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        mobile: initialData.mobile || '',
        email: initialData.email || '',
        gender: initialData.gender || 'Male',
        maritalStatus: initialData.maritalStatus || 'Single',
        birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
        anniversaryDate: initialData.anniversaryDate ? new Date(initialData.anniversaryDate).toISOString().split('T')[0] : '',
        language: initialData.language || [],
        gymRole: initialData.gymRole || [],
        gymActivities: initialData.gymActivities || [],
        address: initialData.address || '',
        country: initialData.country || 'India',
        state: initialData.state || '',
        city: initialData.city || '',
        employeeType: initialData.employeeType || 'Full Time'
      });
      setPreviewUrl(initialData.photo || '');
    } else {
      setFormData({
        firstName: '', lastName: '', mobile: '', email: '', gender: 'Male', maritalStatus: 'Single',
        birthDate: '', anniversaryDate: '',
        language: [], gymRole: [],
        gymActivities: [],
        address: '',
        country: 'India', state: '', city: '',
        employeeType: 'Full Time'
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
  }, [isOpen, isEditMode, initialData]);

  const handleMultiChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.mobile || !formData.birthDate || !formData.email) {
      alert("Please fill required fields (First Name, Last Name, Mobile, Email, Birth Date)");
      return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(val => submissionData.append(key, val));
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    if (selectedFile) {
      submissionData.append('photo', selectedFile);
    }

    if (isEditMode) {
      onEditEmployee(initialData._id, submissionData);
    } else {
      onAddEmployee(submissionData);
    }
    onClose();
  }

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
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isEditMode ? 'Edit Employee' : 'Add Employee'}
            </h2>
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
              onChange={handleFileChange}
            />
            <label
              htmlFor="employee-photo-upload"
              className={`w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden ${isDarkMode ? 'border-white/20 hover:bg-white/5' : 'border-gray-300'}`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-1" />
                  <span className={`text-[13px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload</span>
                </>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>First Name*</label>
              <input
                type="text"
                placeholder="First Name"
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Last Name*</label>
              <input
                type="text"
                placeholder="Last Name"
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Mobile Number*</label>
              <input
                type="text"
                placeholder="Ex : 9988776655"
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Email Address*</label>
              <input
                type="email"
                placeholder="Ex : abc@gmail.com"
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          {/* Radio Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-[13px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Gender*</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="w-5 h-5 accent-[#f97316]" onChange={() => handleChange('gender', 'Male')} checked={formData.gender === 'Male'} />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="w-5 h-5 accent-[#f97316]" onChange={() => handleChange('gender', 'Female')} checked={formData.gender === 'Female'} />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Female</span>
                </label>
              </div>
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Marital Status</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="maritalStatus" className="w-5 h-5 accent-[#f97316]" onChange={() => handleChange('maritalStatus', 'Single')} checked={formData.maritalStatus === 'Single'} />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Single</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="maritalStatus" className="w-5 h-5 accent-[#f97316]" onChange={() => handleChange('maritalStatus', 'Married')} checked={formData.maritalStatus === 'Married'} />
                  <span className={`text-[14px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Married</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dates & Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Birth Date*</label>
              <input
                type="date"
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
              />
            </div>
            <div>
              <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Anniversary Date</label>
              <input
                type="date"
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
                value={formData.anniversaryDate}
                onChange={(e) => handleChange('anniversaryDate', e.target.value)}
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
              onChange={(val) => handleMultiChange('gymActivities', val)}
              isMulti={true}
              isDarkMode={isDarkMode}
              placeholder="Gym Services"
            />
          </div>

          <div className="mb-6">
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Residential Address*</label>
            <textarea
              placeholder="Type your Address here..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
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
            onClick={handleSubmit}
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Used for editing
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for interactive table
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/employees?pageNumber=${page}&pageSize=${rowsPerPage}&keyword=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.employees);
        setTotalPages(data.pages);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, searchQuery]);

  const handleAddEmployee = async (employeeData) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      const res = await fetch(`${API_BASE_URL}/api/admin/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: employeeData
      });
      const data = await res.json();
      if (res.ok) {
        setNotification('Employee Added successfully');
        fetchEmployees();
      } else {
        alert(data.message || 'Error adding employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }

  const handleUpdateEmployee = async (id, updatedData) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      const res = await fetch(`${API_BASE_URL}/api/admin/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: updatedData
      });
      const data = await res.json();
      if (res.ok) {
        setNotification('Edit Successfully');
        setSelectedEmployee(null);
        fetchEmployees();
      } else {
        alert(data.message || 'Error updating employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async (newTrainerId) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      const res = await fetch(`${API_BASE_URL}/api/admin/employees/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newTrainerId })
      });
      if (res.ok) {
        setNotification('Employee Deleted successfully');
        setIsDeleteModalOpen(false);
        setDeleteId(null);
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

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

  const toggleStatus = async (id) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      const res = await fetch(`${API_BASE_URL}/api/admin/employees/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotification('Employee Status Updated Successfully.');
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
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
          onClick={() => {
            setSelectedEmployee(null);
            setIsAddModalOpen(true);
          }}
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
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400 font-medium">Loading employees...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-medium">
                    No employees found
                  </td>
                </tr>
              ) : employees.map((emp, idx) => (
                <tr key={emp._id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{emp.employeeId}</td>
                  <td className="px-6 py-8 uppercase">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-8">{emp.mobile}</td>
                  <td className="px-6 py-8">{emp.gymActivities?.join(', ')}</td>
                  <td className="px-6 py-8">{emp.gymRole?.join(', ')}</td>
                  <td className="px-6 py-8">
                    <div className="flex items-center">
                      <div
                        onClick={() => toggleStatus(emp._id)}
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
                        } ${idx >= employees.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                        <div className="py-2">
                          {['Edit', 'Delete'].map((action, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                if (action === 'Edit') {
                                  setSelectedEmployee(emp);
                                  setIsAddModalOpen(true);
                                } else if (action === 'Delete') {
                                  handleDeleteClick(emp._id);
                                }
                                setActiveActionRow(null);
                              }}
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
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}
            >
              « Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 border rounded-lg text-[12px] font-bold transition-none ${p === page ? 'bg-[#f97316] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm')}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}
            >
              Next »
            </button>
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
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedEmployee(null);
        }}
        isDarkMode={isDarkMode}
        onAddEmployee={handleAddEmployee}
        onEditEmployee={handleUpdateEmployee}
        isEditMode={!!selectedEmployee}
        initialData={selectedEmployee}
      />

      <DeleteEmployeeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDarkMode={isDarkMode}
        employees={employees}
        selectedEmployeeId={deleteId}
      />
    </div>
  );
};

export default Employees;
