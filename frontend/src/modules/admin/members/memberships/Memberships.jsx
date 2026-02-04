import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Download,
  MoreVertical,
  User,
  ChevronDown,
  UserMinus,
  Calendar,
  X,
  Plus,
  ArrowLeftRight,
  Snowflake,
  TrendingUp,
  RotateCcw,
  Edit3,
  FileText
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';

// --- Reusable Components ---

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

// --- Action Modals ---

const AddOnDaysModal = ({ isOpen, onClose, member, isDarkMode, onSuccess }) => {
  const [days, setDays] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!days) return;
    setIsSubmitting(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      const res = await fetch(`${API_BASE_URL}/api/admin/members/${member._id}/extend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ days: parseInt(days) })
      });
      if (res.ok) {
        onSuccess();
        onClose();
        setDays('');
      }
    } catch (error) {
      console.error('Error extending membership:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[450px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <h2 className={`text-[17px] font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add-On Days</h2>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500'}><X size={20} /></button>
        </div>
        <div className="p-8 space-y-5">
          <div>
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days to Add*</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 10"
              className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>
        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button onClick={onClose} className={`px-8 py-2.5 rounded-lg text-[14px] font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md active:scale-95 hover:bg-orange-600"
          >
            {isSubmitting ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangeStartDateModal = ({ isOpen, onClose, member, isDarkMode, onSuccess }) => {
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member?.startDate) {
      setDate(new Date(member.startDate).toISOString().split('T')[0]);
    }
  }, [member]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!date) return;
    setIsSubmitting(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      const res = await fetch(`${API_BASE_URL}/api/admin/members/${member._id}/change-start-date`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newStartDate: date })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error changing start date:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[450px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <h2 className={`text-[17px] font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Change Start Date</h2>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500'}><X size={20} /></button>
        </div>
        <div className="p-8 space-y-5">
          <div>
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>New Start Date*</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl text-[14px] font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>
        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button onClick={onClose} className={`px-8 py-2.5 rounded-lg text-[14px] font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md active:scale-95 hover:bg-orange-600"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const Memberships = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [membershipsData, setMembershipsData] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionRef = useRef({});

  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchStats = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      const res = await fetch(`${API_BASE_URL}/api/admin/members/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStatsData(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;

      const params = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        keyword: searchQuery,
        status: 'Active'
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/members?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMembershipsData(data.members);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentPage, rowsPerPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionRow !== null) {
        if (actionRef.current[activeActionRow] && !actionRef.current[activeActionRow].contains(event.target)) {
          setActiveActionRow(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeActionRow]);

  const stats = [
    {
      label: 'Active Subscriptions',
      value: statsData?.active || 0,
      icon: User,
      active: 'bg-orange-600',
      hover: 'hover:bg-orange-600',
      ring: 'ring-orange-400'
    },
    {
      label: 'Expiring Soon',
      value: statsData?.expiringSoon || 0,
      icon: Calendar,
      active: 'bg-red-600',
      hover: 'hover:bg-red-600',
      ring: 'ring-red-400'
    },
    {
      label: 'Expired',
      value: statsData?.expired || 0,
      icon: UserMinus,
      active: 'bg-slate-600',
      hover: 'hover:bg-slate-600',
      ring: 'ring-slate-400'
    },
  ];

  const handleAction = (opt, member) => {
    setActiveActionRow(null);
    setSelectedMember(member);

    switch (opt.label) {
      case 'View Profile':
        navigate(`/admin/members/profile/${member._id}`);
        break;
      case 'Add-On Days':
        setShowAddOnModal(true);
        break;
      case 'Change Start Date':
        setShowStartDateModal(true);
        break;
      case 'Renew Plan':
        navigate(`/admin/members/profile/${member._id}/membership/renew`);
        break;
      case 'Upgrade Plan':
        navigate(`/admin/members/profile/${member._id}/membership/upgrade`);
        break;
      case 'Freeze Plan':
        navigate(`/admin/members/profile/${member._id}/membership/freeze`);
        break;
      case 'Transfer':
        navigate(`/admin/members/profile/${member._id}/membership/transfer`);
        break;
      case 'View Documents':
        navigate(`/admin/members/profile/${member._id}/documents`);
        break;
      default:
        break;
    }
  };

  const actionMenuItems = [
    { label: 'View Profile', icon: User },
    { label: 'Add-On Days', icon: Plus },
    { label: 'Change Start Date', icon: Calendar },
    { label: 'Renew Plan', icon: RotateCcw },
    { label: 'Upgrade Plan', icon: TrendingUp },
    { label: 'Freeze Plan', icon: Snowflake },
    { label: 'Transfer', icon: ArrowLeftRight },
    { label: 'View Documents', icon: FileText },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] font-black tracking-tight uppercase">Subscription Management</h1>
        <button
          onClick={() => navigate('/admin/members/packages')}
          className="flex items-center gap-2 bg-[#f97316] text-white px-6 py-2.5 rounded-lg text-[14px] font-black active:scale-95 shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} /> Manage Packages
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-none">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`group p-6 rounded-2xl flex items-center gap-6 transition-all duration-300 border ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className={`text-[32px] font-black leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-[13px] font-black mt-1 uppercase tracking-wider text-gray-500`}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center gap-4 transition-none pt-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className={`flex items-center gap-3 px-8 py-3.5 border rounded-xl text-[14px] font-bold transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-100 shadow-sm text-gray-700'}`}
        >
          <Download size={20} className="text-gray-400" />
          Export active list
        </button>
      </div>

      <div className={`mt-8 border rounded-xl overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-6 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5">
          <span className="text-[14px] font-black uppercase text-gray-400 tracking-wider">Active Memberships</span>
          <div className="text-[11px] font-bold text-gray-500 uppercase">Live database sync enabled</div>
        </div>
        <div className="overflow-x-auto scroll-smooth custom-scrollbar min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-500' : 'bg-[#fcfcfc] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-6 uppercase">Member ID</th>
                <th className="px-6 py-6 uppercase">Full Name</th>
                <th className="px-6 py-6 uppercase">Mobile Number</th>
                <th className="px-6 py-6 uppercase">Subscription</th>
                <th className="px-6 py-6 uppercase">Duration</th>
                <th className="px-6 py-6 uppercase">Validity</th>
                <th className="px-6 py-6 uppercase">Assigned Trainer</th>
                <th className="px-6 py-6 uppercase">Status</th>
                <th className="px-6 py-6 border-l dark:border-white/5 w-[80px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[14px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 uppercase tracking-widest text-[11px]">Syncing with backend...</span>
                    </div>
                  </td>
                </tr>
              ) : membershipsData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-20 text-center text-gray-500 uppercase tracking-widest text-[11px]">
                    No active memberships found
                  </td>
                </tr>
              ) : (
                membershipsData.map((member, idx) => (
                  <tr key={member._id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-7">
                      <span className="font-black text-orange-500">#{member.memberId}</span>
                    </td>
                    <td className="px-6 py-7 uppercase">{member.firstName} {member.lastName}</td>
                    <td className="px-6 py-7">{member.mobile}</td>
                    <td className="px-6 py-7">
                      <div className={`px-3 py-1 rounded-lg text-[12px] font-black inline-block ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        {member.packageName}
                      </div>
                    </td>
                    <td className="px-6 py-7 text-center">{member.durationMonths} Months</td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px]">{new Date(member.startDate).toLocaleDateString('en-GB')}</span>
                        <span className="text-[11px] text-gray-500">to {new Date(member.endDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      {member.assignedTrainer ? `${member.assignedTrainer.firstName} ${member.assignedTrainer.lastName}` : '--'}
                    </td>
                    <td className="px-6 py-7">
                      <div className={`px-3 py-1 rounded-full text-[11px] font-black border ${member.status === 'Active'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                        : 'border-red-500/30 bg-red-500/10 text-red-500'
                        } inline-block uppercase`}>
                        {member.status}
                      </div>
                    </td>
                    <td className="px-6 py-7 text-center relative border-l dark:border-white/5" ref={el => actionRef.current[idx] = el}>
                      <button
                        onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all active:scale-90"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeActionRow === idx && (
                        <div className={`absolute right-12 top-0 w-[220px] rounded-xl shadow-2xl border z-50 overflow-hidden text-left animate-in fade-in slide-in-from-right-2 duration-200 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                          <div className="py-2">
                            {actionMenuItems.map((action, i) => (
                              <div
                                key={i}
                                onClick={() => handleAction(action, member)}
                                className={`px-5 py-3 text-[13px] font-bold border-b last:border-0 cursor-pointer flex items-center gap-3 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'
                                  }`}
                              >
                                <action.icon size={16} className="text-gray-400" />
                                {action.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'} ${currentPage === 1 ? 'opacity-50' : ''}`}
            >
              « Previous
            </button>
            <button className="w-11 h-11 border rounded-xl text-[13px] font-bold bg-[#f97316] text-white shadow-lg transition-none">{currentPage}</button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'} ${currentPage === totalPages ? 'opacity-50' : ''}`}
            >
              Next »
            </button>
          </div>

          <div className="flex items-center gap-5 transition-none">
            <span className="text-[15px] font-black text-gray-500 tracking-tight uppercase">Rows per page</span>
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

      <AddOnDaysModal
        isOpen={showAddOnModal}
        onClose={() => setShowAddOnModal(false)}
        member={selectedMember}
        isDarkMode={isDarkMode}
        onSuccess={() => {
          fetchMembers();
          fetchStats();
        }}
      />

      <ChangeStartDateModal
        isOpen={showStartDateModal}
        onClose={() => setShowStartDateModal(false)}
        member={selectedMember}
        isDarkMode={isDarkMode}
        onSuccess={() => {
          fetchMembers();
          fetchStats();
        }}
      />
    </div>
  );
};

export default Memberships;
