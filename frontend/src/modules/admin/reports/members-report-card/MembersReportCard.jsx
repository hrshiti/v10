import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import SingleDatePicker from '../../components/SingleDatePicker';

const AddReportCardModal = ({ isOpen, onClose, isDarkMode }) => {
  const [formData, setFormData] = useState({
    date: '01-02-2026'
  });

  if (!isOpen) return null;

  const InputGroup = ({ label, placeholder, unit, type = "text", example }) => (
    <div className="space-y-1.5 flex-1 min-w-[200px]">
      <label className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      <div className="flex">
        {unit && (
          <div className={`px-4 py-3 border-y border-l rounded-l-lg text-[14px] font-black flex items-center justify-center transition-none min-w-[60px] ${isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-gray-500 text-white border-gray-200'}`}>
            {unit}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border text-[14px] font-bold outline-none transition-none ${unit ? 'rounded-r-lg' : 'rounded-lg'} ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
        />
      </div>
      {example && <p className="text-[11px] text-gray-400 font-bold">Example : {example}</p>}
    </div>
  );

  const DropdownGroup = ({ label, placeholder, unit, example }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(unit);
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
      <div className="space-y-1.5 flex-1 min-w-[200px]" ref={dropdownRef}>
        <label className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
        <div className="flex">
          {unit && (
            <div className="relative">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-3 border-y border-l rounded-l-lg text-[14px] font-black flex items-center justify-center gap-1 transition-none min-w-[70px] cursor-pointer ${isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-gray-500 text-white border-gray-200'}`}
              >
                {selectedUnit} <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              {isOpen && (
                <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow-xl border z-[60] overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                  {['In', 'Cm'].map((u) => (
                    <div
                      key={u}
                      onClick={() => { setSelectedUnit(u); setIsOpen(false); }}
                      className={`px-4 py-2.5 text-[14px] font-black cursor-pointer transition-none ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b last:border-0'}`}
                    >
                      {u}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <input
            placeholder={placeholder}
            className={`w-full px-4 py-3 border text-[14px] font-bold outline-none transition-none ${unit ? 'rounded-r-lg' : 'rounded-lg'} ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
          />
        </div>
        {example && <p className="text-[11px] text-gray-400 font-bold">Example : {example}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl transition-none ${isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10 transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-100/80 backdrop-blur-md'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded bg-black text-white`}>
              <Plus size={18} strokeWidth={3} />
            </div>
            <h2 className={`text-[18px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add Report Card</h2>
          </div>
          <button onClick={onClose} className={`transition-none ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Details Section */}
          <div className={`p-6 rounded-xl border space-y-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} border-b pb-4 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>Basic Details</h3>

            <div className="space-y-1.5">
              <label className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Member Name</label>
              <input
                placeholder="Search Member"
                className={`w-full px-4 py-3 border rounded-lg text-[14px] font-bold outline-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <InputGroup label="Age*" placeholder="Age" />
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date*</label>
                <SingleDatePicker value={formData.date} onSelect={(val) => setFormData({ ...formData, date: val })} isDarkMode={isDarkMode} />
              </div>
            </div>

            <InputGroup label="Skeletal Muscles*" placeholder="Measurement" />

            <div className="space-y-1.5">
              <label className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Height*</label>
              <div className="relative">
                <select className={`w-full px-4 py-3 border rounded-lg text-[14px] font-bold outline-none appearance-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-200 text-black'}`}>
                  <option>Select</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-3.5 text-black" />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <InputGroup label="Weight*" placeholder="Weight" unit="kg" />
              <InputGroup label="Body Fat %*" placeholder="Body Fat" unit="kg" />
            </div>

            <div className="flex flex-wrap gap-6">
              <InputGroup label="Visceral Fat *" placeholder="Visceral Fat" unit="%" />
              <InputGroup label="BMI*" placeholder="BMI" />
            </div>
          </div>

          {/* Thigh Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Thigh</h3>
            <div className="flex flex-wrap gap-6">
              <DropdownGroup label="Left Thigh *" placeholder="Left Thigh" unit="In" />
              <InputGroup label="Right Thigh *" placeholder="Right Thigh" />
            </div>
          </div>

          {/* Shoulder Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Shoulder</h3>
            <DropdownGroup label="Shoulder*" placeholder="Shoulder" unit="In" example="10" />
          </div>

          {/* Biceps Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Biceps</h3>
            <div className="flex flex-wrap gap-6">
              <DropdownGroup label="Left Biceps*" placeholder="Left Biceps" unit="In" />
              <InputGroup label="Right Biceps*" placeholder="Right Biceps" />
            </div>
          </div>

          {/* Calf Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Calf</h3>
            <div className="flex flex-wrap gap-6">
              <DropdownGroup label="Left Calf*" placeholder="Left Calf" unit="In" />
              <InputGroup label="Right Calf*" placeholder="Right Calf" />
            </div>
          </div>

          {/* Forearm Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Forearm</h3>
            <div className="flex flex-wrap gap-6">
              <DropdownGroup label="Left Forearm*" placeholder="Left Forearm" unit="In" />
              <InputGroup label="Right Forearm*" placeholder="Right Forearm" />
            </div>
          </div>

          {/* Chest Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Chest</h3>
            <DropdownGroup label="Chest*" placeholder="Chest" unit="In" example="10" />
          </div>

          {/* Hip Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Hip</h3>
            <DropdownGroup label="Glutes*" placeholder="Glutes" unit="In" example="10" />
          </div>

          {/* Waist Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Waist</h3>
            <DropdownGroup label="Waist*" placeholder="Waist" unit="In" example="10" />
          </div>

          {/* Neck Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Neck</h3>
            <DropdownGroup label="Neck*" placeholder="Neck" unit="In" example="10" />
          </div>

          {/* Back Section */}
          <div className="space-y-4">
            <h3 className={`text-[16px] font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Back</h3>
            <DropdownGroup label="Back*" placeholder="Back" unit="In" example="10" />
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end sticky bottom-0 z-10 transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white'}`}>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-10 py-3 rounded-lg text-[15px] font-black shadow-md transition-none active:scale-95">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const MemberReportCard = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRowsPerPageOpen, setIsRowsPerPageOpen] = useState(false);
  const rowsPerPageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rowsPerPageRef.current && !rowsPerPageRef.current.contains(event.target)) {
        setIsRowsPerPageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const reportCardData = [
    // { member: 'RAJESH SHARMA', date: '31-01-2026', number: '9825098250' }
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'} max-w-full overflow-x-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Member Report Card</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-black shadow-md active:scale-95 transition-none"
        >
          <Plus size={20} className="stroke-[3px]" />
          Add Report Card
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-[400px]">
        <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className={`w-full pl-12 pr-4 py-3 border rounded-lg text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <p className="text-[13px] font-black text-gray-400 uppercase tracking-tight pt-2 transition-none">Member Report Card ({reportCardData.length})</p>

      {/* Table Section */}
      <div className={`mt-2 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-5 border-b bg-white dark:bg-white/5 transition-none flex items-center gap-4">
          <span className="text-[14px] font-black text-gray-800 dark:text-gray-200 tracking-tight">
            Member Report Card
          </span>
          <div className="flex items-center gap-3">
            <ChevronLeft size={20} className="text-gray-400 cursor-pointer hover:text-gray-800" />
            <ChevronRight size={20} className="text-gray-400 cursor-pointer hover:text-gray-800" />
          </div>
        </div>
        <div className="overflow-x-auto transition-none">
          <table className="w-full text-left whitespace-nowrap transition-none">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Members</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Number</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {reportCardData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-20 text-center text-gray-400 font-black uppercase tracking-widest bg-gray-50/10">No records found</td>
                </tr>
              ) : (
                reportCardData.slice(0, rowsPerPage).map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-8 text-[#3b82f6] font-black uppercase cursor-pointer hover:underline">{row.member}</td>
                    <td className="px-6 py-8">{row.date}</td>
                    <td className="px-6 py-8">{row.number}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
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

      <AddReportCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default MemberReportCard;
