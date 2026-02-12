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
import { API_BASE_URL } from '../../../../config/api';
import toast from 'react-hot-toast';

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
        className={`flex items-center justify-between w-[70px] px-3 py-2 border rounded-lg cursor-pointer ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white text-[#f97316] border-[#f97316] shadow-sm'
          }`}
      >
        <span className="text-[14px] font-bold">{rowsPerPage}</span>
        <ChevronDown size={14} className="text-[#f97316]" />
      </div>

      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-1 w-[80px] rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
          {[5, 10, 20, 50].map((rows) => (
            <div
              key={rows}
              onClick={() => {
                setRowsPerPage(rows);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-[14px] font-bold text-center cursor-pointer hover:bg-gray-100 ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
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
  const [copyRoutes, setCopyRoutes] = useState({}); // { 'Monday': ['Wednesday', 'Friday'] }
  const [exercisesPerDay, setExercisesPerDay] = useState(() => {
    const initial = {};
    days.forEach(day => initial[day] = []);
    return initial;
  });

  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

  const [localName, setLocalName] = useState('');
  const [localPrivacy, setLocalPrivacy] = useState('');

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
      setSelectedMembers(initialData.assignedMembers || []);
      setLocalName(initialData.name || '');
      setLocalPrivacy(initialData.privacyMode || 'Public');
    } else if (isOpen) {
      const initial = {};
      days.forEach(day => initial[day] = []);
      setExercisesPerDay(initial);
      setActiveDay('Monday');
      setCopyRoutes({});
      setCurrentExercise({ category: '', exercise: '', reps: '', sets: '', weight: '' });
      setSelectedMembers([]);
      setLocalName(workoutName || '');
      setLocalPrivacy(privacyMode || 'Public');
    }
  }, [initialData, isOpen, workoutName, privacyMode]);

  useEffect(() => {
    const searchMembers = async () => {
      if (memberSearch.trim().length < 2) {
        setMemberResults([]);
        return;
      }
      try {
        setIsSearchingMembers(true);
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const response = await fetch(`${API_BASE_URL}/api/admin/members?keyword=${memberSearch}`, {
          headers: {
            'Authorization': `Bearer ${adminInfo?.token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setMemberResults(data.members || []);
        }
      } catch (err) {
        console.error('Error searching members:', err);
      } finally {
        setIsSearchingMembers(false);
      }
    };
    const timer = setTimeout(searchMembers, 500);
    return () => clearTimeout(timer);
  }, [memberSearch]);

  const toggleMemberSelection = (member) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => (m._id || m) === member._id);
      if (isSelected) {
        return prev.filter(m => (m._id || m) !== member._id);
      } else {
        return [...prev, member];
      }
    });
  };

  const [currentExercise, setCurrentExercise] = useState({ category: '', exercise: '', reps: '', sets: '', weight: '' });

  if (!isOpen) return null;

  const handleCopyToChange = (targetDay) => {
    // Check if currently selected BEFORE state update
    const currentTargets = copyRoutes[activeDay] || [];
    const isCurrentlySelected = currentTargets.includes(targetDay);

    // 1. Update Routes Selection (State)
    setCopyRoutes(prev => {
      const current = prev[activeDay] || [];
      const newTargets = isCurrentlySelected
        ? current.filter(d => d !== targetDay)
        : [...current, targetDay];
      return { ...prev, [activeDay]: newTargets };
    });

    // 2. If Selecting (Checking) -> Immediate Copy of Existing Exercises
    if (!isCurrentlySelected) {
      const currentExercises = exercisesPerDay[activeDay] || [];
      if (currentExercises.length > 0) {
        const newExercisesForTarget = currentExercises.map(ex => ({
          ...ex,
          id: Date.now() + Math.random() // Unique IDs for copies
        }));

        setExercisesPerDay(prev => ({
          ...prev,
          [targetDay]: [...(prev[targetDay] || []), ...newExercisesForTarget]
        }));

        toast.success(`Copied ${currentExercises.length} exercises to ${targetDay}`);
      }
    }
  };

  const handleAddExercise = () => {
    if (!currentExercise.category || !currentExercise.exercise) {
      toast.error("Please fill in Category and Exercise");
      return;
    }
    const newExercise = { ...currentExercise, id: Date.now() };

    setExercisesPerDay(prev => {
      const newState = { ...prev };

      // Add to current active day
      newState[activeDay] = [...newState[activeDay], newExercise];

      // Auto-copy to selected target days for this active day
      const targets = copyRoutes[activeDay] || [];
      targets.forEach(targetDay => {
        // Create a unique instance for the copy
        const copyExercise = { ...newExercise, id: Date.now() + Math.random() };
        newState[targetDay] = [...newState[targetDay], copyExercise];
      });

      if (targets.length > 0) {
        toast.success(`Added to ${activeDay} and copied to ${targets.length} other days`);
      } else {
        toast.success('Exercise added');
      }

      return newState;
    });

    setCurrentExercise({ category: '', exercise: '', reps: '', sets: '', weight: '' });
  };

  const handleDeleteExercise = (day, id) => {
    setExercisesPerDay(prev => ({ ...prev, [day]: prev[day].filter(ex => ex.id !== id) }));
  };

  const handleSubmit = () => {
    const finalExercises = { ...exercisesPerDay };

    // Auto-add pending exercise if fields are filled but not added
    if (currentExercise.category && currentExercise.exercise) {
      const pendingExercise = { ...currentExercise, id: Date.now() };
      finalExercises[activeDay] = [...finalExercises[activeDay], pendingExercise];

      // Also apply copy logic for pending exercise if any
      const targets = copyRoutes[activeDay] || [];
      targets.forEach(targetDay => {
        finalExercises[targetDay] = [...finalExercises[targetDay], { ...pendingExercise, id: Date.now() + Math.random() }];
      });
    }

    const fullSchedule = days.map(day => ({
      day,
      exercises: finalExercises[day] || []
    }));

    // Validate empty schedule
    if (fullSchedule.every(d => d.exercises.length === 0)) {
      toast.error("Please add at least one exercise");
      return;
    }

    const finalName = localName || workoutName;
    const finalPrivacy = localPrivacy || privacyMode;

    const newWorkout = {
      _id: initialData ? initialData._id : undefined,
      name: finalName,
      privacyMode: finalPrivacy,
      schedule: fullSchedule,
      assignedMembers: selectedMembers.map(m => m._id || m)
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
      <div className="p-6 pb-40 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        <div className="col-span-12 lg:col-span-3">
          <div className={`rounded-lg p-5 border h-fit ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className="flex justify-center text-[15px] font-bold mb-6 uppercase tracking-tight">Assign Members</h3>
            <div className={`p-4 rounded-xl flex items-start gap-4 mb-6 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-orange-50/50 border border-orange-100'}`}>
              <div className="mt-1 min-w-[20px] flex justify-center"><div className="w-5 h-5 rounded-full bg-[#f97316] text-white flex items-center justify-center text-[10px] font-bold">i</div></div>
              <p className="text-[12px] font-bold leading-relaxed text-gray-500">Workout Plan can be assigned to members directly from here.</p>
            </div>
            <div className="relative mb-6">
              <div className={`flex items-center border rounded-xl px-4 py-3 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-300 focus-within:border-[#f97316]'}`}>
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search Members"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className={`w-full bg-transparent text-[13px] font-bold outline-none ${isDarkMode ? 'text-white' : 'text-gray-700 placeholder-gray-400'}`}
                />
              </div>

              {isSearchingMembers && <div className="text-center py-2 text-xs text-gray-400">Searching...</div>}

              {memberResults.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border z-50 max-h-[250px] overflow-y-auto ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                  {memberResults.map(member => (
                    <div
                      key={member._id}
                      onClick={() => toggleMemberSelection(member)}
                      className={`p-4 cursor-pointer flex justify-between items-center border-b last:border-0 ${isDarkMode ? 'hover:bg-white/5 border-white/5' : 'hover:bg-orange-50 border-gray-50'}`}
                    >
                      <div>
                        <p className="text-sm font-bold">{member.firstName} {member.lastName}</p>
                        <p className="text-[10px] opacity-60">ID: {member.memberId}</p>
                      </div>
                      {selectedMembers.some(m => (m._id || m) === member._id) ? (
                        <div className="bg-green-500 text-white rounded-full p-1"><X size={12} /></div>
                      ) : (
                        <Plus size={16} className="text-[#f97316]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider mb-2">Selected Members ({selectedMembers.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member, idx) => (
                  <div key={idx} className="bg-[#f97316]/10 border border-[#f97316]/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="text-[11px] font-black text-[#f97316]">{typeof member === 'object' ? `${member.firstName} ${member.lastName}` : 'Member'}</span>
                    <button onClick={() => toggleMemberSelection(member)}><X size={12} className="text-[#f97316]" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {initialData && <h2 className="text-[16px] font-black opacity-60">Editing: {initialData.name}</h2>}
          <h2 className="text-[16px] font-black uppercase tracking-tight">Weekly Workout Plan</h2>
          <div className="flex flex-wrap gap-6 border-b border-gray-200 dark:border-white/10 pb-1">
            {days.map(day => (
              <button
                key={day}
                onClick={() => {
                  setActiveDay(day);
                }}
                className={`pb-3 text-[14px] font-bold transition-all relative uppercase tracking-wider flex items-center gap-1 ${activeDay === day ? 'text-[#f97316]' : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-black'}`}
              >
                {day}
                {/* Show indicator if this day is a target for the currently active day */}
                {(copyRoutes[activeDay] || []).includes(day) && (
                  <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 px-1.5 py-0.5 rounded ml-1 normal-case font-black animate-pulse">
                    (Target)
                  </span>
                )}
                {/* Show indicator if this day HAS its own copy targets set */}
                {(copyRoutes[day] && copyRoutes[day].length > 0) && activeDay !== day && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded ml-1 normal-case font-black">
                    Wait→
                  </span>
                )}
                {activeDay === day && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#f97316] rounded-t-full"></div>}
              </button>
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-4">
            <span className={`text-[13px] font-bold uppercase tracking-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Copy To :-</span>
            {days.filter(d => d !== activeDay).map(day => (
              <label key={day} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(copyRoutes[activeDay] || []).includes(day)}
                  onChange={() => handleCopyToChange(day)}
                  className="w-4 h-4 rounded border-gray-300 text-[#f97316] focus:ring-[#f97316] cursor-pointer"
                />
                <span className={`text-[12px] font-bold transition-colors group-hover:text-[#f97316] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day}
                </span>
              </label>
            ))}
          </div>
          {exercisesPerDay[activeDay].length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercisesPerDay[activeDay].map((ex, idx) => (
                <div key={ex.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
                  <div>
                    <span className="font-black text-[#f97316] text-[10px] block uppercase tracking-widest mb-1">{ex.category}</span>
                    <span className="font-black text-[15px] block mb-1">{ex.exercise}</span>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-[11px] font-bold">Sets: {ex.sets}</div>
                      <div className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-[11px] font-bold">Reps: {ex.reps}</div>
                      <div className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-[11px] font-bold">{ex.weight}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteExercise(activeDay, ex.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"><X size={18} /></button>
                </div>
              ))}
            </div>
          )}
          <div className={`rounded-2xl border p-8 ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-8 border-b dark:border-white/5 pb-4">
              <h3 className="text-[17px] font-black uppercase tracking-tight">Add New Exercise</h3>
              <Plus size={20} className="text-[#f97316]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#f97316]">Exercise Category</label>
                <input
                  type="text"
                  placeholder="e.g. Chest, Back, Legs"
                  value={currentExercise.category}
                  onChange={e => setCurrentExercise({ ...currentExercise, category: e.target.value })}
                  className={`w-full px-5 py-4 border rounded-xl text-[14px] font-bold outline-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-[#f97316]' : 'bg-[#fcfcfc] border-gray-300 text-black focus:border-[#f97316]'}`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black mb-2 uppercase tracking-widest text-[#f97316]">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bench Press"
                  value={currentExercise.exercise}
                  onChange={e => setCurrentExercise({ ...currentExercise, exercise: e.target.value })}
                  className={`w-full px-5 py-4 border rounded-xl text-[14px] font-bold outline-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-[#f97316]' : 'bg-[#fcfcfc] border-gray-300 text-black focus:border-[#f97316]'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-[11px] font-black mb-2 uppercase tracking-widest text-gray-500">Reps</label>
                <input
                  type="text"
                  placeholder="12-15"
                  value={currentExercise.reps}
                  onChange={e => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                  className={`w-full px-5 py-4 border rounded-xl text-[14px] font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black mb-2 uppercase tracking-widest text-gray-500">Sets</label>
                <input
                  type="text"
                  placeholder="3"
                  value={currentExercise.sets}
                  onChange={e => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                  className={`w-full px-5 py-4 border rounded-xl text-[14px] font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black mb-2 uppercase tracking-widest text-gray-500">Weight/Time</label>
                <input
                  type="text"
                  placeholder="20kg / 30s"
                  value={currentExercise.weight}
                  onChange={e => setCurrentExercise({ ...currentExercise, weight: e.target.value })}
                  className={`w-full px-5 py-4 border rounded-xl text-[14px] font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-[#fcfcfc] border-gray-300 text-black'}`}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAddExercise}
                className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                <Plus size={18} strokeWidth={3} />
                Add To Plan
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed bottom-0 right-0 z-50 w-full p-6 border-t flex justify-end gap-6 bg-white dark:bg-[#1e1e1e] ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={onClose}
          className={`px-10 py-4 rounded-xl text-[13px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#f97316] text-white px-12 py-4 rounded-xl text-[14px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95"
        >
          Save Workout Plan
        </button>
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

const WorkoutPlanItem = ({ plan, isDarkMode, onEdit, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
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

  const hasExercises = plan.schedule && plan.schedule.some(day => day.exercises && day.exercises.length > 0);

  const handleRemoveMember = async (memberId) => {
    const updatedPlan = {
      ...plan,
      assignedMembers: plan.assignedMembers.filter(m => (m._id || m) !== memberId).map(m => m._id || m)
    };
    onUpdate(updatedPlan);
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 ${isDarkMode ? 'bg-[#1a1a1a] border-white/5 shadow-inner' : 'bg-white border-gray-200/60 shadow-sm'}`}>
      <div className={`p-5 flex items-center justify-between ${isExpanded ? 'border-b ' + (isDarkMode ? 'border-white/5' : 'border-gray-100') : ''}`}>
        <div className="flex flex-col">
          <span className={`text-[17px] font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>{plan.name}</span>
        </div>

        <div className="flex items-center gap-4 transition-none">
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
                    className={`px-6 py-4 text-[13px] font-bold border-b cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-orange-50 hover:text-orange-600'}`}
                  >
                    Edit
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAssignModalOpen(true);
                      setActiveActionRow(false);
                    }}
                    className={`px-6 py-4 text-[13px] font-bold border-b cursor-pointer hover:pl-8 transition-all ${isDarkMode ? 'text-gray-300 border-white/5 hover:bg-white/5' : 'text-gray-700 border-gray-50 hover:bg-orange-50 hover:text-orange-600'}`}
                  >
                    Assign Members
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(plan);
                      setActiveActionRow(false);
                    }}
                    className={`px-6 py-4 text-[13px] font-bold cursor-pointer hover:pl-8 transition-all text-[#ff4444] ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-red-50'}`}
                  >
                    Delete
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Members Chips */}
      {plan.assignedMembers && plan.assignedMembers.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2 pt-2">
          {plan.assignedMembers.map((member, mIdx) => (
            <div key={mIdx} className="bg-orange-50 dark:bg-orange-950/20 text-[#f97316] px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-2 border border-orange-100 dark:border-orange-900/30">
              {typeof member === 'object' ? `${member.firstName} ${member.lastName}` : 'Member'}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMember(member._id || member);
                }}
                className="hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

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

      <AssignMembersModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        isDarkMode={isDarkMode}
        plan={plan}
        onUpdate={onUpdate}
      />
    </div>
  );
};

const AssignMembersModal = ({ isOpen, onClose, isDarkMode, plan, onUpdate }) => {
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchMembers = async () => {
      if (memberSearch.trim().length < 2) {
        setMemberResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const response = await fetch(`${API_BASE_URL}/api/admin/members?keyword=${memberSearch}`, {
          headers: {
            'Authorization': `Bearer ${adminInfo?.token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setMemberResults(data.members || []);
        }
      } catch (err) {
        console.error('Error searching members:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchMembers, 500);
    return () => clearTimeout(timer);
  }, [memberSearch]);

  const handleAssign = (member) => {
    const isAlreadyAssigned = plan.assignedMembers?.some(m => (m._id || m) === member._id);
    if (isAlreadyAssigned) {
      toast.error('Member already assigned');
      return;
    }

    const updatedPlan = {
      ...plan,
      assignedMembers: [...(plan.assignedMembers || []).map(m => m._id || m), member._id]
    };

    onUpdate(updatedPlan);
    setMemberSearch('');
  };

  const handleRemove = (memberId) => {
    const updatedPlan = {
      ...plan,
      assignedMembers: plan.assignedMembers.filter(m => (m._id || m) !== memberId).map(m => m._id || m)
    };
    onUpdate(updatedPlan);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-[500px] rounded-2xl shadow-2xl ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className="p-6 border-b dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#f97316]/10 p-2 rounded-lg">
              <Plus size={20} className="text-[#f97316]" />
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Assign Members</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative">
            <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Search Member
            </label>
            <div className={`flex items-center border rounded-xl px-4 py-3 transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 focus-within:border-[#f97316]'}`}>
              <Search size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Enter member name or ID..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:font-medium text-black dark:text-white"
              />
            </div>

            {isSearching && <p className="text-xs mt-2 text-center text-gray-400 animate-pulse">Searching...</p>}

            {memberResults.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border z-20 max-h-[200px] overflow-y-auto ${isDarkMode ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-100'}`}>
                {memberResults.map(member => (
                  <div
                    key={member._id}
                    onClick={() => handleAssign(member)}
                    className={`p-4 cursor-pointer flex justify-between items-center transition-colors ${isDarkMode ? 'hover:bg-white/5 border-b border-white/5' : 'hover:bg-orange-50 border-b border-gray-50 hover:text-[#f97316]'}`}
                  >
                    <div>
                      <p className="text-sm font-bold">{member.firstName} {member.lastName}</p>
                      <p className="text-[10px] opacity-60">ID: {member.memberId}</p>
                    </div>
                    <Plus size={16} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Assigned Members ({plan.assignedMembers?.length || 0})
            </label>
            <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-2">
              {plan.assignedMembers?.map((member, idx) => (
                <div key={idx} className="bg-[#f97316]/5 border border-[#f97316]/20 px-3 py-1.5 rounded-full flex items-center gap-2 group transition-all hover:bg-[#f97316]/10">
                  <span className="text-[13px] font-bold text-[#f97316]">
                    {typeof member === 'object' ? `${member.firstName} ${member.lastName}` : 'Member'}
                  </span>
                  <button onClick={() => handleRemove(member._id || member)}>
                    <X size={14} className="text-[#f97316] hover:text-red-500 transition-colors" />
                  </button>
                </div>
              ))}
              {(!plan.assignedMembers || plan.assignedMembers.length === 0) && (
                <p className="text-[12px] text-gray-500 italic">No members assigned yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-sm font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}


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
      const response = await fetch(`${API_BASE_URL}/api/admin/workouts`, {
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
      toast.error('Error fetching workout plans');
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

  const handleUpdateWorkout = async (updatedPlan) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/workouts/${updatedPlan._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo?.token}`
        },
        body: JSON.stringify(updatedPlan)
      });

      const data = await response.json();
      if (response.ok) {
        setWorkouts(prev => prev.map(w => w._id === data._id ? data : w));
        toast.success('Workout plan updated successfully');
      } else {
        toast.error(data.message || 'Failed to update workout plan');
      }
    } catch (err) {
      console.error('Error updating workout:', err);
      toast.error('Error updating workout plan');
    }
  };

  const handleFinalSubmit = async (workoutPlan) => {
    if (editingWorkout) {
      await handleUpdateWorkout(workoutPlan);
    } else {
      try {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));

        // Filter out empty exercises to avoid validation errors
        const cleanedSchedule = workoutPlan.schedule.map(day => ({
          ...day,
          exercises: day.exercises.filter(ex => ex.exercise && ex.exercise.trim() !== '')
        }));

        if (cleanedSchedule.reduce((sum, day) => sum + day.exercises.length, 0) === 0) {
          toast.error('Please add at least one exercise');
          return;
        }

        const submissionData = {
          ...workoutPlan,
          schedule: cleanedSchedule,
          privacyMode: newWorkoutData.privacy, // Map from frontend 'privacy' to backend 'privacyMode'
          trainerId: adminInfo?._id
        };

        const response = await fetch(`${API_BASE_URL}/api/admin/workouts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminInfo?.token}`
          },
          body: JSON.stringify(submissionData)
        });

        const data = await response.json();
        if (response.ok) {
          setWorkouts(prev => [data, ...prev]);
          setIsDetailsModalOpen(false);
          setEditingWorkout(null);
          setNewWorkoutData({ name: '', privacy: '' });
          setActiveTab(data.privacyMode === 'Public' ? 'Public' : 'Private');
          toast.success('Workout plan created successfully');
        } else {
          toast.error(data.message || 'Failed to create workout plan');
        }
      } catch (err) {
        console.error('Error creating workout:', err);
        toast.error('Error creating workout plan');
      }
    }
  };

  const handleEdit = (plan) => {
    setEditingWorkout(plan);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (plan) => {
    setWorkoutToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!workoutToDelete) return;

    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/workouts/${workoutToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminInfo?.token}`
        }
      });

      if (response.ok) {
        setWorkouts(prev => prev.filter(w => w._id !== workoutToDelete._id));
        setIsDeleteModalOpen(false);
        setWorkoutToDelete(null);
        toast.success('Workout plan deleted successfully');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete workout plan');
      }
    } catch (err) {
      console.error('Error deleting workout:', err);
      toast.error('Error deleting workout plan');
    }
  };

  const filteredWorkouts = workouts.filter(w => w.privacyMode === activeTab);
  const currentWorkouts = filteredWorkouts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
          onClick={() => { setActiveTab('Public'); setCurrentPage(1); }}
          className={`px-40 py-5 text-[15px] font-black transition-none border-b-4 -mb-[2px] ${activeTab === 'Public' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Public
        </button>
        <button
          onClick={() => { setActiveTab('Private'); setCurrentPage(1); }}
          className={`px-40 py-5 text-[15px] font-black transition-none border-b-4 -mb-[2px] ${activeTab === 'Private' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Private
        </button>
      </div>

      <p className="text-[14px] font-black text-gray-500 pt-2 tracking-tight uppercase">All Workout Plan(s) ({filteredWorkouts.length})</p>

      {/* Workout List */}
      <div className="space-y-4 transition-none min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : currentWorkouts.length > 0 ? (
          currentWorkouts.map((plan, idx) => (
            <WorkoutPlanItem
              key={plan._id || idx}
              plan={plan}
              isDarkMode={isDarkMode}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onUpdate={handleUpdateWorkout}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-tight opacity-50">No {activeTab.toLowerCase()} workout plans found.</div>
        )}
      </div>

      {/* Pagination */}
      {filteredWorkouts.length > 0 && (
        <div className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-none`}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-6 py-2.5 border rounded-xl font-black text-[13px] bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-gray-300"
            >
              « Previous
            </button>

            {Array.from({ length: Math.ceil(filteredWorkouts.length / rowsPerPage) || 1 }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-11 h-11 rounded-xl font-black text-[13px] shadow-lg transition-none ${currentPage === page ? 'bg-[#f97316] text-white' : 'bg-white text-gray-600 border border-gray-200 dark:bg-white/5 dark:border-white/10 dark:text-gray-300'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredWorkouts.length / rowsPerPage) || 1, prev + 1))}
              disabled={currentPage === (Math.ceil(filteredWorkouts.length / rowsPerPage) || 1)}
              className="px-6 py-2.5 border rounded-xl font-black text-[13px] bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-gray-300"
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
