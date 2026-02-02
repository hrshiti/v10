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

const ExerciseAccordion = ({ category, details, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!details) return (
    <div className={`p-4 px-6 rounded-xl border flex justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <span className="text-[14px] font-black tracking-tight text-[#333] dark:text-white uppercase">{category}</span>
      <ChevronDown size={18} className="text-gray-400" />
    </div>
  );

  return (
    <div className={`rounded-xl border overflow-hidden transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 px-6 flex justify-between items-center cursor-pointer"
      >
        <span className="text-[14px] font-black tracking-tight text-[#333] dark:text-white uppercase">{category}</span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
          <div className={`flex flex-col md:flex-row ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            {/* Exercise Name */}
            <div className={`p-4 flex-1 flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{details.name}</span>
              <span className="text-[11px] text-gray-500 font-medium">Exercise Name</span>
            </div>

            {/* Sets */}
            <div className={`p-4 w-full md:w-[150px] flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{details.sets}</span>
              <span className="text-[11px] text-gray-500 font-medium">Sets</span>
            </div>

            {/* Reps */}
            <div className={`p-4 w-full md:w-[220px] flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{details.reps}</span>
              <span className="text-[11px] text-gray-500 font-medium">Reps</span>
            </div>

            {/* Weight/Time */}
            <div className={`p-4 w-full md:w-[220px] flex flex-col justify-center ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{details.weight}</span>
              <span className="text-[11px] text-gray-500 font-medium">Weight/Time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

const WorkoutPlanItem = ({ plan, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(false);
  const actionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setActiveActionRow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getWorkoutData = () => {
    const name = plan.name.toUpperCase();
    if (name === 'WEIGHT GAIN LEVEL 1 (NEW)') {
      return [
        {
          name: 'Monday',
          exercises: [
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '10 MIN' } },
            { category: 'CARDIO', details: { name: 'CROSS BODY PUSH-UP', sets: '3', reps: '3', weight: '10 MIN' } },
            { category: 'CHEST', details: { name: 'BARBELL BENCH PRESS', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'INCLINE BARBELL BENCH PRESS', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'DUMBBELL PRESS 1', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'PEC DECK FLY', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Tuesday',
          exercises: [
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '10 MIN', weight: '' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL SHOULDER PRESS', sets: '15,12,10', reps: 'Reps', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'BARBELL FRONT RAISE', sets: '15,12,10', reps: 'Reps', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'SMITH MACHINE SHOULDER PRESS', sets: '15,12,10', reps: 'Reps', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL SHRUG', sets: '15,12,10', reps: 'Reps', weight: '3' } },
          ]
        },
        {
          name: 'Wednesday',
          exercises: [
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '10 MIN' } },
            { category: 'BACK', details: { name: 'LAT PULLDOWN', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'ROWING MACHINE', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'V BAR LAT PULLDOWN', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'SHOULDER', details: { name: 'BARBELL SHRUG MUSCLES', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Thursday',
          exercises: [
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '10 MIN' } },
            { category: 'BICEP', details: { name: 'DUMBBELL CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'BARBELL CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'DUMBBELL PREACHER CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'HAMMER CURL', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Friday',
          exercises: [
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '10 MIN' } },
            { category: 'TRICEPS', details: { name: 'BARBELL TRICEPS EXTENSION', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'TRICEPS', details: { name: 'SEATED ONE-ARM DUMBBELL TRICEPS EXTENSION', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'TRICEPS', details: { name: 'EZ BAR LYING CLOSE GRIP TRICEPS EXTENSION BEHIND HEAD', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'TRICEPS', details: { name: 'PUSHDOWN', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Saturday',
          exercises: [
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '10 MIN' } },
            { category: 'LEG', details: { name: 'SQUAT', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'LEG', details: { name: 'LEG PRESS', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'LEG', details: { name: 'LEG EXTENSION', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'LEG', details: { name: 'LEG CURL', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
      ];
    }
    if (name === 'WEIGHT GAIN LEVEL 1' && !plan.name.includes('(NEW)')) {
      return [
        {
          name: 'Monday',
          exercises: [
            { category: 'SHOULDER', details: { name: 'LEVER SHOULDER PRESS', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL LATERAL RAISE', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL FRONT RAISE', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'SQUAT', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG PRESS', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG EXTENSION', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG CURL', sets: '', reps: '', weight: '' } },
            { category: 'CALVES', details: { name: 'STANDING CALF RAISE', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '5 min' } },
            { category: 'ABS', details: { name: 'OBLIQUE FLOOR CRUNCHES', sets: '3', reps: '20', weight: '' } },
            { category: 'ABS', details: { name: 'PLANK', sets: '3', reps: '20', weight: '' } },
          ]
        },
        {
          name: 'Tuesday',
          exercises: [
            { category: 'BACK', details: { name: 'LAT PULLDOWN', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'SEATED ROW MACHINE', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'REVERSE LAT PULLDOWN', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'Back Extension', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'BARBELL CURL', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'PREACHER CURL', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'HAMMER CURL', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '5 min' } },
            { category: 'ABS', details: { name: 'OBLIQUE FLOOR CRUNCHES', sets: '3', reps: '20', weight: '' } },
            { category: 'ABS', details: { name: 'PLANK', sets: '3', reps: '20', weight: '' } },
          ]
        },
        {
          name: 'Wednesday',
          exercises: [
            { category: 'CHEST', details: { name: 'PUSH UP', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'BARBELL BENCH PRESS', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'INCLINE DUMBBELL PRESS', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'PEC DECK FLY', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'SEATED DUMBBELL TRICEPS EXTENSION', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'ROPE PUSHDOWN', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'BENCH DIPS', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '5 min' } },
            { category: 'ABS', details: { name: 'OBLIQUE FLOOR CRUNCHES', sets: '3', reps: '20', weight: '' } },
            { category: 'ABS', details: { name: 'PLANK', sets: '3', reps: '20', weight: '' } },
          ]
        },
        {
          name: 'Thursday',
          exercises: [
            { category: 'SHOULDER', details: { name: 'LEVER SHOULDER PRESS', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL LATERAL RAISE', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL FRONT RAISE', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'SQUAT', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG PRESS', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG EXTENSION', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG CURL', sets: '', reps: '', weight: '' } },
            { category: 'CALVES', details: { name: 'STANDING CALF RAISE', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '5 min' } },
            { category: 'ABS', details: { name: 'OBLIQUE FLOOR CRUNCHES', sets: '3', reps: '20', weight: '' } },
            { category: 'ABS', details: { name: 'PLANK', sets: '3', reps: '20', weight: '' } },
          ]
        },
        {
          name: 'Friday',
          exercises: [
            { category: 'BACK', details: { name: 'LAT PULLDOWN', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'SEATED ROW MACHINE', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'REVERSE LAT PULLDOWN', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'Back Extension', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'BARBELL CURL', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'PREACHER CURL', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'HAMMER CURL', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '5 min' } },
            { category: 'ABS', details: { name: 'OBLIQUE FLOOR CRUNCHES', sets: '3', reps: '20', weight: '' } },
            { category: 'ABS', details: { name: 'PLANK', sets: '3', reps: '20', weight: '' } },
          ]
        },
        {
          name: 'Saturday',
          exercises: [
            { category: 'CHEST', details: { name: 'PUSH UP', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'BARBELL BENCH PRESS', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'INCLINE DUMBBELL PRESS', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'PEC DECK FLY', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'SEATED DUMBBELL TRICEPS EXTENSION', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'ROPE PUSHDOWN', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'BENCH DIPS', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '5 min' } },
            { category: 'ABS', details: { name: 'OBLIQUE FLOOR CRUNCHES', sets: '3', reps: '20', weight: '' } },
            { category: 'ABS', details: { name: 'PLANK', sets: '3', reps: '20', weight: '' } },
          ]
        },
      ];
    }
    if (name === 'WEIGHT GAIN LEVEL 2' && !plan.name.includes('(NEW)')) {
      return [
        {
          name: 'Monday',
          exercises: [
            { category: 'BACK', details: { name: 'LAT PULLDOWN', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'REVERSE LAT PULLDOWN', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'SEATED ROW MACHINE', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'BARBELL BENT OVER ROW', sets: '', reps: '', weight: '' } },
            { category: 'BACK', details: { name: 'CABLE PULLOVER', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'BARBELL DEADLIFT', sets: '', reps: '', weight: '' } },
            { category: 'TRAPEZIUS', details: { name: 'BARBELL SHRUG', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '' } },
          ]
        },
        {
          name: 'Tuesday',
          exercises: [
            { category: 'BICEP', details: { name: 'BARBELL CURL', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'SEATED INCLINE DUMBBELL CURL', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'REVERSE GRIP EZ BAR CURL', sets: '', reps: '', weight: '' } },
            { category: 'BICEP', details: { name: 'PREACHER CURL', sets: '', reps: '', weight: '' } },
            { category: 'FOREARM', details: { name: 'DUMBBELL WRIST CURL', sets: '', reps: '', weight: '' } },
            { category: 'FOREARM', details: { name: 'BARBELL REVERSE WRIST CURL', sets: '', reps: '', weight: '' } },
          ]
        },
        {
          name: 'Wednesday',
          exercises: [
            { category: 'CHEST', details: { name: 'PUSH UP', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'BARBELL BENCH PRESS', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'INCLINE BARBELL BENCH PRESS', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'DECLINE DUMBBELL PRESS', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'CABLE CROSSOVER', sets: '', reps: '', weight: '' } },
            { category: 'CHEST', details: { name: 'CHEST PRESS MACHINE', sets: '', reps: '', weight: '' } },
          ]
        },
        {
          name: 'Thursday',
          exercises: [
            { category: 'TRICEPS', details: { name: 'PUSHDOWN', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'SEATED ONE-ARM DUMBBELL TRICEPS EXTENSION', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'DUMBBELL KICKBACK', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'BARBELL REVERSE GRIP SKULLCRUSHER', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'CLOSE GRIP BENCH PRESS', sets: '', reps: '', weight: '' } },
          ]
        },
        {
          name: 'Friday',
          exercises: [
            { category: 'SHOULDER', details: { name: 'LEVER SHOULDER PRESS HAMMER GRIP', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL SHOULDER PRESS', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL LATERAL RAISE', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'BARBELL UPRIGHT ROW', sets: '', reps: '', weight: '' } },
            { category: 'SHOULDER', details: { name: 'REAR DELT MACHINE FLYS', sets: '', reps: '', weight: '' } },
            { category: 'CARDIO', details: { name: 'TREADMILL', sets: '', reps: '', weight: '10 min' } },
            { category: 'ABS', details: { name: 'OBLIQUE FLOOR CRUNCHES', sets: '', reps: '', weight: '' } },
            { category: 'ABS', details: { name: 'REVERSE CRUNCH', sets: '', reps: '', weight: '' } },
          ]
        },
        {
          name: 'Saturday',
          exercises: [
            { category: 'CARDIO', details: { name: 'RIDING OUTDOOR BICYCLE', sets: '', reps: '', weight: '5 min' } },
            { category: 'LEG', details: { name: 'BODYWEIGHT SQUAT', sets: '', reps: '20', weight: '' } },
            { category: 'LEG', details: { name: 'BARBELL HACK SQUAT', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'WALKING LUNGES', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG CURL', sets: '', reps: '', weight: '' } },
            { category: 'LEG', details: { name: 'LEG EXTENSION', sets: '', reps: '', weight: '' } },
            { category: 'CALVES', details: { name: 'LEVER SEATED CALF RAISE', sets: '', reps: '', weight: '' } },
            { category: 'CALVES', details: { name: 'STANDING CALF RAISE', sets: '', reps: '', weight: '' } },
          ]
        },
      ];
    }
    if (name === 'WEIGHT GAIN LEVEL 2 (NEW)' || name === 'WEIGHT GAIN LEVEL 3 (NEW)') {
      return [
        {
          name: 'Monday',
          exercises: [
            { category: 'CHEST', details: { name: 'BARBELL BENCH PRESS', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'INCLINE BARBELL BENCH PRESS', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'DUMBBELL PRESS 1', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'PEC DECK FLY', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'CHEST PRESS MACHINE', sets: '', reps: '15,12,10', weight: '' } },
            { category: 'CHEST', details: { name: 'PUSH UP', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Tuesday',
          exercises: [
            { category: 'SHOULDER', details: { name: 'DUMBBELL SHOULDER PRESS', sets: '15,12,10', reps: 'Reps', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'BARBELL FRONT RAISE', sets: '15,12,10', reps: 'Reps', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'SMITH MACHINE SHOULDER PRESS', sets: '', reps: '15,12,10', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'DUMBBELL SHRUG', sets: '15,12,10', reps: 'Reps', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'BARBELL FRONT RAISE', sets: '', reps: '15,12,10', weight: '3' } },
            { category: 'SHOULDER', details: { name: 'SIDE ARM RAISES', sets: '15,12,10', reps: 'Reps', weight: '3' } },
          ]
        },
        {
          name: 'Wednesday',
          exercises: [
            { category: 'BACK', details: { name: 'LAT PULLDOWN', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'ROWING MACHINE', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'LAT PULLDOWN', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'DUMBBELL ROW', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'BARBELL BENT OVER ROW', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'T BAR ROW', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BACK', details: { name: 'DEADLIFT', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Thursday',
          exercises: [
            { category: 'BICEP', details: { name: 'DUMBBELL CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'BARBELL CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'BARBELL CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'ZOTTMAN CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'HAMMER CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'BICEP', details: { name: 'CABLE CURL', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Friday',
          exercises: [
            { category: 'TRICEPS', details: { name: 'BARBELL TRICEPS EXTENSION', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'TRICEPS', details: { name: 'ONE ARM LYING TRICEPS EXTENSION', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'TRICEPS', details: { name: 'CLOSE GRIP DUMBBELL PRESS', sets: '', reps: '', weight: '' } },
            { category: 'TRICEPS', details: { name: 'PUSHDOWN', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'TRICEPS', details: { name: 'DUMBBELL KICKBACK', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
        {
          name: 'Saturday',
          exercises: [
            { category: 'LEG', details: { name: 'SQUAT', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'LEG', details: { name: 'LEG PRESS', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'LEG', details: { name: 'LEG EXTENSION', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'LEG', details: { name: 'LEG CURL', sets: '3', reps: '15,12,10', weight: '' } },
            { category: 'LEG', details: { name: 'LUNGES', sets: '3', reps: '15,12,10', weight: '' } },
          ]
        },
      ];
    }
    return [
      { name: 'Monday', exercises: ['CHEST'] },
      { name: 'Saturday', exercises: ['LEG', 'LEG'] },
    ];
  };

  const days = getWorkoutData();

  return (
    <div className={`rounded-2xl border transition-none overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-inner' : 'bg-white border-gray-200/60 shadow-sm'}`}>
      <div className="p-5 flex items-center justify-between">
        <span className={`text-[17px] font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>{plan.name}</span>

        <div className="flex items-center gap-6 transition-none">
          <div className="relative min-w-[280px]">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Members"
              className={`w-full pl-12 pr-10 py-3 border rounded-xl text-[15px] font-black outline-none transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-600' : 'bg-[#fcfcfc] border-gray-200 text-black placeholder:text-gray-400 focus:border-orange-500'}`}
            />
            <ChevronDown size={18} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
          </div>

          <button onClick={() => setIsExpanded(!isExpanded)}>
            <ChevronDown size={24} className={`text-gray-400 cursor-pointer hover:text-black transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          <div className="relative" ref={actionRef}>
            <button onClick={() => setActiveActionRow(!activeActionRow)}>
              <MoreVertical size={24} className="text-gray-400 cursor-pointer hover:text-black transition-colors" />
            </button>
            {activeActionRow && (
              <div className={`absolute right-0 top-full mt-2 w-[180px] rounded-xl shadow-2xl border z-50 overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 font-bold'}`}>
                <div className="py-2">
                  <div className={`px-6 py-4 text-[15px] font-black border-b cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'}`}>
                    Edit
                  </div>
                  <div className={`px-6 py-4 text-[15px] font-black cursor-pointer hover:pl-8 transition-all text-[#333] ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                    Delete
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4">
          {days.map((day, dIdx) => (
            <div key={dIdx} className="space-y-4">
              {/* Day Header */}
              <div className="w-full bg-[#fff7ed] border border-[#ffedd5] text-[#f97316] py-2.5 rounded-lg text-center text-[13px] font-black tracking-wide">
                {day.name}
              </div>
              {/* Exercises */}
              <div className="space-y-3">
                {day.exercises.map((ex, eIdx) => (
                  <ExerciseAccordion
                    key={eIdx}
                    category={typeof ex === 'string' ? ex : ex.category}
                    details={typeof ex === 'string' ? null : ex.details}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MembersWorkoutCard = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Public');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const workoutPlans = [
    { name: 'WEIGHT GAIN LEVEL 2 (NEW)' },
    { name: 'WEIGHT GAIN LEVEL 3 (NEW)' },
    { name: 'WEIGHT GAIN LEVEL 1 (NEW)' },
    { name: 'weight gain level 2' },
    { name: 'weight gain level 1' }
  ];


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
              <WorkoutPlanItem key={idx} plan={plan} isDarkMode={isDarkMode} />
            ))}
          </div>

          {/* Pagination */}
          <div className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-none`}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                « Previous
              </button>
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-11 h-11 border rounded-xl text-[13px] font-black transition-none ${currentPage === num ? 'bg-[#f97316] text-white shadow-lg' : 'border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-sm'}`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(4, prev + 1))}
                disabled={currentPage === 4}
                className={`px-6 py-2.5 border rounded-xl text-[13px] font-black transition-none border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-sm ${currentPage === 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
