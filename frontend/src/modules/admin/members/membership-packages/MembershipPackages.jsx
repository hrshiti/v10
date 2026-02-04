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
  X,
  Trash2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import AddPackageModal from './AddPackageModal';
import EditPackageModal from './EditPackageModal';
import { API_BASE_URL } from '../../../../config/api';

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

const DeletePlanModal = ({ isOpen, onClose, isDarkMode, onConfirm, packageName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[450px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-end ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <button onClick={onClose} className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-red-100">
              <Trash2 size={48} className="text-[#f97316]" />
            </div>
          </div>
          <h2 className={`text-[24px] font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Delete Plan?
          </h2>
          <p className={`text-[15px] mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Do you really want to delete "{packageName}"?
          </p>
          <p className={`text-[15px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            This process cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className={`px-6 py-6 flex justify-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            onClick={onConfirm}
            className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600 flex items-center gap-2"
          >
            <Trash2 size={18} />
            Yes, Delete Plan
          </button>
        </div>
      </div>
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
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionRef = useRef({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch packages from backend
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/packages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from real data
  const stats = [
    {
      label: 'General Training',
      value: packages.filter(p => p.type === 'general').length,
      icon: User,
      theme: 'blue'
    },
    {
      label: 'Personal Training',
      value: packages.filter(p => p.type === 'pt').length,
      icon: User,
      theme: 'emerald'
    },
    {
      label: 'Active Packages',
      value: packages.filter(p => p.active).length,
      icon: User,
      theme: 'purple'
    },
    {
      label: 'Total Packages',
      value: packages.length,
      icon: User,
      theme: 'red'
    },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20', ring: 'ring-blue-400' },
    emerald: { bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/20', ring: 'ring-emerald-400' },
    red: { bg: 'bg-red-500', shadow: 'shadow-red-500/20', ring: 'ring-red-400' },
    purple: { bg: 'bg-purple-600', shadow: 'shadow-purple-500/20', ring: 'ring-purple-400' },
  };

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
    (pkg._id && pkg._id.toString().includes(searchQuery))
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

  const toggleStatus = async (id) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const pkg = packages.find(p => p._id === id);
      const res = await fetch(`${API_BASE_URL}/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: !pkg.active })
      });

      if (res.ok) {
        setPackages(packages.map(pkg =>
          pkg._id === id ? { ...pkg, active: !pkg.active } : pkg
        ));
        setNotificationMessage('Plan Status Updated.');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedPackageId !== null) {
      try {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const token = adminInfo?.token;
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/admin/packages/${selectedPackageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          setPackages(packages.filter(pkg => pkg._id !== selectedPackageId));
          setNotificationMessage('Plan Deleted Successfully.');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
    setIsDeleteModalOpen(false);
    setActiveActionRow(null);
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <SuccessNotification
        message={notificationMessage}
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
        {stats.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          const isActive = false; // Add state logic if needed, for now just hover
          return (
            <div
              key={idx}
              className={`group p-6 rounded-xl flex items-center gap-5 transition-all duration-300 cursor-pointer border-2 
                ${isDarkMode
                  ? `bg-[#1a1a1a] border-white/5 text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                  : `bg-white border-gray-100 text-gray-700 hover:text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                }`}
            >
              <div className={`p-4 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white' : 'bg-[#f8f9fa] text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[28px] font-black leading-none transition-colors duration-300 group-hover:text-white">{stat.value}</p>
                <p className="text-[13px] font-black mt-1 uppercase tracking-tight text-gray-500 group-hover:text-white/80 transition-colors duration-300">{stat.label}</p>
              </div>
            </div>
          );
        })}
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
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-8 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500">Loading packages...</span>
                    </div>
                  </td>
                </tr>
              ) : currentPackages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-12 text-center text-gray-500">
                    No packages found
                  </td>
                </tr>
              ) : (
                currentPackages.map((row, idx) => (
                  <tr key={row._id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-8 py-8">{row._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-8 uppercase">
                      <div className="border border-[#f97316]/30 bg-[#fff7ed] dark:bg-[#f97316]/10 text-[#f97316] px-5 py-2.5 rounded-lg text-[13px] font-black inline-block tracking-tight leading-snug max-w-[300px]">
                        {row.name}
                      </div>
                    </td>
                    <td className="px-8 py-8">{row.durationValue} {row.durationType}</td>
                    <td className="px-8 py-8 text-center">{row.sessions}</td>
                    <td className="px-8 py-8 font-black tracking-tight">₹{row.baseRate?.toFixed(2) || '0.00'}</td>
                    <td className="px-8 py-8">
                      <div className="flex justify-center">
                        <div
                          onClick={() => toggleStatus(row._id)}
                          className={`relative w-24 h-12 rounded-lg cursor-pointer transition-all p-1 flex items-center shadow-inner ${row.active ? 'bg-[#059669]' : 'bg-[#64748b]'}`}
                        >
                          <span className={`absolute ${row.active ? 'left-4' : 'right-4'} text-[13px] font-black text-white pointer-events-none uppercase tracking-widest`}>
                            {row.active ? 'On' : 'Off'}
                          </span>
                          <div className={`w-8 h-8 rounded bg-white shadow-lg transform transition-transform duration-200 ${row.active ? 'translate-x-[52px]' : 'translate-x-0'}`} />
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
                              onClick={() => {
                                setSelectedPackage(row);
                                setIsEditModalOpen(true);
                              }}
                              className={`px-6 py-4 text-[15px] font-black border-b cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'}`}
                            >
                              Edit Package
                            </div>
                            <div
                              onClick={() => {
                                setSelectedPackageId(row._id);
                                setIsDeleteModalOpen(true);
                              }}
                              className={`px-6 py-4 text-[15px] font-black cursor-pointer hover:pl-8 transition-all text-[#ff4d4d] ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                            >
                              Delete
                            </div>
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
        onSuccess={fetchPackages}
      />

      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setActiveActionRow(null);
        }}
        isDarkMode={isDarkMode}
        onConfirm={handleDeleteConfirm}
        packageName={packages.find(pkg => pkg._id === selectedPackageId)?.name}
      />

      <EditPackageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setActiveActionRow(null);
        }}
        isDarkMode={isDarkMode}
        packageData={selectedPackage}
        onSuccess={fetchPackages}
      />
    </div>
  );
};

export default MembershipPackages;
