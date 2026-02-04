import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Search,
  Download,
  Calendar,
  MoreVertical,
  X,
  History,
  CheckCircle,
  Edit2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';
import DateRangeFilter from '../components/DateRangeFilter';
import FollowUpActionModal from './FollowUpActionModal';
import FollowUpDoneModal from './FollowUpDoneModal';
import Toast from '../components/Toast';

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

const FollowTypeDropdown = ({ isDarkMode, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Follow Type');
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

  const options = [
    "Balance Due",
    "Enquiry",
    "Feedback",
    "Membership Renewal",
    "Trial",
    "Birthday"
  ];

  return (
    <div className="relative min-w-[150px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-gray-700'}`
          }`}
      >
        <span>{selected}</span>
        <ChevronDown size={14} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
          <div
            onClick={() => {
              setSelected('Follow Type');
              onChange?.('');
              setIsOpen(false);
            }}
            className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
          >
            All Types
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setSelected(opt);
                onChange?.(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ConvertibleTypeDropdown = ({ isDarkMode, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Convertible Type');
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

  const options = ["Hot", "Warm", "Cold"];

  return (
    <div className="relative min-w-[160px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-gray-700'}`
          }`}
      >
        <span>{selected}</span>
        <ChevronDown size={14} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
          <div
            onClick={() => {
              setSelected('Convertible Type');
              onChange?.('');
              setIsOpen(false);
            }}
            className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
          >
            All Status
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setSelected(opt);
                onChange?.(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const StatusDropdown = ({ isDarkMode, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('PENDING');
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
    <div className="relative min-w-[150px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-gray-700'}`
          }`}
      >
        <span>{selected}</span>
        <ChevronDown size={14} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
          {['PENDING', 'DONE'].map((status) => (
            <div
              key={status}
              onClick={() => {
                setSelected(status);
                onChange?.(status);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {status}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SelectAllocateDropdown = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Select Allocate');
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
    <div className="relative min-w-[170px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-gray-700'}`
          }`}
      >
        <span>{selected}</span>
        <ChevronDown size={14} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
          {['Abdulla Pathan', 'ANJALI KANWAR', 'PARI PANDYA'].map((alloc) => (
            <div
              key={alloc}
              onClick={() => {
                setSelected(alloc);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 uppercase ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {alloc}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AllocateToMeDropdown = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Allocate To Me');
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
    <div className="relative min-w-[160px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-gray-700'}`
          }`}
      >
        <span>{selected}</span>
        <ChevronDown size={14} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
          <div
            onClick={() => {
              setSelected('Allocate To Me');
              setIsOpen(false);
            }}
            className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
          >
            Allocate To Me
          </div>
        </div>
      )}
    </div>
  )
}

const FollowUps = () => {
  const { isDarkMode } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Rows Per Page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef(null);

  // Active Action Menu
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionContainerRefs = useRef({});

  // Action Modal State
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalTab, setActionModalTab] = useState('edit');
  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // API States
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFollowUps, setTotalFollowUps] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDoneFilter, setIsDoneFilter] = useState(false); // Default pending
  const [typeFilter, setTypeFilter] = useState('');
  const [convertibilityFilter, setConvertibilityFilter] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const query = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        isDone: isDoneFilter,
        keyword: searchQuery,
        type: typeFilter,
        status: convertibilityFilter
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/follow-ups?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFollowUps(data.followUps || []);
      setTotalPages(data.pages || 1);
      setTotalFollowUps(data.total || 0);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, isDoneFilter, typeFilter, convertibilityFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const markAsDone = async (id) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/follow-ups/${id}/done`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setToastMessage("Marked as Done");
        setShowToast(true);
        fetchData();
      } else {
        alert("Failed to mark as done");
      }
    } catch (error) {
      console.error('Error marking as done:', error);
    }
  };

  const handleUpdateResponse = async (updateData) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/follow-ups/${updateData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: updateData.status,
          comment: updateData.comment
        })
      });

      if (res.ok) {
        setToastMessage("Response updated successfully");
        setShowToast(true);
        setIsActionModalOpen(false);
        fetchData();
      } else {
        alert("Failed to update response");
      }
    } catch (error) {
      console.error('Error updating response:', error);
    }
  };

  const handleEditResponse = (row) => {
    setSelectedRowData(row);
    setActionModalTab('edit');
    setIsActionModalOpen(true);
    setActiveActionRow(null);
  };

  const handleHistory = (row) => {
    setSelectedRowData(row);
    setActionModalTab('history');
    setIsActionModalOpen(true);
    setActiveActionRow(null);
  };

  const handleDone = (row) => {
    setSelectedRowData(row);
    setIsDoneModalOpen(true);
    setActiveActionRow(null);
  };

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



  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none ">
        <h1 className="text-[28px] font-bold tracking-tight">Follow Ups</h1>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 transition-none">
        <FollowTypeDropdown isDarkMode={isDarkMode} onChange={(val) => setTypeFilter(val)} />
        <ConvertibleTypeDropdown isDarkMode={isDarkMode} onChange={(val) => setConvertibilityFilter(val)} />
        <StatusDropdown isDarkMode={isDarkMode} onChange={(status) => setIsDoneFilter(status === 'DONE')} />
        <SelectAllocateDropdown isDarkMode={isDarkMode} />
        <AllocateToMeDropdown isDarkMode={isDarkMode} />

        <DateRangeFilter
          isDarkMode={isDarkMode}
          onApply={(range) => console.log('Range Applied:', range)}
        />
      </div>

      {/* Search & Export Row */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 transition-none pt-2">
        <div className="relative flex-1 max-w-[280px]">
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={`w-full pl-11 pr-4 py-2.5 border rounded-lg text-[14px] font-medium outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
          />
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-2.5 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}
        >
          <Download size={18} />
          Generate XLS Report
        </button>
      </div>

      <p className="text-[14px] font-bold text-gray-400 pt-2 tracking-tight">Total Follow Ups ({totalFollowUps})</p>

      {/* Table Container */}
      <div className={`border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className={`px-5 py-4 border-b border-gray-50 dark:border-white/5 bg-white`}>
          <span className="text-[14px] font-bold text-black-strict tracking-tight transition-none">Follow Ups</span>
        </div>
        <div className="overflow-x-visible min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[13px] font-bold text-gray-500 border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
                <th className="px-6 py-5 whitespace-nowrap">Follow Up Date & Time</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Follow Up Type</th>
                <th className="px-6 py-5">Name & Number</th>
                <th className="px-6 py-5">Allocate</th>
                <th className="px-6 py-5">Scheduled By</th>
                <th className="px-6 py-5">Convertibility Status</th>
                <th className="px-6 py-5">Comment</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic animate-pulse">
                    Loading Follow Ups...
                  </td>
                </tr>
              ) : followUps.length > 0 ? (
                followUps.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-7 font-medium whitespace-nowrap">{new Date(row.dateTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-6 py-7">
                      <span className={`${row.isDone ? 'bg-[#10b981]' : 'bg-[#f4a261]'} text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase text-center min-w-[80px] inline-block`}>
                        {row.isDone ? 'DONE' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-7">
                      <div className={`inline-block border border-[#f97316]/40 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] px-4 py-2.5 rounded-lg text-[12px] font-bold`}>
                        {row.type}
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col transition-none">
                        <span className={`text-[13px] font-bold uppercase transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>{row.name}</span>
                        <span className="text-[12px] font-bold mt-0.5 tracking-tight transition-none">{row.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-7 font-bold uppercase">{row.handledBy ? `${row.handledBy.firstName} ${row.handledBy.lastName}` : 'Not Allocated'}</td>
                    <td className="px-6 py-7 font-bold uppercase">{row.createdBy}</td>
                    <td className="px-6 py-7">
                      <div className={`${row.status === 'Hot' ? 'bg-[#ef4444]' : row.status === 'Warm' ? 'bg-[#f97316]' : 'bg-[#3b82f6]'} text-white px-3 py-1.5 rounded-lg text-[12px] font-black uppercase text-center inline-block min-w-[50px]`}>
                        {row.status}
                      </div>
                    </td>
                    <td className="px-6 py-7 text-[13px] font-medium leading-relaxed max-w-sm">{row.comment}</td>
                    <td className="px-6 py-7 text-right relative" ref={el => actionContainerRefs.current[idx] = el}>
                      <button
                        onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                        className={`transition-none p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 ${activeActionRow === idx ? 'text-black dark:text-white' : 'text-gray-400'}`}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {/* Action Menu */}
                      {activeActionRow === idx && (
                        <div
                          className={`absolute right-10 top-0 mt-2 w-[220px] rounded-lg shadow-2xl border z-[9999] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}
                        >
                          {[
                            { label: "Edit Response", onClick: () => handleEditResponse(row) },
                            { label: "History", onClick: () => handleHistory(row) },
                            { label: "Done", onClick: () => handleDone(row), hidden: row.isDone }
                          ].map((action, i) => !action.hidden && (
                            <div
                              key={i}
                              onClick={action.onClick}
                              className={`px-5 py-3.5 text-[14px] font-medium border-b last:border-0 cursor-pointer flex items-center gap-3 hover:pl-6 transition-all ${isDarkMode
                                ? 'text-gray-300 border-white/5 hover:bg-white/5'
                                : 'text-gray-700 border-gray-50 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                            >
                              {action.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                    No Follow Ups Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Matching Image 3 exactly */}
        <div className={`px-6 py-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>« Previous</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button key={num} className={`w-10 h-10 rounded-lg text-[12px] font-bold transition-none ${num === 1 ? 'bg-[#f4a261] text-white' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
                {num}
              </button>
            ))}
            <span className="px-1 text-gray-400">...</span>
            {[245, 246].map(num => (
              <button key={num} className={`w-10 h-10 border rounded-lg text-[12px] font-bold shadow-sm transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600'}`}>
                {num}
              </button>
            ))}
            <button className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300'}`}>Next »</button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
            <div className="relative" ref={rowsDropdownRef}>
              <div
                onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                className={`flex items-center justify-between w-[70px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black shadow-sm'
                  }`}
              >
                <span className="text-[14px] font-bold">{rowsPerPage}</span>
                <ChevronDown size={14} className="text-[#f97316]" />
              </div>

              {isRowsDropdownOpen && (
                <div className={`absolute bottom-full right-0 mb-1 w-[80px] rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                  {[5, 10, 25, 50].map((rows) => (
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

      <FollowUpActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        initialTab={actionModalTab}
        rowData={selectedRowData}
        isDarkMode={isDarkMode}
        onSubmit={handleUpdateResponse}
      />

      <FollowUpDoneModal
        isOpen={isDoneModalOpen}
        onClose={() => setIsDoneModalOpen(false)}
        onConfirm={() => {
          markAsDone(selectedRowData?._id);
          setIsDoneModalOpen(false);
        }}
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

export default FollowUps;
