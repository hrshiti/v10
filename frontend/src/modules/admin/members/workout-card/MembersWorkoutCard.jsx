import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  X,
  Utensils,
  Trash2
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

const CreateWorkoutModal = ({ isOpen, onClose, isDarkMode, onNext }) => {
  const [workoutName, setWorkoutName] = useState('');
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
          <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
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
          <button
            onClick={() => {
              if (workoutName && privacyMode) {
                onNext(workoutName, privacyMode);
                setWorkoutName('');
                setPrivacyMode('');
              } else {
                alert("Please fill in all fields");
              }
            }}
            className="bg-[#f97316] text-white px-10 py-3 rounded-xl text-[15px] font-black shadow-lg active:scale-95 transition-none hover:bg-orange-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateWorkoutDetailsModal = ({ isOpen, onClose, isDarkMode, workoutName, privacyMode, initialData, onSubmit }) => {
  const [activeDay, setActiveDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [copyToDays, setCopyToDays] = useState([]);
  const [exercisesPerDay, setExercisesPerDay] = useState(() => {
    const initial = {};
    days.forEach(day => initial[day] = []);
    return initial;
  });

  useEffect(() => {
    if (initialData) {
      const loadedExercises = {};
      days.forEach(day => loadedExercises[day] = []);
      if (initialData.schedule) {
        initialData.schedule.forEach(dayPlan => {
          loadedExercises[dayPlan.day] = dayPlan.exercises || [];
        });
      }
      setExercisesPerDay(loadedExercises);
    } else if (isOpen) {
      const initial = {};
      days.forEach(day => initial[day] = []);
      setExercisesPerDay(initial);
      setActiveDay('Monday');
      setCopyToDays([]);
      setCurrentExercise({ category: '', exercise: '', reps: '', sets: '', weight: '' });
    }
  }, [initialData, isOpen]);

  const [currentExercise, setCurrentExercise] = useState({ category: '', exercise: '', reps: '', sets: '', weight: '' });

  if (!isOpen) return null;

  const handleCopyToChange = (day) => {
    if (copyToDays.includes(day)) setCopyToDays(prev => prev.filter(d => d !== day));
    else setCopyToDays(prev => [...prev, day]);
  };

  const handleAddExercise = () => {
    if (!currentExercise.category || !currentExercise.exercise) {
      alert("Please fill in Category and Exercise");
      return;
    }
    const newExercise = { ...currentExercise, id: Date.now() };
    setExercisesPerDay(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newExercise]
    }));
    setCurrentExercise({ category: '', exercise: '', reps: '', sets: '', weight: '' });
  };

  const handleDeleteExercise = (day, id) => {
    setExercisesPerDay(prev => ({ ...prev, [day]: prev[day].filter(ex => ex.id !== id) }));
  };

  const handleSubmit = () => {
    const finalExercises = { ...exercisesPerDay };

    // Auto-add pending exercise if fields are filled but not added
    let pendingExercise = null;
    if (currentExercise.category && currentExercise.exercise) {
      pendingExercise = { ...currentExercise, id: Date.now() };
      finalExercises[activeDay] = [...finalExercises[activeDay], pendingExercise];
    }

    const sourceExercises = finalExercises[activeDay];

    // Handle Copy To
    if (sourceExercises.length > 0) {
      copyToDays.forEach(day => {
        // We replace or append? Usually replace or append to empty. 
        // Let's assume we copy the source list to the target day.
        finalExercises[day] = [...sourceExercises].map(ex => ({ ...ex, id: Date.now() + Math.random() }));
      });
    }

    const fullSchedule = days.map(day => ({
      day,
      exercises: finalExercises[day] || []
    }));

    const finalName = initialData ? initialData.name : workoutName;
    const finalPrivacy = initialData ? initialData.privacy : privacyMode;

    const newWorkout = {
      _id: initialData ? initialData._id : Date.now().toString(),
      name: finalName,
      privacy: finalPrivacy,
      schedule: fullSchedule,
      memberId: initialData ? initialData.memberId : null
    };

    onSubmit(newWorkout);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] overflow-y-auto ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#f8f9fa] text-black'}`}>
      <div className={`sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-1.5 rounded-lg"><Plus size={18} strokeWidth={3} /></div>
          <h1 className="text-[18px] font-black tracking-tight">{initialData ? 'Edit Workout Plan' : (workoutName || 'Create Workout Plan')}</h1>
        </div>
        <button onClick={onClose}><X size={24} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'} /></button>
      </div>
      <div className="p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        <div className="col-span-12 lg:col-span-3">
          <div className={`rounded-lg p-5 border h-fit ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className="flex justify-center text-[15px] font-bold mb-6">Assign Members</h3>
            <div className={`p-3 rounded-lg flex items-start gap-3 mb-6 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="mt-0.5 min-w-[16px] flex justify-center"><div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">i</div></div>
              <p className="text-[12px] font-medium leading-relaxed text-gray-500">Workout Plan can be assigned to members directly from here.</p>
            </div>
            <div className={`flex items-center border rounded-lg px-3 py-2.5 mb-2 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-300'}`}>
              <Search size={16} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search Members" className={`w-full bg-transparent text-[13px] font-bold outline-none ${isDarkMode ? 'text-white' : 'text-gray-700 placeholder-gray-400'}`} />
            </div>
            <p className="text-[11px] text-gray-400 font-medium pl-1">Search and Add members from here</p>
            <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}></div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {initialData && <h2 className="text-[16px] font-black">{initialData.name}</h2>}
          <h2 className="text-[16px] font-black">Weekly Workout Plan</h2>
          <div className="flex flex-wrap gap-6 border-b border-gray-200 dark:border-white/10 pb-1">
            {days.map(day => (
              <button key={day} onClick={() => setActiveDay(day)} className={`pb-3 text-[14px] font-bold transition-all relative ${activeDay === day ? 'text-[#f97316]' : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-black'}`}>
                {day}
                {activeDay === day && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f97316]"></div>}
              </button>
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-4">
            <span className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Copy To :-</span>
            {days.filter(d => d !== activeDay).map(day => (
              <label key={day} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={copyToDays.includes(day)} onChange={() => handleCopyToChange(day)} className="w-4 h-4 rounded-full border-gray-300 text-[#f97316] focus:ring-[#f97316]" />
                <span className={`text-[13px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{day}</span>
              </label>
            ))}
          </div>
          {exercisesPerDay[activeDay].length > 0 && (
            <div className="space-y-3">
              {exercisesPerDay[activeDay].map((ex, idx) => (
                <div key={ex.id} className={`p-4 rounded-lg border flex justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                  <div>
                    <span className="font-bold text-orange-500 text-xs block">{ex.category}</span>
                    <span className="font-bold text-sm block">{ex.exercise}</span>
                    <span className="text-xs text-gray-400">{ex.sets} Sets x {ex.reps} Reps @ {ex.weight}</span>
                  </div>
                  <button onClick={() => handleDeleteExercise(activeDay, ex.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><X size={16} /></button>
                </div>
              ))}
            </div>
          )}
          <div className={`rounded-xl border p-6 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-[15px] font-black">1. Workout</h3><button onClick={handleAddExercise} className="p-1 rounded-full hover:bg-gray-100"><Plus size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div><label className={`block text-[12px] font-bold mb-2 text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500`}>Exercise Category</label><input type="text" placeholder="Select Category" value={currentExercise.category} onChange={e => setCurrentExercise({ ...currentExercise, category: e.target.value })} className={`w-full px-4 py-3 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`} /></div>
              <div><label className={`block text-[12px] font-bold mb-2 text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500`}>Exercise</label><input type="text" placeholder="Select Exercise" value={currentExercise.exercise} onChange={e => setCurrentExercise({ ...currentExercise, exercise: e.target.value })} className={`w-full px-4 py-3 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className={`block text-[12px] font-bold mb-2 text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500`}>Reps</label><input type="text" placeholder="Enter Reps" value={currentExercise.reps} onChange={e => setCurrentExercise({ ...currentExercise, reps: e.target.value })} className={`w-full px-4 py-3 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`} /></div>
              <div><label className={`block text-[12px] font-bold mb-2 text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500`}>Sets</label><input type="text" placeholder="Enter Sets" value={currentExercise.sets} onChange={e => setCurrentExercise({ ...currentExercise, sets: e.target.value })} className={`w-full px-4 py-3 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`} /></div>
              <div><label className={`block text-[12px] font-bold mb-2 text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500`}>Weight/Time</label><input type="text" placeholder="Enter Weight" value={currentExercise.weight} onChange={e => setCurrentExercise({ ...currentExercise, weight: e.target.value })} className={`w-full px-4 py-3 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`} /></div>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed bottom-0 right-0 w-full p-4 border-t flex justify-end bg-white dark:bg-[#1e1e1e] ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button onClick={handleSubmit} className="bg-[#f97316] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md hover:bg-orange-600 transition-none">Submit</button>
      </div>
    </div>
  );
};

const ExerciseAccordion = ({ category, details, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full p-4 px-6 flex justify-between items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left outline-none"
      >
        <span className={`text-[14px] font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>
          {category || 'Uncategorized Exercise'}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={`border-t bg-gray-50/50 dark:bg-black/20 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x dark:divide-white/5 divide-gray-100">
            {/* Exercise Name */}
            <div className="p-4 flex-1 flex flex-col justify-center">
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {details.exercise || '-'}
              </span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Exercise Name</span>
            </div>

            {/* Sets */}
            <div className="p-4 w-full md:w-[150px] flex flex-col justify-center">
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {details.sets || '-'}
              </span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Sets</span>
            </div>

            {/* Reps */}
            <div className="p-4 w-full md:w-[220px] flex flex-col justify-center">
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {details.reps || '-'}
              </span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Reps</span>
            </div>

            {/* Weight/Time */}
            <div className="p-4 w-full md:w-[220px] flex flex-col justify-center">
              <span className={`text-[13px] font-black mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {details.weight || '-'}
              </span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Weight/Time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

const WorkoutPlanItem = ({ plan, isDarkMode, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(false);
  const actionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setActiveActionRow(false);
      }
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasExercises = plan.schedule && plan.schedule.some(day => day.exercises && day.exercises.length > 0);

  return (
    <div className={`rounded-xl border transition-all duration-200 ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-inner' : 'bg-white border-gray-200/60 shadow-sm'}`}>
      <div className={`p-5 flex items-center justify-between ${isExpanded ? 'border-b ' + (isDarkMode ? 'border-white/5' : 'border-gray-100') : ''}`}>
        <div className="flex flex-col">
          <span className={`text-[17px] font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>{plan.name}</span>
        </div>

        <div className="flex items-center gap-4 transition-none">
          {/* Search Members */}
          <div
            ref={inputRef}
            className={`relative hidden md:flex items-center rounded-lg border px-3 py-2 transition-all duration-200 ${isSearchActive
              ? 'border-[#f97316] ring-1 ring-[#f97316] w-[280px]'
              : isDarkMode ? 'border-white/10 bg-[#1a1a1a] w-[240px]' : 'border-gray-200 bg-[#f8f9fa] w-[240px]'
              }`}
            onClick={() => setIsSearchActive(true)}
          >
            <Search size={16} className={`mr-2 ${isSearchActive ? 'text-[#f97316]' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search Members"
              className={`w-full bg-transparent text-[13px] font-bold outline-none placeholder:font-medium placeholder:text-gray-400 ${isDarkMode ? 'text-white' : 'text-black'}`}
            />
            <ChevronDown size={14} className={`ml-2 ${isSearchActive ? 'text-[#f97316]' : 'text-gray-400'}`} />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronDown size={24} className={`text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          <div className="relative" ref={actionRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionRow(!activeActionRow);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <MoreVertical size={24} className="text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors" />
            </button>
            {activeActionRow && (
              <div className={`absolute right-0 top-full mt-2 w-[180px] rounded-xl shadow-2xl border z-50 overflow-hidden text-left ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100 font-bold'}`}>
                <div className="py-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(plan);
                      setActiveActionRow(false);
                    }}
                    className={`px-6 py-4 text-[15px] font-black border-b cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-gray-50'}`}
                  >
                    Edit
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(plan._id);
                      setActiveActionRow(false);
                    }}
                    className={`px-6 py-4 text-[15px] font-black cursor-pointer hover:pl-8 transition-all text-[#ff4444] ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-red-50'}`}
                  >
                    Delete
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-6 pt-6 animate-in fade-in slide-in-from-top-2">
          {hasExercises ? (
            plan.schedule.map((dayPlan, dIdx) => (
              dayPlan.exercises && dayPlan.exercises.length > 0 && (
                <div key={dIdx} className="space-y-4">
                  {/* Day Header - Fully matching Image 3 */}
                  <div className="w-full bg-[#fff7ed] border border-[#ffedd5] text-[#f97316] py-3 rounded-lg text-center text-[13px] font-black tracking-widest uppercase shadow-sm">
                    {dayPlan.day}
                  </div>
                  {/* Exercises */}
                  <div className="space-y-3">
                    {dayPlan.exercises.map((ex, eIdx) => (
                      <ExerciseAccordion
                        key={eIdx}
                        category={ex.category}
                        details={ex}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm font-medium italic">
              No exercises added to this workout plan yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-[400px] rounded-xl shadow-2xl p-6 relative ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-none"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="mb-6">
            <Trash2 size={48} className="text-[#ff4444]" fill="#ff4444" />
          </div>

          <h2 className="text-[22px] font-black text-[#333] dark:text-white mb-2 tracking-tight">
            Delete Workout Plan?
          </h2>

          <p className="text-[14px] font-medium text-gray-500 mb-8">
            Do you really want to delete?
          </p>

          <button
            onClick={onConfirm}
            className="w-full bg-[#ff4444] text-white py-3.5 rounded-xl text-[15px] font-black shadow-lg hover:bg-red-600 active:scale-95 transition-none flex items-center justify-center gap-3"
          >
            <Trash2 size={18} fill="currentColor" />
            Yes, Delete Workout Plan
          </button>
        </div>
      </div>
    </div>
  );
};

const MembersWorkoutCard = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Public');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  const [newWorkoutData, setNewWorkoutData] = useState({ name: '', privacy: '' });
  const [editingWorkout, setEditingWorkout] = useState(null);

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch('http://localhost:5000/api/admin/workouts', {
        headers: {
          'Authorization': `Bearer ${adminInfo?.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setWorkouts(data);
      } else {
        setWorkouts([]);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleCreateNext = (name, privacy) => {
    setNewWorkoutData({ name, privacy });
    setEditingWorkout(null);
    setIsModalOpen(false);
    setIsDetailsModalOpen(true);
  };

  const handleFinalSubmit = (workoutPlan) => {
    if (editingWorkout) {
      setWorkouts(prev => prev.map(w => w._id === workoutPlan._id ? workoutPlan : w));
    } else {
      setWorkouts(prev => [workoutPlan, ...prev]);
    }

    setIsDetailsModalOpen(false);
    setEditingWorkout(null);
    setNewWorkoutData({ name: '', privacy: '' });

    if (workoutPlan.privacy === 'Public') setActiveTab('Public');
    else setActiveTab('Private');
  };

  const handleEdit = (plan) => {
    setEditingWorkout(plan);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (planId) => {
    setWorkoutToDelete(planId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workoutToDelete) {
      setWorkouts(prev => prev.filter(w => w._id !== workoutToDelete));
      setIsDeleteModalOpen(false);
      setWorkoutToDelete(null);
    }
  };

  const publicWorkouts = activeTab === 'Public' ? workouts : [];
  const currentWorkouts = publicWorkouts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight uppercase">Members Workout Card</h1>
        <button
          onClick={() => {
            setEditingWorkout(null);
            setIsModalOpen(true);
          }}
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
          <p className="text-[14px] font-black text-gray-500 pt-2 tracking-tight uppercase">All Workout Plan(s) ({publicWorkouts.length})</p>

          {/* Workout List */}
          <div className="space-y-4 transition-none min-h-[400px]">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : currentWorkouts.length > 0 ? (
              currentWorkouts.map((plan, idx) => (
                <WorkoutPlanItem
                  key={idx}
                  plan={plan}
                  isDarkMode={isDarkMode}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">No workout plans found.</div>
            )}
          </div>

          {/* Pagination */}
          <div className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-none`}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2.5 border rounded-xl font-black text-[13px] bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50"
              >
                « Previous
              </button>

              {Array.from({ length: Math.ceil(publicWorkouts.length / rowsPerPage) || 1 }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-11 h-11 rounded-xl font-black text-[13px] shadow-lg transition-none ${currentPage === page ? 'bg-[#f97316] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(publicWorkouts.length / rowsPerPage) || 1, prev + 1))}
                disabled={currentPage === (Math.ceil(publicWorkouts.length / rowsPerPage) || 1)}
                className="px-6 py-2.5 border rounded-xl font-black text-[13px] bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50"
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
          <div className="text-center py-20 text-gray-500">No private workout plans found.</div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDarkMode={isDarkMode}
      />

      <CreateWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
        onNext={handleCreateNext}
      />

      <CreateWorkoutDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setEditingWorkout(null);
        }}
        isDarkMode={isDarkMode}
        workoutName={newWorkoutData.name}
        privacyMode={newWorkoutData.privacy}
        initialData={editingWorkout}
        onSubmit={handleFinalSubmit}
      />
    </div>
  );
};

export default MembersWorkoutCard;
