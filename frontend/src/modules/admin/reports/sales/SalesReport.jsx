import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Wallet,
  CreditCard,
  Banknote,
  DollarSign
} from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';
import { useOutletContext } from 'react-router-dom';
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
    <div className="relative min-w-[180px]" ref={dropdownRef}>
      <div
        onClick={onToggle}
        className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none cursor-pointer flex items-center justify-between transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : `bg-white ${isOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-200 text-[#f97316]'}`
          }`}
      >
        <span className="truncate">{activeVal || label}</span>
        <ChevronDown size={16} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
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
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SalesReport = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('01-02-2026');
  const [toDate, setToDate] = useState('01-02-2026');
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
          setTrainers(data.map(t => `${t.firstName} ${t.lastName}`));
        }

        if (empRes.ok) {
          const data = await empRes.json();
          // Assuming employees api returns { employees: [...] } or [...]
          const empList = Array.isArray(data) ? data : (data.employees || []);
          setEmployees(empList.map(e => `${e.firstName} ${e.lastName}`));
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
    'Select Tax Type': ['Without GST', 'With GST'],
    'Select Membership Type': ['General Training', 'Personal Training', 'Group Ex'],
    'Select Sale Type': ['New Sale', 'Renewal', 'Upgrade'],
    'Select Trainer': trainers.length > 0 ? trainers : ['No Trainers Found'],
    'Select Closed By': employees.length > 0 ? employees : ['No Employees Found'],
    'Select Handled By': employees.length > 0 ? employees : ['No Employees Found'],
    'Payment Mode': ['Cash', 'UPI', 'Google Pay', 'Card', 'Cheque'],
  };

  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    invoiceCount: 0,
    totalAmount: 0,
    onlineTotal: 0,
    cashTotal: 0,
    taxAmount: 0
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Sales Data
  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const queryParams = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        fromDate: fromDate?.split('-').reverse().join('-') || '', // Convert DD-MM-YYYY to YYYY-MM-DD
        toDate: toDate?.split('-').reverse().join('-') || '',
        search: searchQuery,
      });

      // Add dynamic filters
      if (filterValues['Select Sale Type']) queryParams.append('type', filterValues['Select Sale Type']);
      if (filterValues['Payment Mode']) queryParams.append('paymentMode', filterValues['Payment Mode']);

      // Handle ID based filters if we had IDs, currently using names so might need adjustment or rely on backend search
      // Ideally UI should store ID in filterValues, here assuming filterValues stores name strings as per current UI
      // TODO: Update Filter Dropdowns to store IDs to pass to backend for more accuracy

      const res = await fetch(`${API_BASE_URL}/api/admin/reports/sales?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      setSalesData(data.sales || []);
      setStats(data.stats || {});
      setTotalPages(data.pages || 1);

    } catch (error) {
      console.error("Error fetching sales report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [currentPage, rowsPerPage]); // Fetch on page change

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchSalesData();
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setSearchQuery('');
    setFromDate('01-02-2026'); // Reset to default or today
    setToDate('01-02-2026');
    setCurrentPage(1);
    setTimeout(fetchSalesData, 100);
  };

  const statCards = [
    { label: 'Invoice Generated', value: stats.invoiceCount || 0 },
    { label: 'Total Amount', value: `₹${stats.totalAmount?.toFixed(2) || '0.00'}` },
    { label: 'Paid Amount', value: `₹${stats.totalAmount?.toFixed(2) || '0.00'}` }, // Assuming totalAmount is paid amount for now
    { label: 'Tax Amount', value: `₹${stats.taxAmount?.toFixed(2) || '0.00'}` },
    { label: 'Online', value: `₹${stats.onlineTotal?.toFixed(2) || '0.00'}` },
    { label: 'Cash', value: `₹${stats.cashTotal?.toFixed(2) || '0.00'}` },
  ];

  const salesTypeRender = (type) => {
    let color = 'text-gray-600';
    if (type === 'New Membership' || type === 'New Sale') color = 'text-green-600';
    if (type === 'Renewal') color = 'text-blue-600';
    if (type === 'Upgrade') color = 'text-purple-600';
    return <span className={color}>{type}</span>;
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <h1 className="text-[28px] font-black tracking-tight">Sales Report</h1>

      {/* Stats Cards Grid - Matching Image 1 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-none">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-lg flex items-center gap-4 border transition-none min-h-[90px] ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-[#fcfcfc] border-gray-100 shadow-sm'}`}>
            <div className={`p-3 rounded-lg bg-gray-100/50 dark:bg-white/5`}>
              <Wallet size={24} className="text-gray-300" />
            </div>
            <div>
              <p className="text-[20px] font-black leading-none mb-1">{stat.value}</p>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="space-y-4 pt-4 transition-none">
        <div className="flex flex-wrap items-center gap-4">
          <SingleDatePicker value={fromDate} onSelect={setFromDate} isDarkMode={isDarkMode} />
          <SingleDatePicker value={toDate} onSelect={setToDate} isDarkMode={isDarkMode} />

          <CustomFilterDropdown
            label="Select Tax Type"
            options={filterOptions['Select Tax Type']}
            isDarkMode={isDarkMode}
            isOpen={activeFilter === 'Select Tax Type'}
            onToggle={() => toggleFilter('Select Tax Type')}
            onSelect={(val) => handleFilterSelect('Select Tax Type', val)}
            activeVal={filterValues['Select Tax Type']}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {['Select Membership Type', 'Select Sale Type', 'Select Trainer', 'Select Closed By', 'Select Handled By', 'Payment Mode'].map((label) => (
            <CustomFilterDropdown
              key={label}
              label={label}
              options={filterOptions[label]}
              isDarkMode={isDarkMode}
              isOpen={activeFilter === label}
              onToggle={() => toggleFilter(label)}
              onSelect={(val) => handleFilterSelect(label, val)}
              activeVal={filterValues[label]}
            />
          ))}

          <button onClick={handleApplyFilters} className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[15px] font-black shadow-md transition-none active:scale-95">Apply</button>
          <button onClick={handleClearFilters} className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[15px] font-black shadow-md transition-none active:scale-95">Clear</button>
        </div>

        <div className="flex justify-between items-center pt-2 transition-none">
          <div className="relative flex-1 max-w-[400px]">
            <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Invoice or Name"
              className={`w-full pl-12 pr-4 py-3 border rounded-lg text-[15px] font-bold shadow-sm outline-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className={`flex items-center gap-2 px-8 py-3.5 border rounded-lg text-[14px] font-black transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 shadow-md text-gray-700'}`}
          >
            <Download size={20} className="text-gray-600" />
            Generate XLS Report
          </button>
        </div>
      </div>

      {/* Table Section with Horizontal Scaling - Matching Image 2, 3 */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-5 border-b bg-white dark:bg-white/5 flex items-center gap-4 transition-none">
          <span className="text-[14px] font-black text-gray-800 dark:text-gray-200 tracking-tight">
            Sales Report
          </span>
          <div className="flex items-center gap-3">
            {/* Pagination Arrows */}
            {totalPages > 1 && <span className="text-xs text-gray-400">Page {currentPage} of {totalPages}</span>}
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div className="overflow-x-auto scroll-smooth custom-scrollbar transition-none">
          <table className="min-w-full text-left whitespace-nowrap transition-none">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Client Id</th>
                <th className="px-6 py-5">Name & Number</th>
                <th className="px-6 py-5">Membership Type</th>
                <th className="px-6 py-5">Plan Name</th>
                <th className="px-6 py-5">Package Start Date</th>
                <th className="px-6 py-5 text-center">Duration</th>
                <th className="px-6 py-5">Invoice Number <span className="text-[10px] ml-1 opacity-50">▲</span></th>
                <th className="px-6 py-5">Paid Amount</th>
                <th className="px-6 py-5">SGST</th>
                <th className="px-6 py-5">CGST</th>
                <th className="px-6 py-5 text-center">Payment Mode</th>
                <th className="px-6 py-5">Invoice Amount</th>
                <th className="px-6 py-5">Discount</th>
                <th className="px-6 py-5">Balance Amount</th>
                <th className="px-6 py-5">Closed By</th>
                <th className="px-6 py-5 text-center">Handle By</th>
                <th className="px-6 py-5">Close Date/Invoice Date</th>
                <th className="px-6 py-5">Payment Date</th>
                <th className="px-6 py-5">Assign Trainer</th>
                <th className="px-6 py-5">Sale Types</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {isLoading ? (
                <tr><td colSpan="20" className="text-center py-10">Loading...</td></tr>
              ) : salesData.length === 0 ? (
                <tr><td colSpan="20" className="text-center py-10">No sales records found</td></tr>
              ) : (
                salesData.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-8">{row.memberId?.memberId || 'N/A'}</td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-[#3b82f6] uppercase font-black cursor-pointer hover:underline">
                          {row.memberId?.firstName} {row.memberId?.lastName}
                        </span>
                        <span className="text-[#3b82f6] text-[12px] mt-0.5">{row.memberId?.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 text-[13px] font-black inline-block">
                        {row.type?.includes('PT') ? 'Personal Training' : 'General Training'}
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 text-[13px] font-black inline-block">
                        {row.memberId?.packageName || row.description}
                      </div>
                    </td>
                    <td className="px-6 py-8">{row.memberId?.startDate ? new Date(row.memberId.startDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-8 text-center">{row.memberId?.durationMonths || 0} Months</td>
                    <td className="px-6 py-8 text-blue-500 font-black cursor-pointer hover:underline">{row.invoiceNumber}</td>
                    <td className="px-6 py-8 font-black">₹{row.amount}</td>
                    <td className="px-6 py-8 font-black">₹{(row.taxAmount / 2).toFixed(2)}</td>
                    <td className="px-6 py-8 font-black">₹{(row.taxAmount / 2).toFixed(2)}</td>
                    <td className="px-6 py-8 text-center">{row.paymentMode}</td>
                    <td className="px-6 py-8 font-black">₹{row.subTotal || row.amount}</td>
                    <td className="px-6 py-8 font-black">₹{row.discountAmount || 0}</td>
                    <td className="px-6 py-8 font-black text-red-500">₹0</td> {/* Assuming balance handled in dues report */}
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span>{row.closedBy?.firstName} {row.closedBy?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-center">{row.trainerId?.firstName} {row.trainerId?.lastName}</td>
                    <td className="px-6 py-8">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="px-6 py-8">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="px-6 py-8">{row.trainerId?.firstName} {row.trainerId?.lastName}</td>
                    <td className="px-6 py-8 text-gray-500">{salesTypeRender(row.type)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section - Matching Image 2 */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2 transition-none">
            <button className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">1</button>
            <button className={`px-5 py-2.5 border rounded-lg text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>Next »</button>
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
                <div className={`absolute bottom-full left-0 mb-1 w-full rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
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

export default SalesReport;
