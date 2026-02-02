import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import AddPackageModal from './AddPackageModal';

// --- Reusable Components ---

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

const SuccessNotification = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed top-24 right-8 z-[200] animate-in fade-in slide-in-from-right-10 duration-300">
      <div className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex items-center gap-4 min-w-[320px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-black text-gray-700">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500">
          <X size={20} />
        </button>
        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/20 w-full">
          <div
            className="h-full bg-emerald-500"
            style={{
              animation: 'progress 3s linear forwards',
              width: '0%'
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

// --- Main Component ---

const MembershipPackages = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionRef = useRef({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [packages, setPackages] = useState([
    { id: 13590, name: 'Complementary', duration: '12 Months', sessions: 360, price: '0.00', status: true },
    { id: 13576, name: 'Anniversary Package But 1 and get 1 Free', duration: '12 Months', sessions: 360, price: '9000.00', status: false },
    { id: 13575, name: 'GYM WORKOUT', duration: '45 Days', sessions: 45, price: '4000.00', status: false },
    { id: 13574, name: 'GYM WORKOUT', duration: '15 Months', sessions: 450, price: '12000.00', status: false },
    { id: 13573, name: 'GYM WORKOUT', duration: '13 Months', sessions: 390, price: '10500.00', status: false },
  ]);

  const stats = [
    { label: 'General Training', value: 9, icon: User, color: 'bg-blue-600', active: true },
    { label: 'Personal Training', value: 9, icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Complete Fitness', value: 0, icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
    { label: 'Group Ex', value: 0, icon: User, color: isDarkMode ? 'bg-white/5' : 'bg-gray-50' },
  ];

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

  // Filtering and Pagination
  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.id.toString().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredPackages.length / rowsPerPage);
  const currentPackages = filteredPackages.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset page when search or rowsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage]);

  const toggleStatus = (id) => {
    setPackages(packages.map(pkg =>
      pkg.id === id ? { ...pkg, status: !pkg.status } : pkg
    ));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <SuccessNotification
        message="Plan Status Updated."
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight tracking-tight uppercase">Memberships Package</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#f97316] text-white px-8 py-3 rounded-lg flex items-center gap-3 text-[15px] font-bold shadow-lg active:scale-95 transition-none hover:bg-orange-600"
        >
          <Plus size={22} strokeWidth={3} />
          Add Package
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-none">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl flex items-center gap-5 transition-none cursor-pointer border-2 ${stat.active ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : (isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-sm hover:shadow-md')}`}>
            <div className={`p-4 rounded-xl ${stat.active ? 'bg-white/20' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-[#f8f9fa] text-gray-400')}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[28px] font-black leading-none">{stat.value}</p>
              <p className={`text-[13px] font-black mt-1 uppercase tracking-tight ${stat.active ? 'text-white/80' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-sm transition-none pt-4">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-xl overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-6 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5 font-black uppercase tracking-wider text-[14px]">
          Memberships Package
        </div>
        <div className="overflow-x-auto scroll-smooth custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-[#fcfcfc] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-8 py-6 uppercase tracking-wider">ID</th>
                <th className="px-8 py-6 uppercase tracking-wider">Package Name</th>
                <th className="px-8 py-6 uppercase tracking-wider">Duration</th>
                <th className="px-8 py-6 uppercase tracking-wider text-center">Sessions</th>
                <th className="px-8 py-6 uppercase tracking-wider">Price</th>
                <th className="px-8 py-6 uppercase tracking-wider text-center">Active / Inactive</th>
                <th className="px-8 py-6 w-10">Action</th>
              </tr>
            </thead>
            <tbody className={`text-[14px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {currentPackages.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-8 py-8">{row.id}</td>
                  <td className="px-8 py-8 uppercase">
                    <div className="border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] px-5 py-2.5 rounded-lg text-[13px] font-black inline-block tracking-tight leading-snug max-w-[300px]">
                      {row.name}
                    </div>
                  </td>
                  <td className="px-8 py-8">{row.duration}</td>
                  <td className="px-8 py-8 text-center">{row.sessions}</td>
                  <td className="px-8 py-8 font-black tracking-tight">₹{row.price}</td>
                  <td className="px-8 py-8">
                    <div className="flex justify-center">
                      <div
                        onClick={() => toggleStatus(row.id)}
                        className={`relative w-24 h-12 rounded-lg cursor-pointer transition-all p-1 flex items-center shadow-inner ${row.status ? 'bg-[#059669]' : 'bg-[#64748b]'}`}
                      >
                        <span className={`absolute ${row.status ? 'left-4' : 'right-4'} text-[13px] font-black text-white pointer-events-none uppercase tracking-widest`}>
                          {row.status ? 'On' : 'Off'}
                        </span>
                        <div className={`w-8 h-8 rounded bg-white shadow-lg transform transition-transform duration-200 ${row.status ? 'translate-x-[52px]' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center relative" ref={el => actionRef.current[idx] = el}>
                    <button
                      onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                      className="text-gray-400 hover:text-black dark:hover:text-white transition-none"
                    >
                      <MoreVertical size={24} />
                    </button>

                    {activeActionRow === idx && (
                      <div className={`absolute right-12 top-12 w-[220px] rounded-xl shadow-2xl border z-50 overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 font-bold'}`}>
                        <div className="py-2">
                          <div
                            onClick={() => setActiveActionRow(null)}
                            className={`px-6 py-4 text-[15px] font-black border-b cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'}`}
                          >
                            Edit Package
                          </div>
                          <div
                            onClick={() => setActiveActionRow(null)}
                            className={`px-6 py-4 text-[15px] font-black cursor-pointer hover:pl-8 transition-all text-[#ff4d4d] ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                          >
                            Delete
                          </div>
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
        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              « Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-11 h-11 border rounded-xl text-[13px] font-black transition-none ${currentPage === i + 1 ? 'bg-[#f97316] text-white shadow-lg' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next »
            </button>
          </div>

          <div className="flex items-center gap-5 transition-none">
            <span className="text-[15px] font-black text-gray-500 uppercase tracking-tight">Rows per page</span>
            <RowsPerPageDropdown
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
      <AddPackageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default MembershipPackages;
