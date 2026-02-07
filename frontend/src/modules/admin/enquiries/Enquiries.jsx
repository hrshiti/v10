import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  MessageSquare,
  Send,
  MoreVertical,
  Calendar,
  Phone,
  Users,
  UserMinus,
  PhoneOff,
  CheckCircle2,
  BarChart2,
  X,
  RefreshCcw,
  Check
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';
import AddEnquiryModal from './AddEnquiryModal';
import CloseEnquiryModal from './CloseEnquiryModal';
import CallNotConnectedModal from './CallNotConnectedModal';
import AddFollowUpModal from './AddFollowUpModal';
import DateRangeFilter from '../components/DateRangeFilter';
import GenerateReportModal from '../components/GenerateReportModal';
import Toast from '../components/Toast';

const CustomFilterDropdown = ({ options, label, isDarkMode, isOpen, onToggle, onSelect, activeVal }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative min-w-[130px]" ref={dropdownRef}>
      <div
        onClick={onToggle}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-300 text-gray-500'}`
          }`}
      >
        <span>{activeVal || label}</span>
        <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-full min-w-[160px] rounded-lg shadow-xl border z-30 transition-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => onSelect(opt)}
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

// Removed manual DateRangeFilter

// Local ReportModal removed

const Enquiries = () => {
  const { isDarkMode } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCloseEnquiryModalOpen, setIsCloseEnquiryModalOpen] = useState(false);
  const [isCallNotConnectedModalOpen, setIsCallNotConnectedModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Interactive tooltips / active rows
  const [activeActionRow, setActiveActionRow] = useState(null);

  // Refs for checking clicks outside
  const actionContainerRefs = useRef({});

  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);
  const [isSelectOptionOpen, setIsSelectOptionOpen] = useState(false);
  const rowsDropdownRef = useRef(null);
  const selectOptionRef = useRef(null);

  // States for filter dropdowns logic
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  // API States
  const [employeesList, setEmployeesList] = useState([]);
  const [trainersList, setTrainersList] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const token = adminInfo?.token;
        if (!token) return;

        const [empRes, trainerRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/employees`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (empRes.ok) {
          const data = await empRes.json();
          // specific check for employees array structure if needed, usually it returns { employees: [...] } or [...]
          const list = Array.isArray(data) ? data : (data.employees || []);
          setEmployeesList(list.map(e => `${e.firstName} ${e.lastName}`));
        }

        if (trainerRes.ok) {
          const data = await trainerRes.json();
          setTrainersList(data.map(t => `${t.firstName} ${t.lastName}`));
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  const filterOptions = {
    'Handle by': employeesList.length > 0 ? employeesList : ['No Employees Found'],
    'Lead Type': ['Hot', 'Warm', 'Cold'],
    'Trial Booked': ['Yes', 'No', 'Clear'],
    'Select gender': ['Male', 'Female'],
    'Follow up': ['Yes', 'No']
  };

  // API States
  const [enquiryStats, setEnquiryStats] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStat, setSelectedStat] = useState('');

  const stats = (enquiryStats.length > 0 ? enquiryStats : [
    { label: 'Open Enquiry', value: '0' },
    { label: 'Close Enquiry', value: '0' },
    { label: 'Not Interested', value: '0' },
    { label: 'Call Done', value: '0' },
    { label: 'Call Not Connected', value: '0' },
  ]).map(s => {
    const config = {
      'Open Enquiry': { icon: Users, color: 'bg-blue-600', hover: 'hover:bg-blue-700', active: 'bg-blue-700', ring: 'ring-blue-400' },
      'Close Enquiry': { icon: UserMinus, color: 'bg-purple-600', hover: 'hover:bg-purple-600', active: 'bg-purple-700', ring: 'ring-purple-400' },
      'Not Interested': { icon: UserMinus, color: 'bg-red-500', hover: 'hover:bg-red-500', active: 'bg-red-600', ring: 'ring-red-400' },
      'Call Done': { icon: CheckCircle2, color: 'bg-emerald-500', hover: 'hover:bg-emerald-500', active: 'bg-emerald-600', ring: 'ring-emerald-400' },
      'Call Not Connected': { icon: PhoneOff, color: 'bg-slate-600', hover: 'hover:bg-slate-600', active: 'bg-slate-700', ring: 'ring-slate-400' }
    };
    return { ...s, ...(config[s.label] || config['Open Enquiry']) };
  });

  const toggleFilter = (label) => {
    if (activeFilter === label) {
      setActiveFilter(null);
    } else {
      setActiveFilter(label);
    }
  };

  const [isAssignTrainerOpen, setIsAssignTrainerOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  // Use fetched trainers list or fallback
  const trainerOptions = trainersList.length > 0 ? trainersList : ['No Trainers Found'];
  const assignTrainerRef = useRef(null);

  const handleFilterSelect = (label, value) => {
    setFilterValues(prev => ({ ...prev, [label]: value }));
    setActiveFilter(null);
  };
  // Close dropdowns on click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Assign Trainer Dropdown
      if (assignTrainerRef.current && !assignTrainerRef.current.contains(event.target)) {
        setIsAssignTrainerOpen(false);
      }
      // Select Option Dropdown
      if (selectOptionRef.current && !selectOptionRef.current.contains(event.target)) {
        setIsSelectOptionOpen(false);
      }
      // Rows Per Page Dropdown
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) {
        setIsRowsDropdownOpen(false);
      }

      // Action Menu - Check if click is outside the specific active row's container
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



  const fetchData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/enquiries/stats`, { headers });
      const sData = await statsRes.json();
      setEnquiryStats(sData);

      // Fetch Enquiries
      const query = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        keyword: searchQuery || ''
      });

      // Map stat label to DB status
      if (selectedStat) {
        let status = selectedStat;
        if (selectedStat === 'Open Enquiry') status = 'Open';
        if (selectedStat === 'Close Enquiry') status = 'Closed';
        query.append('status', status);
      }

      // Add dropdown filters
      if (filterValues['Lead Type']) query.append('leadType', filterValues['Lead Type']);
      if (filterValues['Select gender']) query.append('gender', filterValues['Select gender']);

      const res = await fetch(`${API_BASE_URL}/api/admin/enquiries?${query.toString()}`, { headers });
      const mData = await res.json();
      setEnquiries(mData.enquiries);
      setTotalPages(mData.pages);
      setTotalEnquiries(mData.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, selectedStat, filterValues]);


  const handleSearch = () => {
    if (currentPage === 1) {
      fetchData();
    } else {
      setCurrentPage(1);
    }
  };

  // Handle Action Row Toggle
  const toggleActionRow = (idx) => {
    if (activeActionRow === idx) setActiveActionRow(null);
    else setActiveActionRow(idx);
  }

  const updateEnquiryStatus = async (id, status) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setToastMessage(`Status updated to ${status}`);
        setShowToast(true);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleAddFollowUp = async (followUpData) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      if (!followUpData.type) {
        alert("Please select follow-up type");
        return;
      }

      if (!followUpData.convertibility) {
        alert("Please select convertibility");
        return;
      }

      const dateStr = followUpData.followUpDate;
      let followUpDate;
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        followUpDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) {
          followUpDate = new Date(dateStr);
        } else {
          followUpDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        followUpDate = new Date(dateStr);
      }

      if (isNaN(followUpDate.getTime())) {
        alert("Invalid follow-up date format. Please use dd/mm/yyyy");
        return;
      }

      const payload = {
        name: `${selectedEnquiry.firstName} ${selectedEnquiry.lastName}`,
        number: selectedEnquiry.mobile,
        type: followUpData.type,
        dateTime: followUpDate,
        status: followUpData.convertibility,
        comment: followUpData.comments,
        enquiryId: selectedEnquiry._id,
        handledBy: followUpData.trainerId || undefined, // Use undefined instead of empty string
        createdBy: 'Admin'
      };

      console.log('Follow-up Payload:', payload);

      const response = await fetch(`${API_BASE_URL}/api/admin/follow-ups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setToastMessage("Follow up added successfully");
        setShowToast(true);
        setIsFollowUpModalOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add follow up');
      }
    } catch (error) {
      console.error('Error adding follow up:', error);
      alert('Error adding follow up');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setToastMessage('Enquiry deleted successfully');
        setShowToast(true);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete enquiry');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Error deleting enquiry');
    }
  };

  // Auto-Close Action Menu on Selection
  const handleActionSelect = (action, row) => {
    setSelectedEnquiry(row);
    if (action === "Sale Enquiry") {
      setIsModalOpen(true);
    } else if (action === "Edit Enquiry") {
      setIsModalOpen(true);
    } else if (action === "Call Not Connected") {
      updateEnquiryStatus(row._id, "Call Not Connected");
    } else if (action === "Schedule Follow Up") {
      setIsFollowUpModalOpen(true);
    } else if (action === "Call Done") {
      updateEnquiryStatus(row._id, "Call Done");
    } else if (action === "Not Interested") {
      updateEnquiryStatus(row._id, "Not Interested");
    } else if (action === "Delete") {
      handleDeleteEnquiry(row._id);
    }
    setActiveActionRow(null); // Close the menu
  };


  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Enquiry</h1>
        <button
          onClick={() => {
            setSelectedEnquiry(null);
            setIsModalOpen(true);
          }}
          className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none"
        >
          <Plus size={20} />
          Add Enquiry
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-none">
        {stats.map((stat, idx) => {
          const isActive = selectedStat === stat.label;
          return (
            <div
              key={idx}
              onClick={() => setSelectedStat(stat.label)}
              className={`group p-5 rounded-lg flex items-center gap-4 transition-all duration-300 cursor-pointer 
                ${isActive
                  ? `${stat.active} text-white shadow-lg ring-1 ${stat.ring} ${stat.hover}`
                  : (isDarkMode
                    ? `bg-[#1a1a1a] border border-white/5 text-white ${stat.hover} hover:border-transparent hover:shadow-lg`
                    : `bg-white border border-gray-200 text-black ${stat.hover} hover:text-white hover:border-transparent hover:shadow-lg`
                  )}`}
            >
              <div className={`p-3 rounded-lg transition-all duration-300 
                ${isActive
                  ? 'bg-white/20 text-white'
                  : (isDarkMode
                    ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                  )}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className={`text-[24px] font-black leading-none transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{stat.value}</p>
                <p className={`text-[13px] font-bold mt-1 transition-colors duration-300 
                  ${isActive
                    ? 'text-white/80'
                    : (isDarkMode ? 'text-gray-500 group-hover:text-white/80' : 'text-gray-500 group-hover:text-white/80')
                  }`}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Second Stats Row */}
      <div className="flex gap-4 transition-none">
        <div
          onClick={() => setSelectedStat('Enquiry Ratio')}
          className={`group p-5 rounded-lg flex items-center gap-4 w-full max-w-[215px] transition-all duration-300 cursor-pointer 
            ${selectedStat === 'Enquiry Ratio'
              ? 'bg-orange-600 text-white shadow-lg ring-1 ring-orange-400'
              : (isDarkMode
                ? 'bg-[#1a1a1a] border border-white/5 hover:bg-orange-600 hover:border-orange-600 hover:shadow-lg'
                : 'bg-white border border-gray-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:shadow-lg'
              )}`}
        >
          <div className={`p-3 rounded-lg transition-all duration-300 
            ${selectedStat === 'Enquiry Ratio'
              ? 'bg-white/20 text-white'
              : (isDarkMode
                ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                : 'bg-gray-100 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
              )}`}>
            <BarChart2 size={28} />
          </div>
          <p className={`text-[15px] font-bold transition-colors duration-300 
            ${selectedStat === 'Enquiry Ratio'
              ? 'text-white'
              : (isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-white')
            }`}>
            Enquiry Ratio
          </p>
        </div>
      </div>

      {/* Filters Row 1 - Custom Dropdowns */}
      <div className="flex flex-wrap gap-3 transition-none">
        {Object.keys(filterOptions).map((label, idx) => (
          <CustomFilterDropdown
            key={idx}
            label={label}
            options={filterOptions[label]}
            isDarkMode={isDarkMode}
            isOpen={activeFilter === label}
            onToggle={() => toggleFilter(label)}
            onSelect={(val) => handleFilterSelect(label, val)}
            activeVal={filterValues[label]}
          />
        ))}
      </div>

      {/* Filters Row 2 - DateRangeFilter + Buttons */}
      <div className="flex flex-wrap items-center gap-3 transition-none">
        <DateRangeFilter
          isDarkMode={isDarkMode}
          onApply={(range) => console.log('Range Applied:', range)}
        />
      </div>

      {/* Search & Export */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 transition-none pt-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={`w-full pl-12 pr-4 py-2.5 border rounded-lg text-[15px] font-bold outline-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-black placeholder:text-gray-400'}`}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none"
        >
          Search
        </button>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[14px] font-bold border transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 shadow-sm'}`}
        >
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3 transition-none pt-2">
        {/* Assign Trainer Custom Dropdown */}
        <div className="relative min-w-[170px]" ref={assignTrainerRef}>
          <div
            onClick={() => setIsAssignTrainerOpen(!isAssignTrainerOpen)}
            className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between ${isDarkMode
              ? 'bg-[#1a1a1a] border-white/10 text-white'
              : `bg-white ${isAssignTrainerOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-300 text-gray-600'}`
              }`}
          >
            <span>{selectedTrainer || 'Assign Trainer'}</span>
            <ChevronDown size={16} className={isAssignTrainerOpen ? 'text-[#f97316]' : 'text-gray-400'} />
          </div>

          {isAssignTrainerOpen && (
            <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-30 transition-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
              }`}>
              {trainerOptions.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedTrainer(opt);
                    setIsAssignTrainerOpen(false);
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

        {/* Custom Select Option Dropdown */}
        <div className="relative min-w-[150px]" ref={selectOptionRef}>
          <div
            onClick={() => setIsSelectOptionOpen(!isSelectOptionOpen)}
            className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : `bg-white ${isSelectOptionOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-300 text-gray-600'}`
              }`}
          >
            <span>Select Option</span>
            <ChevronDown size={16} className={isSelectOptionOpen ? 'text-[#f97316]' : 'text-gray-400'} />
          </div>

          {isSelectOptionOpen && (
            <div className={`absolute top-full left-0 w-[200px] mt-1 rounded-lg shadow-xl border z-20 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
              }`}>
              {['All', 'Row Per Page', 'Selected Items'].map((opt, i) => (
                <div
                  key={i}
                  onClick={() => setIsSelectOptionOpen(false)}
                  className={`px-4 py-3 text-[14px] font-medium hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="bg-gray-500 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md">Submit</button>
      </div>

      {/* Table Header Overlay */}
      <div className={`mt-8 border rounded-lg transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="p-4 border-b flex justify-between items-center transition-none">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Enquiry</span>
          <button className={`flex items-center gap-3 px-6 py-2 rounded-full text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>
            <MessageSquare size={16} className="fill-current" />
            Send SMS (4998)
            <Send size={16} />
          </button>
        </div>
        <div className="overflow-visible min-h-[450px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-4"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></th>
                <th className="px-6 py-4">Enquiry No.</th>
                <th className="px-6 py-4">Enquiry Date</th>
                <th className="px-6 py-4">Name & Mob. No.</th>
                <th className="px-6 py-4">Trial Booked</th>
                <th className="px-6 py-4">Handle by</th>
                <th className="px-6 py-4">Lead Type</th>
                <th className="px-6 py-4">Remark/Summary</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {enquiries.length > 0 ? (
                enquiries.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none relative ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-5"><input type="checkbox" className="w-4 h-4 rounded accent-[#f97316]" /></td>
                    <td className="px-6 py-5">{row.enquiryId}</td>
                    <td className="px-6 py-5">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="uppercase">{row.firstName} {row.lastName}</span>
                        <span className="text-gray-500">{row.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`${row.trialBooked === 'Yes' ? 'bg-[#10b981]' : 'bg-[#ef4444]'} text-white px-3 py-1 rounded text-[11px] font-black uppercase`}>
                        {row.trialBooked || 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-5">{row.handleBy?.firstName || 'Not Assigned'}</td>
                    <td className="px-6 py-5">
                      <span className={`${row.leadType === 'Hot' ? 'bg-[#ef4444]' : row.leadType === 'Warm' ? 'bg-[#f97316]' : 'bg-[#0ea5e9]'} text-white px-3 py-1 rounded text-[11px] font-black uppercase`}>
                        {row.leadType}
                      </span>
                    </td>
                    <td className="px-6 py-5">{row.remark || '-'}</td>
                    <td className="px-6 py-5">{row.createdBy || 'Admin'}</td>
                    <td className="px-6 py-5 relative" ref={el => actionContainerRefs.current[idx] = el}>
                      <button
                        onClick={() => toggleActionRow(idx)}
                        className={`transition-none ${activeActionRow === idx ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {/* Action Menu attached to this specific row */}
                      {activeActionRow === idx && (
                        <div
                          className={`absolute right-10 top-0 mt-2 w-56 rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}
                        >
                          {["Sale Enquiry", "Edit Enquiry", "Not Interested", "Call Done", "Call Not Connected"].map((action, i) => (
                            <div
                              key={i}
                              className={`px-4 py-3 text-[14px] font-medium border-b cursor-pointer ${isDarkMode
                                ? 'text-gray-300 border-white/5 hover:bg-white/5'
                                : 'text-gray-700 border-gray-50 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                              onClick={() => handleActionSelect(action, row)}
                            >
                              {action}
                            </div>
                          ))}
                          <div
                            className={`px-4 py-3 text-[14px] font-medium cursor-pointer flex items-center gap-2 border-b ${isDarkMode
                              ? 'text-gray-300 hover:bg-white/5 border-white/5'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-gray-50'
                              }`}
                            onClick={() => handleActionSelect("Schedule Follow Up", row)}
                          >
                            <RefreshCcw size={14} className="" />
                            Schedule Follow Up
                          </div>
                          <div
                            className={`px-4 py-3 text-[14px] font-medium cursor-pointer ${isDarkMode
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-600 hover:bg-red-50'
                              }`}
                            onClick={() => handleActionSelect("Delete", row)}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                    {isLoading ? 'Loading Enquiries...' : 'No Enquiries Found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 disabled:opacity-50'}`}
            >
              « Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-10 h-10 rounded-lg text-[13px] font-bold transition-none ${num === currentPage ? 'bg-[#f97316] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 disabled:opacity-50'}`}
            >
              Next »
            </button>
          </div>

          <div className="flex items-center gap-3 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative" ref={rowsDropdownRef}>
              <div
                onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                className={`flex items-center justify-between w-[70px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-[#f97316] text-[#f97316]'
                  }`}
              >
                <span className="text-[14px] font-bold">{rowsPerPage}</span>
                <ChevronDown size={14} className={isRowsDropdownOpen ? 'text-[#f97316]' : 'text-[#f97316]'} />
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

      <AddEnquiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEnquiry(null);
        }}
        onSuccess={() => {
          fetchData();
          setIsModalOpen(false);
          setSelectedEnquiry(null);
        }}
        isDarkMode={isDarkMode}
        initialData={selectedEnquiry}
      />

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <CloseEnquiryModal
        isOpen={isCloseEnquiryModalOpen}
        onClose={() => setIsCloseEnquiryModalOpen(false)}
        onConfirm={() => {
          updateEnquiryStatus(selectedEnquiry?._id, "Closed");
          setIsCloseEnquiryModalOpen(false);
        }}
        isDarkMode={isDarkMode}
      />

      <CallNotConnectedModal
        isOpen={isCallNotConnectedModalOpen}
        onClose={() => setIsCallNotConnectedModalOpen(false)}
        onSubmit={() => setIsCallNotConnectedModalOpen(false)}
        enquiryName={selectedEnquiry?.name}
        isDarkMode={isDarkMode}
      />

      <AddFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSubmit={handleAddFollowUp}
        enquiryData={selectedEnquiry}
        isDarkMode={isDarkMode}
      />

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default Enquiries;
