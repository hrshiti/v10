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
  Edit2,
  Trash2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';
import DateRangeFilter from '../components/DateRangeFilter';
import FollowUpActionModal from './FollowUpActionModal';
import FollowUpDoneModal from './FollowUpDoneModal';
import Toast from '../components/Toast';



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

const SelectAllocateDropdown = ({ isDarkMode, trainers, value, onChange }) => {
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

  const selectedTrainer = trainers.find(t => t._id === value);

  return (
    <div className="relative min-w-[170px]" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-gray-700'}`
          }`}
      >
        <span>{selectedTrainer ? `${selectedTrainer.firstName} ${selectedTrainer.lastName}` : 'Select Allocate'}</span>
        <ChevronDown size={14} className={isOpen ? 'text-[#f97316]' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
          <div
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
          >
            All Allocations
          </div>
          {trainers.map((trainer) => (
            <div
              key={trainer._id}
              onClick={() => {
                onChange(trainer._id);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[13px] font-bold cursor-pointer hover:bg-gray-50 uppercase ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
            >
              {trainer.firstName} {trainer.lastName}
            </div>
          ))}
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
  const [handledByFilter, setHandledByFilter] = useState('');
  const [trainers, setTrainers] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchTrainers = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTrainers(data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const queryParams = {
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        isDone: isDoneFilter,
        keyword: searchQuery,
        type: typeFilter,
        status: convertibilityFilter,
        handledBy: handledByFilter
      };

      const query = new URLSearchParams();
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== '') {
          query.append(key, queryParams[key]);
        }
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
    fetchTrainers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, isDoneFilter, typeFilter, convertibilityFilter, handledByFilter]);

  const handleAllocateToMe = () => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    if (adminInfo?._id) {
      setHandledByFilter(adminInfo._id);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  // Selection Logic
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(followUps.map(f => f._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteFollowUp = async (id) => {
    if (!window.confirm('Are you sure you want to delete this follow up? This action cannot be undone.')) return;
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/follow-ups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setToastMessage("Follow up deleted successfully");
        setShowToast(true);
        fetchData();
        setSelectedIds(prev => prev.filter(pid => pid !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting follow up");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected follow ups?`)) return;

    try {
      await Promise.all(selectedIds.map(id => {
        // We need to call the API directly here or reuse logic, but reusing logic with confirms is bad.
        // So we duplicate the fetch part or abstract it.
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const token = adminInfo?.token;
        return fetch(`${API_BASE_URL}/api/admin/follow-ups/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }));
      setToastMessage(`${selectedIds.length} Follow ups deleted successfully`);
      setShowToast(true);
      setSelectedIds([]);
      fetchData();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Error deleting some items');
    }
  };

  const handleDownloadReport = () => {
    if (!followUps || followUps.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headers = [
      "Date Time",
      "Status",
      "Type",
      "Name",
      "Number",
      "Allocated To",
      "Scheduled By",
      "Convertibility",
      "Comment"
    ];

    const csvRows = [
      headers.join(','), // Header row
      ...followUps.map(row => {
        return [
          new Date(row.dateTime).toLocaleString('en-IN').replace(/,/g, ' '),
          row.isDone ? 'DONE' : 'PENDING',
          row.type,
          row.name,
          row.number,
          row.handledBy ? `${row.handledBy.firstName} ${row.handledBy.lastName}` : 'Not Allocated',
          row.createdBy,
          row.status,
          `"${(row.comment || '').replace(/"/g, '""')}"` // Escape quotes
        ].join(',');
      })
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FollowUps_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <SelectAllocateDropdown
          isDarkMode={isDarkMode}
          trainers={trainers}
          value={handledByFilter}
          onChange={(val) => setHandledByFilter(val)}
        />

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
          onClick={handleDownloadReport}
          className={`flex items-center gap-2 px-6 py-2.5 border rounded-lg text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}
        >
          <Download size={18} />
          Download Report
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 transition-none pt-2">
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-none flex items-center gap-2"
          >
            <Trash2 size={18} />
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      )}

      <p className="text-[14px] font-bold text-gray-400 pt-2 tracking-tight">Total Follow Ups ({totalFollowUps})</p>

      {/* Table Container */}
      <div className={`border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className={`px-5 py-4 border-b border-gray-50 dark:border-white/5 bg-white`}>
          <span className="text-[14px] font-bold text-black-strict tracking-tight transition-none">Follow Ups</span>
        </div>
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[13px] font-bold text-gray-500 border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
                <th className="px-4 py-5">
                  <input
                    type="checkbox"
                    checked={followUps.length > 0 && selectedIds.length === followUps.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#f97316] focus:ring-[#f97316]"
                  />
                </th>
                <th className="px-4 py-5">Follow Up Date & Time</th>
                <th className="px-4 py-5 text-center">Status</th>
                <th className="px-4 py-5 text-center">Follow Up Type</th>
                <th className="px-4 py-5">Name & Number</th>
                <th className="px-4 py-5">Allocate</th>
                <th className="px-4 py-5">Scheduled By</th>
                <th className="px-4 py-5 text-center">Convertibility Status</th>
                <th className="px-4 py-5">Comment</th>
                <th className={`px-4 py-5 w-10 sticky right-0 z-20 border-l ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic animate-pulse">
                    Loading Follow Ups...
                  </td>
                </tr>
              ) : followUps.length > 0 ? (
                followUps.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode
                    ? (selectedIds.includes(row._id) ? 'bg-[#f97316]/10 border-white/5' : 'border-white/5 hover:bg-white/5')
                    : (selectedIds.includes(row._id) ? 'bg-orange-50 border-orange-100' : 'border-gray-50 hover:bg-gray-50/50')
                    }`}>
                    <td className="px-4 py-7">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row._id)}
                        onChange={() => handleSelectOne(row._id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#f97316] focus:ring-[#f97316]"
                      />
                    </td>
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
                    <td className="px-4 py-7 text-[13px] font-medium leading-relaxed max-w-xs truncate">{row.comment}</td>
                    <td className={`px-4 py-7 text-right relative sticky right-0 z-10 border-l ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-50'}`} ref={el => actionContainerRefs.current[idx] = el}>
                      <button
                        onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                        className={`transition-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${activeActionRow === idx ? 'text-black dark:text-white' : 'text-gray-400'}`}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {/* Action Menu */}
                      {activeActionRow === idx && (
                        <div
                          className={`absolute right-10 top-0 mt-2 w-[220px] rounded-lg shadow-2xl border z-[9999] overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}
                        >
                          {[
                            { label: "Delete", onClick: () => handleDeleteFollowUp(row._id) },
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
                  <td colSpan="10" className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
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
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 disabled:opacity-50 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-600 disabled:opacity-50 cursor-not-allowed'}`}
            >
              « Previous
            </button>

            {(() => {
              const pages = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (currentPage <= 4) {
                  pages.push(1, 2, 3, 4, 5, '...', totalPages);
                } else if (currentPage >= totalPages - 3) {
                  pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                }
              }

              if (totalPages === 0) return null;

              return pages.map((page, idx) => (
                page === '...' ? (
                  <span key={idx} className="px-1 text-gray-400">...</span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-[12px] font-bold transition-none ${page === currentPage ? 'bg-[#f4a261] text-white' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50')}`}
                  >
                    {page}
                  </button>
                )
              ));
            })()}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-5 py-2.5 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 disabled:opacity-50 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-600 disabled:opacity-50 cursor-not-allowed'}`}
            >
              Next »
            </button>
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
