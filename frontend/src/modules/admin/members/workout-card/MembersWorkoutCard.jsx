import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  X,
  Utensils
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

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
        className={`flex items-center justify-between w-[90px] px-4 py-2 border rounded-xl cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white text-gray-500 border-gray-300 shadow-sm'
          }`}
      >
        <span className="text-[14px] font-bold">{rowsPerPage}</span>
        <ChevronDown size={14} className="text-gray-400" />
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

const CreateWorkoutModal = ({ isOpen, onClose, isDarkMode }) => {
  const [privacyMode, setPrivacyMode] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[550px] rounded-xl shadow-2xl overflow-visible ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-[#fcfcfc] border-gray-100'}`}>
          <div className="flex items-center gap-3 text-black">
            <Utensils size={20} fill="currentColor" />
            <h2 className="text-[18px] font-black uppercase tracking-tight">Create Workout Plan</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-none">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          <div>
            <label className={`block text-[14px] font-black mb-3 text-gray-700 dark:text-gray-300`}>Workout Name</label>
            <input
              type="text"
              placeholder="Type workout name name here..."
              className={`w-full px-5 py-4 border rounded-xl text-[15px] font-medium outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400 focus:border-orange-500'}`}
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className={`block text-[14px] font-black mb-3 text-gray-700 dark:text-gray-300`}>Privacy Mode</label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-5 py-4 border rounded-xl text-[15px] font-bold flex justify-between items-center cursor-pointer transition-none ${isDarkMode
                  ? 'bg-[#1a1a1a] border-white/10 text-white'
                  : isDropdownOpen ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-[#f97316]/30 text-[#f97316] shadow-sm'
                }`}
            >
              <span className={privacyMode ? (isDarkMode ? 'text-white' : 'text-black') : 'text-orange-500/60'}>
                {privacyMode || 'Select'}
              </span>
              <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#f97316]' : 'text-black'}`} />
            </div>

            {isDropdownOpen && (
              <div className={`absolute top-full left-0 w-[150px] mt-1 rounded-xl shadow-2xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
                }`}>
                {['Public', 'Private'].map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setPrivacyMode(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-5 py-3.5 text-[15px] font-black cursor-pointer transition-colors ${isDarkMode
                        ? 'text-gray-300 hover:bg-white/5'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-6 border-t flex justify-end gap-4 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            onClick={onClose}
            className={`px-8 py-3 rounded-xl text-[15px] font-black border transition-none active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancel
          </button>
          <button className="bg-[#f97316] text-white px-10 py-3 rounded-xl text-[15px] font-black shadow-lg active:scale-95 transition-none hover:bg-orange-600">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const MembersWorkoutCard = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Public');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQueries, setSearchQueries] = useState({});

  const workoutPlans = [
    { name: 'WEIGHT GAIN LEVEL 2 (NEW)' },
    { name: 'WEIGHT GAIN LEVEL 3 (NEW)' },
    { name: 'WEIGHT GAIN LEVEL 1 (NEW)' },
    { name: 'weight gain level 2' },
    { name: 'weight gain level 1' }
  ];

  const handleSearchChange = (idx, value) => {
    setSearchQueries(prev => ({ ...prev, [idx]: value }));
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight uppercase">Members Workout Card</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#f97316] text-white px-8 py-3 rounded-lg flex items-center gap-3 text-[15px] font-black shadow-lg active:scale-95 transition-none hover:bg-orange-600"
        >
          <Plus size={22} strokeWidth={3} />
          Create Workout
        </button>
      </div>

      {/* Tabs */}
      <div className={`border-b-2 border-gray-100 dark:border-white/5 flex transition-none`}>
        <button
          onClick={() => setActiveTab('Public')}
          className={`px-40 py-5 text-[15px] font-black transition-none border-b-4 -mb-[2px] ${activeTab === 'Public' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Public
        </button>
        <button
          onClick={() => setActiveTab('Private')}
          className={`px-40 py-5 text-[15px] font-black transition-none border-b-4 -mb-[2px] ${activeTab === 'Private' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Private
        </button>
      </div>

      {activeTab === 'Public' ? (
        <>
          <p className="text-[14px] font-black text-gray-500 pt-2 tracking-tight uppercase">All Workout Plan(s) (20)</p>

          {/* Workout List */}
          <div className="space-y-4 transition-none">
            {workoutPlans.map((plan, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border flex items-center justify-between transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-inner' : 'bg-[#fcfcfc] border-gray-200/60 shadow-sm'}`}>
                <span className={`text-[17px] font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>{plan.name}</span>

                <div className="flex items-center gap-6 transition-none">
                  <div className="relative min-w-[280px]">
                    <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Members"
                      value={searchQueries[idx] || ''}
                      onChange={(e) => handleSearchChange(idx, e.target.value)}
                      className={`w-full pl-12 pr-10 py-3 border rounded-xl text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-orange-500'}`}
                    />
                    <ChevronDown size={18} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                  </div>

                  <ChevronDown size={24} className="text-gray-400 cursor-pointer hover:text-black transition-colors" />
                  <MoreVertical size={24} className="text-gray-400 cursor-pointer hover:text-black transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-none`}>
            <div className="flex flex-wrap items-center gap-3">
              <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-sm`}>« Previous</button>
              <button className="w-11 h-11 border rounded-xl text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">1</button>
              {[2, 3, 4].map(num => (
                <button key={num} className={`w-11 h-11 border rounded-xl text-[13px] font-bold transition-none border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-sm`}>
                  {num}
                </button>
              ))}
              <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-sm`}>Next »</button>
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
        </>
      ) : (
        /* Image 4 State: Private tab when empty */
        <div className="space-y-6 pt-2">
          <p className="text-[14px] font-black text-gray-500 tracking-tight uppercase">All Workout Plan(s) (0)</p>

          <div className={`pt-4 flex flex-col md:flex-row justify-between items-center gap-6 transition-none`}>
            <div className="flex flex-wrap items-center gap-3">
              <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-400 bg-white/50 cursor-not-allowed`}>« Previous</button>
              <button className="w-11 h-11 border rounded-xl text-[13px] font-black bg-[#f97316] text-white shadow-lg transition-none">1</button>
              <button className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-400 bg-white/50 cursor-not-allowed`}>Next »</button>
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
      )}

      <CreateWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default MembersWorkoutCard;
