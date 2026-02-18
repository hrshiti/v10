import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Calendar,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../../../../config/api';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SingleDatePicker from '../../components/SingleDatePicker';
import GenerateReportModal from '../../components/GenerateReportModal';
import Pagination from '../../../../components/Pagination';

const PtReport = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('01-01-2024'); // Set to early 2024 to catch migrated data
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return `${lastDay}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  });
  const [selectedTrainer, setSelectedTrainer] = useState({ id: 'all', name: 'Select Trainer' });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isTrainerDropdownOpen, setIsTrainerDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const trainerRef = useRef(null);

  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const token = adminInfo?.token;
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/admin/employees/role/Trainer`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTrainers(data);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  const [ptData, setPtData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchPtData = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const queryParams = new URLSearchParams({
        type: 'PT',
        fromDate: fromDate?.split('-').reverse().join('-') || '',
        toDate: toDate?.split('-').reverse().join('-') || '',
        search: searchQuery,
        pageNumber: currentPage,
        pageSize: rowsPerPage
      });

      if (selectedTrainer.id !== 'all') {
        queryParams.append('trainer', selectedTrainer.id);
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/reports/sales?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const transformed = (data.sales || []).map(sale => ({
          id: sale.memberId?._id,
          trainerName: sale.trainerId ? `${sale.trainerId.firstName} ${sale.trainerId.lastName}` : (sale.memberId?.assignedTrainer ? `${sale.memberId.assignedTrainer.firstName} ${sale.memberId.assignedTrainer.lastName}` : 'N/A'),
          customerName: sale.memberId ? `${sale.memberId.firstName} ${sale.memberId.lastName}` : 'N/A',
          customerNumber: sale.memberId ? sale.memberId.mobile : 'N/A',
          packageName: sale.packageName || sale.packageId?.name || sale.memberId?.packageName || 'PT-Plan',
          sessions: sale.packageId?.sessions || sale.memberId?.packageId?.sessions || '-',
          startDate: sale.memberId?.startDate ? new Date(sale.memberId.startDate).toLocaleDateString() : 'N/A',
          endDate: sale.memberId?.endDate ? new Date(sale.memberId.endDate).toLocaleDateString() : 'N/A',
          amount: sale.amount,
          status: 'Paid'
        }));
        setPtData(transformed);
        setTotalPages(data.pages || 1);
        setTotalResults(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching PT data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPtData();
  }, [fromDate, toDate, currentPage, rowsPerPage]);

  const fetchExportData = async () => {
    setIsExportLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const queryParams = new URLSearchParams({
        type: 'PT',
        fromDate: fromDate?.split('-').reverse().join('-') || '',
        toDate: toDate?.split('-').reverse().join('-') || '',
        search: searchQuery,
        pageSize: 10000 // All records
      });

      if (selectedTrainer.id !== 'all') {
        queryParams.append('trainer', selectedTrainer.id);
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/reports/sales?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const formatted = (data.sales || []).map(sale => ({
          'Trainer Name': sale.trainerId ? `${sale.trainerId.firstName} ${sale.trainerId.lastName}` : (sale.memberId?.assignedTrainer ? `${sale.memberId.assignedTrainer.firstName} ${sale.memberId.assignedTrainer.lastName}` : 'N/A'),
          'Plan Name': sale.packageName || sale.packageId?.name || sale.memberId?.packageName || 'PT-Plan',
          'Sessions': sale.packageId?.sessions || sale.memberId?.packageId?.sessions || '-',
          'Customer Name': sale.memberId ? `${sale.memberId.firstName} ${sale.memberId.lastName}` : 'N/A',
          'Customer Number': sale.memberId ? sale.memberId.mobile : 'N/A',
          'Start Date': sale.memberId?.startDate ? new Date(sale.memberId.startDate).toLocaleDateString() : 'N/A',
          'Expiry Date': sale.memberId?.endDate ? new Date(sale.memberId.endDate).toLocaleDateString() : 'N/A',
          'Amount': sale.amount,
          'Status': 'Paid'
        }));
        setExportData(formatted);
        setIsReportModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching export data:", error);
    } finally {
      setIsExportLoading(false);
    }
  };

  useEffect(() => {
    fetchPtData();
  }, [fromDate, toDate]);

  const handleApply = () => {
    fetchPtData();
  };

  const handleClear = () => {
    setSearchQuery('');
    const d = new Date();
    const firstDay = '01-01-2024';
    const lastDayNum = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const lastDay = `${lastDayNum}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;

    setFromDate(firstDay);
    setToDate(lastDay);
    setSelectedTrainer({ id: 'all', name: 'Select Trainer' });
    setTimeout(fetchPtData, 100);
  };

  const filteredData = ptData;
  // Filtering is now handled on backend via fetchPtData

  const stats = [
    { label: 'Total PT Records', value: totalResults.toString(), icon: User, theme: 'blue' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20' },
  };

  const scrollTable = (direction) => {
    if (tableContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">PT Report</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 transition-none">
        {stats.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          return (
            <div
              key={idx}
              className={`group p-5 rounded-lg flex items-center gap-4 transition-all duration-300 min-w-[240px] border cursor-pointer
                ${isDarkMode
                  ? `bg-[#1a1a1a] border-white/5 text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                  : `bg-[#f8f9fa] border-gray-100 text-gray-700 hover:text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                }`}
            >
              <div className={`p-3 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white' : 'bg-white text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>
                <stat.icon size={28} />
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

          <div className="relative min-w-[200px]" ref={trainerRef}>
            <div
              onClick={() => setIsTrainerDropdownOpen(!isTrainerDropdownOpen)}
              className={`flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-all ${isDarkMode
                ? 'bg-[#1a1a1a] border-white/10 text-white'
                : isTrainerDropdownOpen ? 'border-[#f97316] text-[#f97316] bg-white' : 'bg-white border-gray-200 text-gray-500 shadow-sm'
                }`}
            >
              <span className="text-[14px] font-bold">{selectedTrainer.name}</span>
              <ChevronDown size={14} className={isTrainerDropdownOpen ? 'text-[#f97316]' : 'text-gray-400'} />
            </div>

            {isTrainerDropdownOpen && (
              <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                <div
                  onClick={() => { setSelectedTrainer({ id: 'all', name: 'All Trainers' }); setIsTrainerDropdownOpen(false); }}
                  className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                    ? 'text-gray-300 hover:bg-white/5'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]'
                    }`}
                >
                  All Trainers
                </div>
                {trainers.map(trainer => (
                  <div
                    key={trainer._id}
                    onClick={() => { setSelectedTrainer({ id: trainer._id, name: `${trainer.firstName} ${trainer.lastName}` }); setIsTrainerDropdownOpen(false); }}
                    className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                      ? 'text-gray-300 hover:bg-white/5'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]'
                      }`}
                  >
                    {trainer.firstName} {trainer.lastName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleApply} className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-black transition-none active:scale-95 shadow-md hover:bg-orange-600">Apply</button>
          <button onClick={handleClear} className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-black transition-none active:scale-95 shadow-md hover:bg-orange-600">Clear</button>
        </div>

        <div className="flex justify-between items-center transition-none gap-4">
          <div className="relative w-full max-w-[400px]">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className={`w-full pl-11 pr-4 py-2.5 border rounded-lg text-[14px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-black placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={fetchExportData}
            disabled={isExportLoading}
            className={`flex items-center gap-2 px-6 py-2.5 border rounded-lg text-[14px] font-black transition-none active:scale-95 whitespace-nowrap ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-100 shadow-md text-gray-700'}`}
          >
            {isExportLoading ? (
              <Loader2 size={18} className="animate-spin text-orange-500" />
            ) : (
              <Download size={18} className="text-gray-500" />
            )}
            {isExportLoading ? 'Preparing...' : 'Generate XLS Report'}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-4 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-4 border-b flex justify-between items-center bg-white dark:bg-white/5 transition-none">
          <div className="flex items-center gap-4 transition-none">
            <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">PT Report</span>
            <div className="flex items-center gap-2 ml-4 transition-none">
              <button onClick={() => scrollTable('left')} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollTable('right')} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-none text-gray-400">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div ref={tableContainerRef} className="overflow-x-auto scroll-smooth transition-none">
          <table className="min-w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Trainer Name</th>
                <th className="px-6 py-5">Plan Name</th>
                <th className="px-6 py-5 text-center">Sessions</th>
                <th className="px-6 py-5">Customer Name & Number</th>
                <th className="px-6 py-5">Start Date</th>
                <th className="px-6 py-5">Expiry Date</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {isLoading ? (
                <tr><td colSpan="8" className="text-center py-10">Loading PT data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-10">No PT records found</td></tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-8">{row.trainerName}</td>
                    <td className="px-6 py-8">
                      <span className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 font-black">
                        {row.packageName}
                      </span>
                    </td>
                    <td className="px-6 py-8 text-center font-black">{row.sessions}</td>
                    <td className="px-6 py-8">
                      <div
                        onClick={() => navigate(`/admin/members/profile/${row.id}/memberships`)}
                        className="flex flex-col transition-none cursor-pointer group/name"
                      >
                        <span className="text-[#3b82f6] uppercase font-black group-hover/name:underline">{row.customerName}</span>
                        <span className="text-[#3b82f6] text-[12px] font-bold mt-0.5">{row.customerNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">{row.startDate}</td>
                    <td className="px-6 py-8">
                      <span className={`font-black ${new Date(row.endDate.split('/').reverse().join('-')) < new Date() ? 'text-red-500' : 'text-emerald-500'}`}>
                        {row.endDate}
                      </span>
                    </td>
                    <td className="px-6 py-8 font-black">₹{row.amount?.toFixed(2)}</td>
                    <td className="px-6 py-8">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-black uppercase">{row.status}</span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex justify-center">
                        <button
                          onClick={() => navigate(`/admin/members/profile/${row.id}/membership/renew`, { state: { category: 'Personal Training' } })}
                          className="px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-white rounded-lg text-xs font-black uppercase transition-all shadow-md active:scale-95"
                        >
                          Renew
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isDarkMode={isDarkMode}
            size="small"
          />

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-black text-gray-500 uppercase tracking-tight">Rows per page</span>
            <div className="relative transition-none">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                className={`appearance-none pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-black shadow-sm'}`}
              >
                {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setExportData([]);
        }}
        data={exportData}
        filename={`PT_Report_${fromDate}_to_${toDate}`}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default PtReport;
