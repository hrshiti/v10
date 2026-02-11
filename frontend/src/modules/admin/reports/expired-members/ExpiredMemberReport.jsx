import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SingleDatePicker from '../../components/SingleDatePicker';
import GenerateReportModal from '../../components/GenerateReportModal';

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
    <div className="relative min-w-[200px]" ref={dropdownRef}>
      <div
        onClick={onToggle}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-[#f97316]'}`
          }`}
      >
        <span>{activeVal || label}</span>
        <ChevronDown size={16} className={isOpen ? 'text-[#f97316]' : 'text-[#f97316]'} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-full min-w-[200px] rounded-lg shadow-xl border z-30 transition-none ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => onSelect(opt)}
              className={`px-4 py-3 text-[14px] font-bold cursor-pointer transition-none ${isDarkMode
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-50 last:border-0'
                }`}
            >
              {typeof opt === 'object' ? opt.name : opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExpiredMemberReport = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayStr = `${dd}-${mm}-${yyyy}`;

  const getFirstDayOfMonth = () => {
    const d = new Date();
    return `01-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const getLastDayOfMonth = () => {
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return `${String(lastDay).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [isRowsPerPageOpen, setIsRowsPerPageOpen] = useState(false);
  const rowsPerPageRef = useRef(null);

  const [trainers, setTrainers] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const token = adminInfo?.token;
        if (!token) return;

        const [trainerRes, empRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/api/admin/employees`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (trainerRes.ok) {
          const data = await trainerRes.json();
          setTrainers(data.map(t => ({ id: t._id, name: `${t.firstName} ${t.lastName}` })));
        }

        if (empRes.ok) {
          const data = await empRes.json();
          const empList = Array.isArray(data) ? data : (data.employees || []);
          setEmployees(empList.map(e => ({ id: e._id, name: `${e.firstName} ${e.lastName}` })));
        }

      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rowsPerPageRef.current && !rowsPerPageRef.current.contains(event.target)) {
        setIsRowsPerPageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOptions = {
    'Select Membership Type': ['All', 'General Training', 'Personal Training', 'Group Ex'],
    'Select Trainer': trainers.length > 0 ? [{ id: 'All', name: 'All' }, ...trainers] : [{ id: 'none', name: 'No Trainers Found' }],
    'Select Closed By': employees.length > 0 ? [{ id: 'All', name: 'All' }, ...employees] : [{ id: 'none', name: 'No Employees Found' }],
  };

  const [memberData, setMemberData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpiredReport, setIsExpiredReport] = useState(false); // Checkbox state
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchExpiringMembers = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const queryParams = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        search: searchQuery,
        status: isExpiredReport ? 'Expired' : 'ExpiringSoon',
        fromDate: fromDate?.split('-').reverse().join('-') || '',
        toDate: toDate?.split('-').reverse().join('-') || '',
        membershipType: filterValues['Select Membership Type'] || '',
        trainer: filterValues['Select Trainer']?.id || '',
        closedBy: filterValues['Select Closed By']?.id || ''
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/reports/membership-expiry?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      setMemberData(data.members || []);
      setTotalPages(data.pages || 1);
      setTotalRecords(data.total || 0);

    } catch (error) {
      console.error("Error fetching expiry report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiringMembers();
  }, [currentPage, rowsPerPage, isExpiredReport]); // Fetch on dependency change

  const handleApply = () => {
    setCurrentPage(1);
    fetchExpiringMembers();
  };

  const handleClear = () => {
    setSearchQuery('');
    setFromDate(getFirstDayOfMonth());
    setToDate(getLastDayOfMonth());
    setIsExpiredReport(false);
    setFilterValues({});
    setCurrentPage(1);
    // fetchData is called via effects or manual call
    setTimeout(fetchExpiringMembers, 100);
  };

  const toggleFilter = (label) => {
    setActiveFilter(activeFilter === label ? null : label);
  };

  const handleFilterSelect = (label, val) => {
    setFilterValues({ ...filterValues, [label]: val });
    setActiveFilter(null);
  };

  const getActiveVal = (label) => {
    const val = filterValues[label];
    if (!val) return null;
    return typeof val === 'object' ? val.name : val;
  };

  const statsRender = [
    { label: 'Members', value: totalRecords.toString(), icon: User, theme: 'blue' },
    { label: 'Balance Amount', value: '0', icon: User, theme: 'red' },
    { label: 'Business Opportunity Missed', value: '0', icon: User, theme: 'purple' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
    red: { bg: 'bg-red-500', shadow: 'shadow-red-500/20' },
    purple: { bg: 'bg-purple-600', shadow: 'shadow-purple-500/20' },
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <h1 className="text-[28px] font-black tracking-tight">{isExpiredReport ? 'Expired Member Report' : 'Expiring Soon Report'}</h1>

      {/* Stats Cards */}
      <div className="flex gap-4 transition-none">
        {statsRender.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          return (
            <div
              key={idx}
              className={`group p-6 rounded-lg flex items-center gap-4 transition-all duration-300 min-w-[260px] cursor-pointer border
                ${isDarkMode
                  ? `bg-[#1a1a1a] border-white/5 text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                  : `bg-[#fcfcfc] border-gray-100 text-gray-700 hover:text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                }`}
            >
              <div className={`p-4 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-[24px] font-black leading-none transition-colors duration-300 group-hover:text-white">{stat.value}</p>
                <p className="text-[13px] font-bold mt-1 text-gray-500 transition-colors duration-300 group-hover:text-white/80">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Row */}
      <div className="space-y-6 pt-4 transition-none">
        <div className="flex flex-wrap items-center gap-4">
          <SingleDatePicker
            value={fromDate}
            onSelect={setFromDate}
            isDarkMode={isDarkMode}
          />
          <SingleDatePicker
            value={toDate}
            onSelect={setToDate}
            isDarkMode={isDarkMode}
          />

          <div className="flex items-center gap-6 ml-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isExpiredReport}
                onChange={(e) => setIsExpiredReport(e.target.checked)}
                className="w-5 h-5 accent-[#f97316] border-gray-300 rounded"
              />
              <span className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Expired Report</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {Object.keys(filterOptions).map((label) => (
            <CustomFilterDropdown
              key={label}
              label={label}
              options={filterOptions[label]}
              isDarkMode={isDarkMode}
              isOpen={activeFilter === label}
              onToggle={() => toggleFilter(label)}
              onSelect={(val) => handleFilterSelect(label, val)}
              activeVal={getActiveVal(label)}
            />
          ))}

          <button onClick={handleApply} className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-black shadow-md transition-none active:scale-95">Apply</button>
          <button onClick={handleClear} className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-2.5 rounded-lg text-[15px] font-black shadow-md transition-none active:scale-95">Clear</button>

          <div className="relative flex-1 max-w-[400px]">
            <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className={`w-full pl-12 pr-4 py-3 border rounded-lg text-[15px] font-bold shadow-sm outline-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 transition-none">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-8 py-3.5 border rounded-lg text-[14px] font-black transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 shadow-md text-gray-700'}`}
          >
            <Download size={20} className="text-gray-600" />
            Generate XLS Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-5 border-b bg-white dark:bg-white/5 flex items-center gap-4 transition-none">
          <span className="text-[14px] font-black text-gray-800 dark:text-gray-200 tracking-tight">
            {isExpiredReport ? 'Expired Member List' : 'Expiring Soon List'}
          </span>
          <div className="flex items-center gap-3">
            {totalPages > 1 && <span className="text-xs text-gray-400">Page {currentPage} of {totalPages}</span>}
          </div>
        </div>
        <div className="overflow-x-auto transition-none">
          <table className="w-full text-left whitespace-nowrap transition-none">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Client Id</th>
                <th className="px-6 py-5">Name & Number</th>
                <th className="px-6 py-5">Membership Type</th>
                <th className="px-6 py-5">Plan Name</th>
                <th className="px-6 py-5 text-center">Start Date</th>
                <th className="px-6 py-5 text-center">End Date</th>
                <th className="px-6 py-5">Assign Trainer</th>
                <th className="px-6 py-5">Closed By</th>
                <th className="px-6 py-5">Membership Price</th>
                <th className="px-6 py-5">Discount Given</th>
                <th className="px-6 py-5">Paid Amount</th>
                <th className="px-6 py-5">Balance Due</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {isLoading ? (
                <tr><td colSpan="12" className="text-center py-10">Loading...</td></tr>
              ) : memberData.length === 0 ? (
                <tr><td colSpan="12" className="text-center py-10">No records found</td></tr>
              ) : (
                memberData.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-8">{row.memberId}</td>
                    <td className="px-6 py-8">
                      <div
                        onClick={() => navigate(`/admin/members/profile/${row._id}/memberships`)}
                        className="flex flex-col cursor-pointer group/name"
                      >
                        <span className="text-[#3b82f6] uppercase font-black group-hover/name:underline">{row.firstName} {row.lastName}</span>
                        <span className="text-[#3b82f6] text-[12px] font-bold mt-0.5">{row.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">General Training</td>
                    <td className="px-6 py-8">{row.packageName}</td>
                    <td className="px-6 py-8 text-center">{new Date(row.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-8 text-center">{new Date(row.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-8">{row.assignedTrainer?.firstName || '-'}</td>
                    <td className="px-6 py-8">{row.closedBy?.firstName || '-'}</td>
                    <td className="px-6 py-8 font-black">₹{row.totalAmount}</td>
                    <td className="px-6 py-8 font-black">₹{row.discount || 0}</td>
                    <td className="px-6 py-8 font-black text-green-600">₹{row.paidAmount}</td>
                    <td className="px-6 py-8 font-black text-red-500">₹{row.dueAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2 transition-none">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}
            >
              « Previous
            </button>
            <button className="w-10 h-10 border rounded-lg text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">{currentPage}</button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}
            >
              Next »
            </button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-black text-gray-500 uppercase tracking-tight">Rows per page</span>
            <div className="relative" ref={rowsPerPageRef}>
              <div
                onClick={() => setIsRowsPerPageOpen(!isRowsPerPageOpen)}
                className={`flex items-center justify-between w-[80px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-600 shadow-sm'}`}
              >
                <span className="text-[14px] font-bold">{rowsPerPage}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isRowsPerPageOpen ? 'rotate-180' : ''}`} />
              </div>
              {isRowsPerPageOpen && (
                <div className={`absolute bottom-full left-0 mb-1 w-full rounded-lg shadow-xl border z-30 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                  {[5, 10, 20, 50].map(n => (
                    <div
                      key={n}
                      onClick={() => { setRowsPerPage(n); setIsRowsPerPageOpen(false); }}
                      className={`px-3 py-2 text-[14px] font-bold cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-orange-50 hover:text-orange-600 text-gray-700'}`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
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

export default ExpiredMemberReport;
