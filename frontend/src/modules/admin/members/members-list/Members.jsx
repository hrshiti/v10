import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Bell,
  MoreVertical,
  User,
  UserPlus,
  UserMinus,
  Users,
  Activity,
  Send,
  X,
  Plus,
  Calendar
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';

// --- Reusable Components ---

const CustomDropdown = ({ options, value, onChange, isDarkMode, placeholder = "Select", minWidth = "150px" }) => {
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
    <div className="relative" style={{ minWidth }} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border rounded-xl text-[14px] font-bold flex justify-between items-center cursor-pointer transition-none ${isDarkMode
          ? 'bg-[#1a1a1a] border-white/10 text-white'
          : isOpen ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 text-[#f97316] shadow-sm'
          }`}
      >
        <span className={`truncate ${value ? (isDarkMode ? 'text-white' : 'text-black') : 'text-[#f97316]'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#f97316]' : 'text-[#f97316]'}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1 max-h-[250px] overflow-y-auto rounded-lg shadow-xl border z-50 custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'
          }`}>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${isDarkMode
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GenerateReportModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[500px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Generate Report</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <label className={`block text-[14px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>OTP*</label>
          <input
            type="text"
            placeholder="OTP"
            className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 shadow-inner'}`}
          />
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600">
            Validate
          </button>
        </div>
      </div>
    </div>
  );
};

const VaccinationModal = ({ isOpen, onClose, isDarkMode, onConfirm }) => {
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
          <h2 className={`text-[22px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Is Member Vaccinated (Covid-19)?
          </h2>
        </div>

        {/* Footer */}
        <div className={`px-6 py-6 flex justify-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            onClick={onConfirm}
            className="bg-[#f97316] text-white px-12 py-3 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const ScheduleFollowUpModal = ({ isOpen, onClose, isDarkMode, onSubmit, trainers }) => {
  const [formData, setFormData] = useState({
    followUpDate: '',
    allocate: '',
    type: '',
    convertibility: '',
    toDo: ''
  });

  const [showAllocateDropdown, setShowAllocateDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showConvertibilityDropdown, setShowConvertibilityDropdown] = useState(false);
  const allocateRef = useRef(null);
  const typeRef = useRef(null);
  const convertibilityRef = useRef(null);

  const typeOptions = ['Balance Due', 'Enquiry', 'Feedback'];
  const convertibilityOptions = ['Hot', 'Warm', 'Cold'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (allocateRef.current && !allocateRef.current.contains(event.target)) {
        setShowAllocateDropdown(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
      if (convertibilityRef.current && !convertibilityRef.current.contains(event.target)) {
        setShowConvertibilityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      followUpDate: '',
      allocate: '',
      type: '',
      convertibility: '',
      toDo: ''
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[550px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Plus size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Schedule Followup</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Follow Up Date */}
          <div>
            <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Follow Up Date*</label>
            <div className="relative group">
              <Calendar
                size={18}
                className="absolute left-4 top-3.5 text-gray-400 group-hover:text-orange-500 transition-colors pointer-events-none"
              />
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg text-[14px] outline-none transition-all ${isDarkMode
                  ? 'bg-[#1a1a1a] border-white/10 text-white [color-scheme:dark]'
                  : 'bg-white border-gray-300 shadow-sm text-gray-900'
                  } focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20`}
              />
            </div>
          </div>

          {/* Allocate */}
          <div ref={allocateRef}>
            <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Allocate*</label>
            <div className="relative">
              <div
                onClick={() => setShowAllocateDropdown(!showAllocateDropdown)}
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none cursor-pointer flex justify-between items-center ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : showAllocateDropdown ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 shadow-sm'}`}
              >
                <span className={formData.allocate ? (isDarkMode ? 'text-white' : 'text-black') : 'text-[#f97316]'}>
                  {trainers.find(t => t._id === formData.allocate) ? `${trainers.find(t => t._id === formData.allocate).firstName} ${trainers.find(t => t._id === formData.allocate).lastName}` : 'Select'}
                </span>
                <ChevronDown size={16} className={`transition-transform ${showAllocateDropdown ? 'rotate-180 text-[#f97316]' : 'text-[#f97316]'}`} />
              </div>
              {showAllocateDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                  {trainers.map((trainer) => (
                    <div
                      key={trainer._id}
                      onClick={() => {
                        setFormData({ ...formData, allocate: trainer._id });
                        setShowAllocateDropdown(false);
                      }}
                      className={`px-4 py-3 text-[14px] font-medium cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                      {trainer.firstName} {trainer.lastName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Type */}
          <div ref={typeRef}>
            <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Type*</label>
            <div className="relative">
              <div
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none cursor-pointer flex justify-between items-center ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : showTypeDropdown ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 shadow-sm'}`}
              >
                <span className={formData.type ? (isDarkMode ? 'text-white' : 'text-black') : 'text-[#f97316]'}>
                  {formData.type || 'Select'}
                </span>
                <ChevronDown size={16} className={`transition-transform ${showTypeDropdown ? 'rotate-180 text-[#f97316]' : 'text-[#f97316]'}`} />
              </div>
              {showTypeDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                  {typeOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setFormData({ ...formData, type: option });
                        setShowTypeDropdown(false);
                      }}
                      className={`px-4 py-3 text-[14px] font-medium cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Convertibility */}
          <div ref={convertibilityRef}>
            <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Convertibility*</label>
            <div className="relative">
              <div
                onClick={() => setShowConvertibilityDropdown(!showConvertibilityDropdown)}
                className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none cursor-pointer flex justify-between items-center ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : showConvertibilityDropdown ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 shadow-sm'}`}
              >
                <span className={formData.convertibility ? (isDarkMode ? 'text-white' : 'text-black') : 'text-[#f97316]'}>
                  {formData.convertibility || 'Select'}
                </span>
                <ChevronDown size={16} className={`transition-transform ${showConvertibilityDropdown ? 'rotate-180 text-[#f97316]' : 'text-[#f97316]'}`} />
              </div>
              {showConvertibilityDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                  {convertibilityOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setFormData({ ...formData, convertibility: option });
                        setShowConvertibilityDropdown(false);
                      }}
                      className={`px-4 py-3 text-[14px] font-medium cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* To Do */}
          <div>
            <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>To Do*</label>
            <textarea
              placeholder="Type here..."
              value={formData.toDo}
              onChange={(e) => setFormData({ ...formData, toDo: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none resize-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 shadow-sm placeholder:text-gray-400'}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            onClick={onClose}
            className={`px-8 py-2.5 rounded-lg text-[15px] font-bold transition-none ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignTrainerModal = ({ isOpen, onClose, isDarkMode, onSubmit, trainers }) => {
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[450px] rounded-lg shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <UserPlus size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
            <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Assign Trainer</h2>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <label className={`block text-[14px] font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-[#333]'}`}>Select Trainer*</label>
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full px-4 py-3 border rounded-lg text-[14px] outline-none cursor-pointer flex justify-between items-center ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : showDropdown ? 'bg-white border-[#f97316] text-[#f97316]' : 'bg-white border-gray-300 shadow-sm'}`}
            >
              <span>
                {trainers.find(t => t._id === selectedTrainer) ? `${trainers.find(t => t._id === selectedTrainer).firstName} ${trainers.find(t => t._id === selectedTrainer).lastName}` : 'Select Trainer'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180 text-[#f97316]' : 'text-[#f97316]'}`} />
            </div>
            {showDropdown && (
              <div className={`absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto rounded-lg shadow-xl border z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                {trainers.map((trainer) => (
                  <div
                    key={trainer._id}
                    onClick={() => {
                      setSelectedTrainer(trainer._id);
                      setShowDropdown(false);
                    }}
                    className={`px-4 py-3 text-[14px] font-medium cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                  >
                    {trainer.firstName} {trainer.lastName} ({trainer.employeeId})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button onClick={onClose} className={`px-6 py-2.5 rounded-lg text-[15px] font-bold transition-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
          <button
            onClick={() => onSubmit(selectedTrainer)}
            className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[15px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600"
            disabled={!selectedTrainer}
          >
            Assign
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

// --- Main Component ---

const Members = () => {
  const { isDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionRef = useRef({});
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
  const [isScheduleFollowUpModalOpen, setIsScheduleFollowUpModalOpen] = useState(false);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isAssignTrainerModalOpen, setIsAssignTrainerModalOpen] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const toggleSelectMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMembers.length === members.length && members.length > 0) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(m => m._id));
    }
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

  // API States
  const [memberStats, setMemberStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);

  const toggleStatus = async (memberId, currentStatus) => {
    // If requesting to activate, always set to Active. If Active, set to Inactive.
    // Note: status 'Expired' or others logic might be needed, but sticking to simple toggle for now.
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;

      const res = await fetch(`${API_BASE_URL}/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setMembers(prev => prev.map(m => m._id === memberId ? { ...m, status: newStatus } : m));
        // Optionally refresh stats
        // fetchMembers(); // Might be heavy, local update is faster
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/members/stats`, { headers });
      const statsData = await statsRes.json();
      setMemberStats(statsData);

      // Fetch Members with pagination and search
      const query = new URLSearchParams({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        keyword: searchQuery,
        gender: selectedGender === 'Gender' ? '' : selectedGender,
        status: selectedStatus === 'All Members' ? '' : (selectedStatus === 'Expiring Soon' ? 'expiringSoon' : (selectedStatus === 'Expired Members' ? 'expired' : (selectedStatus === 'Active Members' ? 'Active' : '')))
      });

      const membersRes = await fetch(`${API_BASE_URL}/api/admin/members?${query.toString()}`, { headers });
      const mData = await membersRes.json();

      setMembers(mData.members);
      setTotalPages(mData.pages);
      setTotalMembers(mData.total);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchMembers();
    fetchTrainers();
  }, [currentPage, rowsPerPage, selectedGender, selectedStatus]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMembers();
  };

  const handleClear = () => {
    setSelectedGender('');
    setSearchQuery('');
    setSelectedStatus('All');
    setCurrentPage(1);
    // fetchData is called via effects
  };

  const handleDownloadReport = () => {
    if (!members || members.length === 0) {
      alert("No members found to download.");
      return;
    }

    const headers = ["Member ID", "First Name", "Last Name", "Mobile", "Gender", "Status", "Package", "End Date", "Due Amount"];
    const csvContent = [
      headers.join(","),
      ...members.map(m => [
        m.memberId,
        m.firstName,
        m.lastName,
        m.mobile,
        m.gender,
        m.status,
        m.packageName,
        new Date(m.endDate).toLocaleDateString(),
        m.dueAmount || 0
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Members_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { label: 'All Members', value: memberStats?.total || '0', icon: User, theme: 'blue' },
    { label: 'Active Members', value: memberStats?.active || '0', icon: Activity, theme: 'emerald' },
    { label: 'Expiring Soon', value: memberStats?.expiringSoon || '0', icon: UserPlus, theme: 'purple' },
    { label: 'Expired Members', value: memberStats?.expired || '0', icon: User, theme: 'slate' },
    { label: 'Today Attendance', value: memberStats?.todayAttendance || '0', icon: Users, theme: 'orange' },
  ];

  const themeConfig = {
    blue: { bg: 'bg-blue-600', shadow: 'shadow-blue-500/20', ring: 'ring-blue-400' },
    emerald: { bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/20', ring: 'ring-emerald-400' },
    purple: { bg: 'bg-purple-600', shadow: 'shadow-purple-500/20', ring: 'ring-purple-400' },
    slate: { bg: 'bg-slate-600', shadow: 'shadow-slate-500/20', ring: 'ring-slate-400' },
    orange: { bg: 'bg-orange-600', shadow: 'shadow-orange-500/20', ring: 'ring-orange-400' },
  };



  const handleVaccinationConfirm = () => {
    if (selectedMemberIndex !== null) {
      const updatedMembers = [...members];
      updatedMembers[selectedMemberIndex].vaccination = 'YES';
      setMembers(updatedMembers);
      setSuccessMessage('Vaccination status updated successfully!');
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    }
    setIsVaccinationModalOpen(false);
    setActiveActionRow(null);
  };

  const handleScheduleFollowUpSubmit = async (formData) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const member = members[selectedMemberIndex];
      if (!member) return;

      // Handle Date Parsing (Support DD/MM/YYYY and DD-MM-YYYY)
      const dateStr = formData.followUpDate;
      let followUpDate;
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        followUpDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) { // YYYY-MM-DD
          followUpDate = new Date(dateStr);
        } else { // DD-MM-YYYY
          followUpDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        followUpDate = new Date(dateStr);
      }

      if (isNaN(followUpDate.getTime())) {
        alert("Invalid follow-up date format. Please use dd/mm/yyyy");
        return;
      }

      const payload = {
        name: `${member.firstName} ${member.lastName}`,
        number: member.mobile,
        type: formData.type || 'Enquiry',
        dateTime: followUpDate,
        status: formData.convertibility || 'Hot',
        comment: formData.toDo,
        memberId: member._id,
        handledBy: formData.allocate || undefined,
        createdBy: 'Admin'
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/follow-ups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMessage('Follow-up scheduled successfully!');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        setIsScheduleFollowUpModalOpen(false);
        setActiveActionRow(null);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to schedule follow-up');
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      alert('Error scheduling follow-up');
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedMembers.length === 0) return;
    if (!window.confirm(`Are you sure you want to deactivate ${selectedMembers.length} members?`)) return;

    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/members/bulk-deactivate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memberIds: selectedMembers })
      });

      if (res.ok) {
        setSuccessMessage('Members deactivated successfully!');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        setSelectedMembers([]);
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to deactivate members');
      }
    } catch (error) {
      console.error('Error deactivating members:', error);
    }
  };

  const handleBulkAssignTrainer = async (trainerId) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/members/bulk-assign-trainer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memberIds: selectedMembers, trainerId })
      });

      if (res.ok) {
        setSuccessMessage('Trainer assigned successfully!');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        setSelectedMembers([]);
        setIsAssignTrainerModalOpen(false);
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to assign trainer');
      }
    } catch (error) {
      console.error('Error assigning trainer:', error);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) return;
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccessMessage('Member deleted successfully!');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleUnfreeze = async (id) => {
    if (!window.confirm('Are you sure you want to resume this membership?')) return;
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/members/${id}/unfreeze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccessMessage('Membership resumed successfully!');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to unfreeze member');
      }
    } catch (error) {
      console.error('Error unfreezing member:', error);
    }
  };

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Membership Management</h1>
        <button
          onClick={() => navigate('/admin/members/add')}
          className="bg-emerald-500 text-white px-8 py-3 rounded-lg flex items-center gap-3 text-[15px] font-bold shadow-lg active:scale-95 transition-none hover:bg-emerald-600"
        >
          <UserPlus size={22} strokeWidth={3} />
          Create New Member
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-none">
        {stats.map((stat, idx) => {
          const config = themeConfig[stat.theme];
          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedStatus(stat.label);
                setCurrentPage(1);
              }}
              className={`group p-6 rounded-xl flex items-center gap-5 transition-all duration-300 cursor-pointer border
                ${selectedStatus === stat.label ? `${config.bg} text-white ${config.shadow} border-transparent scale-105` :
                  (isDarkMode
                    ? `bg-[#1a1a1a] border-white/5 text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                    : `bg-white border-gray-100 text-gray-700 hover:text-white hover:border-transparent hover:${config.bg} hover:shadow-lg ${config.shadow}`
                  )}`}
            >
              <div className={`p-4 rounded-xl transition-all duration-300 
                ${isDarkMode
                  ? 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                  : 'bg-[#fcfcfc] text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                }`}>
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

      {/* Bulk Actions Bar */}
      {selectedMembers.length > 0 && (
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300 ${isDarkMode ? 'bg-[#f97316]/10 border-[#f97316]/20' : 'bg-orange-50 border-orange-100'}`}>
          <div className="flex items-center gap-4">
            <span className={`text-[15px] font-black ${isDarkMode ? 'text-[#f97316]' : 'text-orange-700'}`}>{selectedMembers.length} Members Selected</span>
            <button
              onClick={() => setSelectedMembers([])}
              className={`text-[13px] font-bold hover:underline ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Deselect All
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAssignTrainerModalOpen(true)}
              className="bg-[#f97316] text-white px-6 py-2 rounded-lg text-[13px] font-black shadow-md hover:bg-orange-600 active:scale-95 transition-all flex items-center gap-2"
            >
              Assign Trainer
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="bg-red-500 text-white px-6 py-2 rounded-lg text-[13px] font-black shadow-md hover:bg-red-600 active:scale-95 transition-all flex items-center gap-2"
            >
              Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 transition-none pt-4">
        <CustomDropdown
          placeholder="Gender"
          options={['Male', 'Female']}
          value={selectedGender}
          onChange={setSelectedGender}
          isDarkMode={isDarkMode}
          minWidth="130px"
        />

        <button
          onClick={handleSearch}
          className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="bg-[#f97316] text-white px-10 py-3 rounded-lg text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600"
        >
          Clear
        </button>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, ID or Mobile"
              className={`w-full pl-12 pr-4 py-2.5 border rounded-xl text-[15px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-black placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#f97316] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold transition-none active:scale-95 shadow-md hover:bg-orange-600 flex items-center gap-2"
          >
            <Search size={18} />
            Search
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={handleDownloadReport}
          className={`flex items-center gap-3 px-8 py-3.5 border rounded-xl text-[14px] font-bold transition-none active:scale-95 border-gray-200 shadow-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f9fa] text-gray-700 hover:bg-gray-100'}`}
        >
          <Download size={20} className="text-gray-400" />
          Download Report
        </button>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-xl overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-6 border-b flex justify-between items-center transition-none bg-white dark:bg-white/5">
          <span className="text-[14px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Memberships</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-[#fcfcfc] border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-4 py-6 w-10">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded accent-[#f97316] cursor-pointer"
                    checked={members.length > 0 && selectedMembers.length === members.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-6 uppercase tracking-wider text-[11px]">Member ID</th>
                <th className="px-4 py-6 uppercase tracking-wider text-[11px]">Name & Mob. No.</th>
                <th className="px-4 py-6 uppercase tracking-wider text-center text-[11px]">Gender</th>
                <th className="px-4 py-6 uppercase tracking-wider text-center text-[11px]">Status</th>
                <th className="px-4 py-6 uppercase tracking-wider text-[11px]">Package</th>
                <th className="px-4 py-6 uppercase tracking-wider text-center text-red-500 text-[11px]">Due</th>
                <th className="px-4 py-6 uppercase tracking-wider text-center text-[11px]">Expiry Date</th>
                <th className={`px-4 py-6 border-l dark:border-white/5 w-[80px] text-center text-[11px] sticky right-0 z-20 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#fcfcfc]'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {members.length > 0 ? (
                members.map((row, idx) => (
                  <tr key={idx} className={`border-b transition-none ${isDarkMode
                    ? (selectedMembers.includes(row._id) ? 'bg-[#f97316]/10 border-white/5' : 'border-white/5 hover:bg-white/5')
                    : (selectedMembers.includes(row._id) ? 'bg-orange-50 border-orange-100' : 'border-gray-50 hover:bg-gray-50/50')
                    }`}>
                    <td className="px-4 py-6">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded accent-[#f97316] cursor-pointer"
                        checked={selectedMembers.includes(row._id)}
                        onChange={() => toggleSelectMember(row._id)}
                      />
                    </td>
                    <td className="px-4 py-6">{row.memberId}</td>
                    <td className="px-4 py-6">
                      <div
                        className="flex flex-col transition-none cursor-pointer"
                        onClick={() => navigate(`/admin/members/profile/${row._id}/edit`, { state: { member: row } })}
                      >
                        <span className="text-[#3b82f6] text-[14px] font-black hover:underline uppercase">{row.firstName} {row.lastName}</span>
                        <span className="text-[#3b82f6] text-[12px] mt-0.5 font-bold">{row.mobile}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center">{row.gender}</td>
                    <td className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${row.status === 'Active' ? 'bg-[#10b981]' : (row.status === 'Expired' ? 'bg-red-500' : 'bg-gray-300')}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(row._id, row.status);
                          }}
                        >
                          <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${row.status === 'Active' ? 'translate-x-5' : ''}`}></div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${row.status === 'Active' ? 'text-[#10b981]' : (row.status === 'Expired' ? 'text-red-500' : 'text-gray-400')}`}>
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6">{row.packageName}</td>
                    <td className="px-4 py-6 text-center text-red-500 font-black">₹{row.dueAmount || 0}</td>
                    <td className="px-4 py-6 text-center">
                      {new Date(row.endDate).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-6 text-center relative border-l dark:border-white/5 sticky right-0 z-10 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`} ref={el => actionRef.current[idx] = el}>
                      <button
                        onClick={() => setActiveActionRow(activeActionRow === idx ? null : idx)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all active:scale-90"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {activeActionRow === idx && (
                        <div className={`absolute right-12 top-12 w-[220px] rounded-xl shadow-2xl border z-50 overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 font-bold'}`}>
                          <div className="py-2">
                            {[
                              'View Profile',
                              'Vaccination',
                              'Schedule Followup',
                              row.status === 'Frozen' ? 'Unfreeze' : null,
                              'Delete'
                            ].filter(Boolean).map((action, i) => (
                              <div key={i}>
                                {action === 'View Profile' ? (
                                  <div
                                    onClick={() => {
                                      setActiveActionRow(null);
                                      navigate(`/admin/members/profile/${row._id}/edit`, { state: { member: row } });
                                    }}
                                    className={`px-5 py-4 text-[15px] font-black border-b last:border-0 cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'
                                      }`}
                                  >
                                    {action}
                                  </div>
                                ) : action === 'Vaccination' ? (
                                  <div
                                    onClick={() => {
                                      setSelectedMemberIndex(idx);
                                      setIsVaccinationModalOpen(true);
                                    }}
                                    className={`px-5 py-4 text-[15px] font-black border-b last:border-0 cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'
                                      }`}
                                  >
                                    {action}
                                  </div>
                                ) : action === 'Schedule Followup' ? (
                                  <div
                                    onClick={() => {
                                      setSelectedMemberIndex(idx);
                                      setIsScheduleFollowUpModalOpen(true);
                                    }}
                                    className={`px-5 py-4 text-[15px] font-black border-b last:border-0 cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'
                                      }`}
                                  >
                                    {action}
                                  </div>
                                ) : action === 'Unfreeze' ? (
                                  <div
                                    onClick={() => {
                                      setActiveActionRow(null);
                                      handleUnfreeze(row._id);
                                    }}
                                    className={`px-5 py-4 text-[15px] font-black border-b last:border-0 cursor-pointer hover:pl-8 transition-all text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}
                                  >
                                    {action}
                                  </div>
                                ) : action === 'Delete' ? (
                                  <div
                                    onClick={() => {
                                      setActiveActionRow(null);
                                      handleDeleteMember(row._id);
                                    }}
                                    className={`px-5 py-4 text-[15px] font-black border-b last:border-0 cursor-pointer hover:pl-8 transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}
                                  >
                                    {action}
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => setActiveActionRow(null)}
                                    className={`px-5 py-4 text-[15px] font-black border-b last:border-0 cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'
                                      }`}
                                  >
                                    {action}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                    {isLoading ? 'Loading Members...' : 'No Members Found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-[#f9f9f9]/30'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50`}
            >
              « Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-11 h-11 border rounded-xl text-[13px] font-black transition-none ${currentPage === num ? 'bg-[#f97316] text-white shadow-lg' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50`}
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

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <VaccinationModal
        isOpen={isVaccinationModalOpen}
        onClose={() => {
          setIsVaccinationModalOpen(false);
          setActiveActionRow(null);
        }}
        isDarkMode={isDarkMode}
        onConfirm={handleVaccinationConfirm}
      />

      <ScheduleFollowUpModal
        isOpen={isScheduleFollowUpModalOpen}
        onClose={() => {
          setIsScheduleFollowUpModalOpen(false);
          setActiveActionRow(null);
        }}
        isDarkMode={isDarkMode}
        onSubmit={handleScheduleFollowUpSubmit}
        trainers={trainers}
      />

      <AssignTrainerModal
        isOpen={isAssignTrainerModalOpen}
        onClose={() => setIsAssignTrainerModalOpen(false)}
        isDarkMode={isDarkMode}
        onSubmit={handleBulkAssignTrainer}
        trainers={trainers}
      />

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-24 right-8 z-[200] animate-in fade-in slide-in-from-right-10 duration-300">
          <div className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex items-center gap-4 min-w-[320px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-black text-gray-700">{successMessage}</p>
            </div>
            <button onClick={() => setShowSuccessNotification(false)} className="text-gray-300 hover:text-gray-500">
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
      )}
    </div>
  );
};

export default Members;
