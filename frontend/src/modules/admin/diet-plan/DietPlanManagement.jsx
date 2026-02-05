import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  X,
  Edit2,
  Trash2,
  Utensils
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';
import toast from 'react-hot-toast';

const RowsPerPageDropdown = ({ rowsPerPage, setRowsPerPage, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on click outside logic is good.
  // ... (rest of dropdown logic)
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

const CreateDietPlanModal = ({ isOpen, onClose, isDarkMode, onNext }) => {
  if (!isOpen) return null;
  const [privacyMode, setPrivacyMode] = useState('Select');
  const [planName, setPlanName] = useState('');
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

  const handleCreate = () => {
    if (planName.trim() && privacyMode !== 'Select') {
      onNext(planName, privacyMode);
    } else {
      alert('Please enter a plan name and select a privacy mode.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
      <div className={`w-[500px] rounded-lg shadow-2xl transition-all ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1 rounded">
              <Utensils size={16} fill="white" />
            </div>
            <h3 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Create Diet Plan</h3>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>Diet Plan</label>
            <input
              type="text"
              placeholder="Type diet plan name here..."
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-black placeholder-gray-400'
                }`}
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className={`block text-[13px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>Privacy Mode</label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-4 py-2.5 border rounded-lg text-[14px] font-medium outline-none cursor-pointer flex items-center justify-between ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : `bg-white ${isDropdownOpen ? 'border-[#f97316] text-[#f97316]' : 'border-gray-300 text-gray-500'}`
                }`}
            >
              <span>{privacyMode}</span>
              <ChevronDown size={14} className={isDropdownOpen ? 'text-[#f97316]' : 'text-black'} />
            </div>

            {isDropdownOpen && (
              <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                {['Public', 'Private'].map(mode => (
                  <div
                    key={mode}
                    onClick={() => {
                      setPrivacyMode(mode);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-3 text-[14px] cursor-pointer hover:bg-gray-50 font-medium ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700'}`}
                  >
                    {mode}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-[14px] font-bold border transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-none"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

// Edit Diet Plan Modal - Full Screen with 7 Days and Dynamic Cards
const EditDietPlanModal = ({ isOpen, onClose, isDarkMode, plan, onUpdate }) => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [dietCardsPerDay, setDietCardsPerDay] = useState({});
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (plan && plan.weeklyPlan) {
      const mappedData = {};
      days.forEach(day => mappedData[day] = []);

      plan.weeklyPlan.forEach(dayObj => {
        // Ensure IDs exist for keys
        const meals = (dayObj.meals || []).map((m, idx) => ({
          ...m,
          id: m.id || m._id || `${dayObj.day}-${idx}-${Date.now()}`
        }));
        mappedData[dayObj.day] = meals;
      });
      // Ensure all days are initialized
      days.forEach(day => {
        if (!mappedData[day]) mappedData[day] = [];
      });

      setDietCardsPerDay(mappedData);
    }
  }, [plan, isOpen]);

  if (!isOpen || !plan) return null;

  const currentDayCards = dietCardsPerDay[activeDay] || [];

  const handleUpdateCard = (cardId, field, value) => {
    setDietCardsPerDay(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    }));
  };

  // Delete card function
  const handleDeleteCard = (cardId) => {
    setDietCardsPerDay(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].filter(card => card.id !== cardId)
    }));
  };

  // Add new card function
  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      foodType: 'VEG',
      mealType: 'Breakfast',
      quantity: '1',
      unit: 'Glass',
      timing: '08:00',
      itemName: '',
      description: ''
    };

    setDietCardsPerDay(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newCard]
    }));
  };

  const handleSubmit = () => {
    const weeklyPlan = days.map(day => ({
      day,
      meals: (dietCardsPerDay[day] || []).filter(meal => meal.itemName && meal.itemName.trim() !== '')
    }));

    const updatedPlan = {
      ...plan,
      weeklyPlan
    };

    onUpdate(updatedPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#1e1e1e] overflow-y-auto">
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1 rounded">
              <Utensils size={16} fill="white" />
            </div>
            <h3 className={`text-[16px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Edit Diet Plan</h3>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Diet Plan Name */}
        <div className="px-6 pb-4">
          <h2 className={`text-[14px] font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {plan.name || 'Diet Plan'}
          </h2>
        </div>

        {/* Day Tabs */}
        <div className="px-6 flex gap-4 overflow-x-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`pb-3 px-2 text-[14px] font-bold whitespace-nowrap border-b-2 transition-none ${activeDay === day
                ? 'border-[#f97316] text-[#f97316]'
                : isDarkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Diet Cards Container */}
      <div className="px-6 py-6 space-y-4 max-w-7xl mx-auto">
        {currentDayCards.map((card, index) => {
          const isLastCard = index === currentDayCards.length - 1;

          return (
            <div
              key={card.id}
              className={`rounded-lg border p-6 relative ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}
            >
              {/* Delete and Plus Icons - Only on Last Card */}
              {isLastCard && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className={`p-1.5 rounded hover:bg-red-50 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 hover:text-red-600'
                      }`}
                    title="Delete Card"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={handleAddCard}
                    className={`p-1.5 rounded hover:bg-green-50 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-green-500' : 'text-gray-600 hover:text-green-600'
                      }`}
                    title="Add Card"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              )}

              {/* First Section - Food Type, Meal Type, Quantity, Unit, Timing */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                {/* Food Type */}
                <div>
                  <label className={`block text-[11px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Food Type*
                  </label>
                  <select
                    value={card.foodType}
                    onChange={(e) => handleUpdateCard(card.id, 'foodType', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode
                      ? 'bg-[#0d0d0d] border-white/10 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                      }`}
                  >
                    <option>VEG</option>
                    <option>NON-VEG</option>
                    <option>VEGAN</option>
                  </select>
                </div>

                {/* Meal Type */}
                <div>
                  <label className={`block text-[11px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Meal Type*
                  </label>
                  <select
                    value={card.mealType}
                    onChange={(e) => handleUpdateCard(card.id, 'mealType', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode
                      ? 'bg-[#0d0d0d] border-white/10 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                      }`}
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Evening Snacks</option>
                    <option>Dinner</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className={`block text-[11px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quantity*
                  </label>
                  <input
                    type="text"
                    value={card.quantity}
                    onChange={(e) => handleUpdateCard(card.id, 'quantity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode
                      ? 'bg-[#0d0d0d] border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'
                      }`}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className={`block text-[11px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Unit*
                  </label>
                  <select
                    value={card.unit}
                    onChange={(e) => handleUpdateCard(card.id, 'unit', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode
                      ? 'bg-[#0d0d0d] border-white/10 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                      }`}
                  >
                    <option>Glass</option>
                    <option>Cup</option>
                    <option>Plate</option>
                    <option>Bowl</option>
                    <option>Piece</option>
                  </select>
                </div>

                {/* Timing */}
                <div>
                  <label className={`block text-[11px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Timing*
                  </label>
                  <input
                    type="time"
                    value={card.timing}
                    onChange={(e) => handleUpdateCard(card.id, 'timing', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode
                      ? 'bg-[#0d0d0d] border-white/10 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                      }`}
                  />
                </div>
              </div>

              {/* Second Section - Item Name */}
              <div className="mb-4">
                <label className={`block text-[11px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Item Name*
                </label>
                <input
                  type="text"
                  value={card.itemName}
                  onChange={(e) => handleUpdateCard(card.id, 'itemName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] font-medium outline-none ${isDarkMode
                    ? 'bg-[#0d0d0d] border-white/10 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'
                    }`}
                />
              </div>

              {/* Third Section - Description */}
              <div>
                <label className={`block text-[11px] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Description*
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe Diet here..."
                  value={card.description}
                  onChange={(e) => handleUpdateCard(card.id, 'description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-[13px] font-medium outline-none resize-none ${isDarkMode
                    ? 'bg-[#0d0d0d] border-white/10 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'
                    }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - Submit Button */}
      <div className={`sticky bottom-0 border-t px-6 py-4 flex justify-end ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
        <button
          onClick={handleSubmit}
          className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-none"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

const MealAccordion = ({ mealType, foods, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-lg border overflow-hidden transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex justify-between items-center cursor-pointer transition-none"
      >
        <span className={`text-[15px] font-black ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{mealType}</span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-black'}`} />
      </div>

      {isOpen && (
        <div className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          {foods.map((item, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row border-b last:border-b-0 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div className={`p-4 w-full md:w-[120px] flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={`text-[13px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.foodType}</span>
                <span className="text-[11px] text-gray-500 font-medium">Food Type</span>
              </div>
              <div className={`p-4 w-full md:w-[120px] flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={`text-[13px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.timing}</span>
                <span className="text-[11px] text-gray-500 font-medium">Timing</span>
              </div>
              <div className={`p-4 flex-1 flex flex-col justify-center border-r ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={`text-[13px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.itemName}</span>
                <span className="text-[11px] text-gray-500 font-medium">Diet</span>
              </div>
              <div className="p-4 w-full md:w-[200px] flex items-center">
                <span className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.quantity} {item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DietPlanItem = ({ plan, isDarkMode, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const actionRef = useRef(null);
  const inputRef = useRef(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

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

  const handleAssignMember = async (member) => {
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
    setMemberResults([]);
    setIsSearchActive(false);
  };

  const handleRemoveMember = async (memberId) => {
    const updatedPlan = {
      ...plan,
      assignedMembers: plan.assignedMembers.filter(m => (m._id || m) !== memberId).map(m => m._id || m)
    };
    onUpdate(updatedPlan);
  };

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

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  return (
    <div className={`rounded-xl border transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="p-4 flex items-center justify-between">
        <span className={`text-[16px] font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>{plan.name}</span>
        <div className="flex items-center gap-6 transition-none">
          {/* Search Members - Input version (Image 3) */}
          <div
            ref={inputRef}
            className={`relative min-w-[240px] transition-all flex items-center rounded-lg border px-3 py-2 ${isSearchActive
              ? 'border-[#f97316] ring-1 ring-[#f97316]'
              : isDarkMode ? 'border-white/10 bg-[#1a1a1a]' : 'border-gray-200 bg-[#f8f9fa]'
              }`}
          >
            <Search size={16} className={`mr-2 ${isSearchActive ? 'text-[#f97316]' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search Members"
              value={memberSearch}
              onChange={(e) => {
                setMemberSearch(e.target.value);
                setIsSearchActive(true);
              }}
              onFocus={() => setIsSearchActive(true)}
              className={`w-full bg-transparent text-[14px] font-bold outline-none placeholder:font-medium placeholder:text-gray-400 ${isDarkMode ? 'text-white' : 'text-[#f97316]'
                }`}
            />
            <ChevronDown size={16} className={`ml-2 ${isSearchActive ? 'text-[#f97316]' : 'text-gray-400'}`} />

            {isSearchActive && memberResults.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl border z-30 max-h-[200px] overflow-y-auto ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                {memberResults.map(member => (
                  <div
                    key={member._id}
                    onClick={() => handleAssignMember(member)}
                    className={`px-4 py-2 text-[13px] font-bold cursor-pointer transition-all ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-orange-50 hover:text-[#f97316]'}`}
                  >
                    <div className="flex justify-between">
                      <span>{member.firstName} {member.lastName}</span>
                      <span className="text-[10px] opacity-60">{member.memberId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setIsExpanded(!isExpanded)}>
            <ChevronDown size={20} className={`text-gray-400 cursor-pointer transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          <div className="relative" ref={actionRef}>
            <button onClick={() => setActiveActionRow(!activeActionRow)}>
              <MoreVertical size={20} className="text-gray-400 cursor-pointer hover:text-black dark:hover:text-white" />
            </button>
            {activeActionRow && (
              <div className={`absolute right-0 top-full mt-2 w-[180px] rounded-lg shadow-2xl border z-20 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
                {['Edit', 'Assign Members', 'Delete'].map((action, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (action === 'Edit') {
                        setIsEditModalOpen(true);
                      } else if (action === 'Assign Members') {
                        setIsAssignModalOpen(true);
                      } else if (action === 'Delete') {
                        onDelete(plan); // Call the delete handler
                      }
                      setActiveActionRow(false);
                    }}
                    className={`px-5 py-3.5 text-[14px] font-medium border-b last:border-0 cursor-pointer hover:pl-6 transition-all ${isDarkMode
                      ? 'text-gray-300 border-white/5 hover:bg-white/5'
                      : 'text-gray-700 border-gray-50 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    {action}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Members Chips */}
      {plan.assignedMembers && plan.assignedMembers.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
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

      {/* Expanded Content (Weekly Schedule) */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {plan.weeklyPlan.map((dayData, dIdx) => (
            <div key={dIdx}>
              {/* Day Header */}
              <div className="w-full bg-[#fff7ed] border border-[#ffedd5] text-[#f97316] py-2 rounded-lg text-center text-[13px] font-bold mb-2 uppercase">
                {dayData.day}
              </div>

              {/* Meals */}
              <div className="space-y-4">
                {dayData.meals.map((meal, mIdx) => (
                  <MealAccordion key={mIdx} mealType={meal.mealType} foods={[meal]} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Diet Plan Modal */}
      <EditDietPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isDarkMode={isDarkMode}
        plan={plan}
        onUpdate={onUpdate}
      />

      {/* Assign Members Modal */}
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

const CreateDietPlanDetailsModal = ({ isOpen, onClose, isDarkMode, planName, privacyMode, onCreate }) => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [copyToDays, setCopyToDays] = useState([]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initial card structure
  const initialCard = {
    id: 1,
    foodType: 'VEG',
    mealType: 'Breakfast',
    quantity: '1',
    unit: 'Glass',
    timing: '08:00',
    itemName: '',
    description: ''
  };

  const [dietCardsPerDay, setDietCardsPerDay] = useState({
    Monday: [{ ...initialCard, id: Date.now() }],
    Tuesday: [{ ...initialCard, id: Date.now() + 1 }],
    Wednesday: [{ ...initialCard, id: Date.now() + 2 }],
    Thursday: [{ ...initialCard, id: Date.now() + 3 }],
    Friday: [{ ...initialCard, id: Date.now() + 4 }],
    Saturday: [{ ...initialCard, id: Date.now() + 5 }],
    Sunday: [{ ...initialCard, id: Date.now() + 6 }],
  });

  const [nextId, setNextId] = useState(2);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

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

  if (!isOpen) return null;

  const currentDayCards = dietCardsPerDay[activeDay] || [];

  const handleAddCard = () => {
    const newCard = {
      ...initialCard,
      id: Date.now()
    };

    setDietCardsPerDay(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newCard]
    }));
  };

  const handleDeleteCard = (cardId) => {
    setDietCardsPerDay(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].filter(card => card.id !== cardId)
    }));
  };

  const handleCopyToChange = (day) => {
    if (copyToDays.includes(day)) {
      setCopyToDays(copyToDays.filter(d => d !== day));
    } else {
      setCopyToDays([...copyToDays, day]);
    }
  };

  const handleCreatePlan = () => {
    // Construct the final diet cards map applying copyTo logic
    const finalDietCards = { ...dietCardsPerDay };

    // Apply the current active day's schedule to selected 'copy to' days
    copyToDays.forEach(targetDay => {
      // Deep copy to avoid reference issues
      finalDietCards[targetDay] = dietCardsPerDay[activeDay].map(card => ({ ...card, id: Date.now() + Math.random() }));
    });

    // Transform to weeklyPlan array format expected by the list component
    const weeklyPlan = days.map(day => ({
      day,
      meals: finalDietCards[day].filter(meal => meal.itemName && meal.itemName.trim() !== '')
    }));

    // Check if at least one meal across all days has been added
    const totalMeals = weeklyPlan.reduce((sum, day) => sum + day.meals.length, 0);
    if (totalMeals === 0) {
      toast.error('Please add at least one meal to the diet plan');
      return;
    }

    // Create the final plan object
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    const newPlan = {
      name: planName,
      privacyMode: privacyMode,
      weeklyPlan: weeklyPlan,
      assignedMembers: selectedMembers.map(m => m._id),
      trainerId: adminInfo?._id
    };

    onCreate(newPlan);
  };

  const toggleMemberSelection = (member) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m._id === member._id);
      if (isSelected) {
        return prev.filter(m => m._id !== member._id);
      } else {
        return [...prev, member];
      }
    });
  };

  return (
    <div className={`fixed inset-0 z-[100] overflow-y-auto ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#f8f9fa] text-black'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <Plus size={18} strokeWidth={3} />
          </div>
          <h1 className="text-[18px] font-black tracking-tight">{planName || 'Create Diet Plan'}</h1>
        </div>
        <button onClick={onClose}>
          <X size={24} className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'} />
        </button>
      </div>

      <div className="p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        {/* Left Sidebar - Assign Members */}
        <div className="col-span-12 lg:col-span-3">
          <div className={`rounded-lg p-5 border h-fit ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className="flex justify-center text-[15px] font-bold mb-6">Assign Members</h3>

            <div className={`p-3 rounded-lg flex items-start gap-3 mb-6 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="mt-0.5 min-w-[16px] flex justify-center">
                <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">i</div>
              </div>
              <p className="text-[12px] font-medium leading-relaxed text-gray-500">
                Diet Plan can be assigned to members directly from here.
              </p>
            </div>

            <div className={`flex items-center border rounded-lg px-3 py-2.5 mb-2 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-300'}`}>
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Members"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className={`w-full bg-transparent text-[13px] font-bold outline-none ${isDarkMode ? 'text-white' : 'text-gray-700 placeholder-gray-400'}`}
              />
            </div>

            {/* Search Results */}
            <div className="mt-2 max-h-[200px] overflow-y-auto">
              {isSearchingMembers && <p className="text-[11px] text-center py-2">Searching...</p>}
              {!isSearchingMembers && memberResults.length > 0 && (
                <div className="space-y-1">
                  {memberResults.map(member => (
                    <div
                      key={member._id}
                      onClick={() => toggleMemberSelection(member)}
                      className={`p-2 rounded cursor-pointer text-[12px] flex justify-between items-center ${selectedMembers.some(m => m._id === member._id)
                        ? 'bg-[#f97316] text-white'
                        : isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                        }`}
                    >
                      <span>{member.firstName} {member.lastName}</span>
                      <span className="opacity-70 text-[10px]">{member.memberId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <p className="text-[12px] font-bold mb-3">Selected Members ({selectedMembers.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map(member => (
                  <div key={member._id} className="bg-orange-100 text-[#f97316] px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    {member.firstName}
                    <X size={10} className="cursor-pointer" onClick={() => toggleMemberSelection(member)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Diet Plan */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <h2 className="text-[16px] font-black">Weekly Diet Plan</h2>

          {/* Days Tabs */}
          <div className="flex flex-wrap gap-6 border-b border-gray-200 dark:border-white/10 pb-1">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`pb-3 text-[14px] font-bold transition-all relative ${activeDay === day
                  ? 'text-[#f97316]'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-black'
                  }`}
              >
                {day}
                {activeDay === day && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f97316]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Copy To */}
          <div className="flex items-center flex-wrap gap-4">
            <span className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Copy To :-</span>
            {days.filter(d => d !== activeDay).map(day => (
              <label key={day} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={copyToDays.includes(day)}
                  onChange={() => handleCopyToChange(day)}
                  className="w-4 h-4 rounded-full border-gray-300 text-[#f97316] focus:ring-[#f97316]"
                />
                <span className={`text-[13px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{day}</span>
              </label>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {currentDayCards.map((card, index) => {
              const isLastCard = index === currentDayCards.length - 1;
              return (
                <div key={card.id} className={`rounded-lg p-6 relative ${isDarkMode ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white shadow-sm border border-gray-100'}`}>
                  {/* Action Icons - Only on last card */}
                  {isLastCard && (
                    <div className="absolute top-4 right-4 flex items-center gap-3">
                      {currentDayCards.length > 1 && (
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded transition-colors"
                        >
                          <Trash2 size={18} className="text-black dark:text-white" />
                        </button>
                      )}
                      <button
                        onClick={handleAddCard}
                        className="hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded transition-colors"
                      >
                        <Plus size={18} className="text-black dark:text-white" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-5 gap-4 mb-6 mt-2">
                    {/* Row 1 */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500">Food Type</label>
                      <div className="relative">
                        <select
                          value={card.foodType}
                          onChange={(e) => {
                            const newCards = [...currentDayCards];
                            newCards[index] = { ...newCards[index], foodType: e.target.value };
                            setDietCardsPerDay({ ...dietCardsPerDay, [activeDay]: newCards });
                          }}
                          className={`w-full appearance-none px-3 py-2.5 rounded border text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#121212] border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 text-gray-600'}`}
                        >
                          <option>Select</option>
                          <option>VEG</option>
                          <option>NON-VEG</option>
                          <option>VEGAN</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500">Meal Type</label>
                      <div className="relative">
                        <select
                          value={card.mealType}
                          onChange={(e) => {
                            const newCards = [...currentDayCards];
                            newCards[index] = { ...newCards[index], mealType: e.target.value };
                            setDietCardsPerDay({ ...dietCardsPerDay, [activeDay]: newCards });
                          }}
                          className={`w-full appearance-none px-3 py-2.5 rounded border text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#121212] border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 text-gray-600'}`}
                        >
                          <option>Select</option>
                          <option>Breakfast</option>
                          <option>Lunch</option>
                          <option>Snack</option>
                          <option>Dinner</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500">Quantity</label>
                      <input
                        type="text"
                        placeholder="Ex : 56"
                        value={card.quantity}
                        onChange={(e) => {
                          const newCards = [...currentDayCards];
                          newCards[index] = { ...newCards[index], quantity: e.target.value };
                          setDietCardsPerDay({ ...dietCardsPerDay, [activeDay]: newCards });
                        }}
                        className={`w-full px-3 py-2.5 rounded border text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#121212] border-white/10 text-white placeholder-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-gray-600 placeholder-gray-400'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500">Unit</label>
                      <div className="relative">
                        <select
                          value={card.unit}
                          onChange={(e) => {
                            const newCards = [...currentDayCards];
                            newCards[index] = { ...newCards[index], unit: e.target.value };
                            setDietCardsPerDay({ ...dietCardsPerDay, [activeDay]: newCards });
                          }}
                          className={`w-full appearance-none px-3 py-2.5 rounded border text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#121212] border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 text-gray-600'}`}
                        >
                          <option>Select</option>
                          <option>gm</option>
                          <option>ml</option>
                          <option>pcs</option>
                          <option>Glass</option>
                          <option>Cup</option>
                          <option>Plate</option>
                          <option>Bowl</option>
                          <option>Piece</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500">Timing</label>
                      <div className="relative">
                        <input
                          type="time"
                          value={card.timing}
                          onChange={(e) => {
                            const newCards = [...currentDayCards];
                            newCards[index] = { ...newCards[index], timing: e.target.value };
                            setDietCardsPerDay({ ...dietCardsPerDay, [activeDay]: newCards });
                          }}
                          className={`w-full px-3 py-2.5 rounded border text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#121212] border-white/10 text-white' : 'bg-[#f8f9fa] border-gray-200 text-gray-600'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Item Name */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500">Item Name</label>
                      <input
                        type="text"
                        placeholder="Enter Item Name here..."
                        value={card.itemName}
                        onChange={(e) => {
                          const newCards = [...currentDayCards];
                          newCards[index] = { ...newCards[index], itemName: e.target.value };
                          setDietCardsPerDay({ ...dietCardsPerDay, [activeDay]: newCards });
                        }}
                        className={`w-full px-3 py-2.5 rounded border text-[13px] font-medium outline-none ${isDarkMode ? 'bg-[#121212] border-white/10 text-white placeholder-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-gray-600 placeholder-gray-400'}`}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-gray-500 after:content-['*'] after:ml-0.5 after:text-gray-500">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe Diet here..."
                        value={card.description}
                        onChange={(e) => {
                          const newCards = [...currentDayCards];
                          newCards[index] = { ...newCards[index], description: e.target.value };
                          setDietCardsPerDay({ ...dietCardsPerDay, [activeDay]: newCards });
                        }}
                        className={`w-full px-3 py-2.5 rounded border text-[13px] font-medium outline-none resize-none ${isDarkMode ? 'bg-[#121212] border-white/10 text-white placeholder-gray-500' : 'bg-[#f8f9fa] border-gray-200 text-gray-600 placeholder-gray-400'}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleCreatePlan}
              className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded text-[14px] font-bold shadow-md active:scale-95 transition-all"
            >
              Create Diet Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
      <div className={`w-[400px] rounded-lg shadow-xl p-6 relative flex flex-col items-center text-center ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`}
        >
          <X size={20} />
        </button>

        <div className="mb-4">
          <Trash2 size={48} className="text-[#ff4d4f]" fill="#ff4d4f" />
        </div>

        <h3 className={`text-[20px] font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Delete Diet Plan?
        </h3>

        <p className={`text-[14px] font-medium mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Do you really want to delete?
        </p>

        <button
          onClick={onConfirm}
          className="bg-[#ff4d4f] hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-none flex items-center gap-2"
        >
          <Trash2 size={16} className="text-white" fill="white" />
          Yes, Delete Diet Plan
        </button>
      </div>
    </div>
  );
};

const DietPlanManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Public');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateDetailsModalOpen, setIsCreateDetailsModalOpen] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrivacy, setNewPlanPrivacy] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action Menu State
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionContainerRefs = useRef({});

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/diet-plans`, {
        headers: {
          'Authorization': `Bearer ${adminInfo?.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPlans(data);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      toast.error('Failed to fetch diet plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionRow !== null) {
        const currentRef = actionContainerRefs.current[activeActionRow];
        if (currentRef && !currentRef.contains(event.target)) {
          setActiveActionRow(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeActionRow]);

  const handleCreateNext = (name, privacy) => {
    setNewPlanName(name);
    setNewPlanPrivacy(privacy);
    setIsCreateModalOpen(false);
    setIsCreateDetailsModalOpen(true);
  };

  const handleFinalCreate = async (newPlan) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/diet-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo?.token}`
        },
        body: JSON.stringify(newPlan)
      });

      const data = await response.json();
      if (response.ok) {
        setPlans(prev => [data, ...prev]);
        setIsCreateDetailsModalOpen(false);
        if (data.privacyMode === 'Public') {
          setActiveTab('Public');
        } else {
          setActiveTab('Private');
        }
        toast.success('Diet plan created successfully');
      } else {
        toast.error(data.message || 'Failed to create diet plan');
      }
    } catch (err) {
      console.error('Error creating plan:', err);
      toast.error('Error creating diet plan');
    }
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleUpdatePlan = async (updatedPlan) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/diet-plans/${updatedPlan._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo?.token}`
        },
        body: JSON.stringify(updatedPlan)
      });

      const data = await response.json();
      if (response.ok) {
        setPlans(prev => prev.map(p => p._id === data._id ? data : p));
        toast.success('Diet plan updated successfully');
      } else {
        toast.error(data.message || 'Failed to update diet plan');
      }
    } catch (err) {
      console.error('Error updating plan:', err);
      toast.error('Error updating diet plan');
    }
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/diet-plans/${planToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminInfo?.token}`
        }
      });

      if (response.ok) {
        setPlans(prev => prev.filter(p => p._id !== planToDelete._id));
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
        toast.success('Diet plan deleted successfully');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete diet plan');
      }
    } catch (err) {
      console.error('Error deleting plan:', err);
      toast.error('Error deleting diet plan');
    }
  };

  const publicPlans = plans.filter(p => p.privacyMode === 'Public');
  const privatePlans = plans.filter(p => p.privacyMode === 'Private' || !p.privacyMode);

  const allCurrentPlans = activeTab === 'Public' ? publicPlans : privatePlans;
  const totalPages = Math.ceil(allCurrentPlans.length / rowsPerPage) || 1;
  const currentPlans = allCurrentPlans.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Reset page when tab or rowsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage]);

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Diet Plan Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none"
        >
          <Plus size={20} />
          Create Diet Plan
        </button>
      </div>

      {/* Tabs */}
      <div className={`border-b border-gray-100 dark:border-white/5 flex transition-none relative`}>
        {/* Orange line can be simulated with border-b-2 on active button, already implemented */}
        <button
          onClick={() => setActiveTab('Public')}
          className={`flex-1 md:flex-none md:w-[200px] text-center py-4 text-[14px] font-bold transition-none border-b-2 ${activeTab === 'Public' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Public
        </button>
        <button
          onClick={() => setActiveTab('Private')}
          className={`flex-1 md:flex-none md:w-[200px] text-center py-4 text-[14px] font-bold transition-none border-b-2 ${activeTab === 'Private' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Private
        </button>
      </div>

      <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400 pt-2">All Diet Plan(s) ({allCurrentPlans.length})</p>

      {/* Diet Plan List */}
      <div className="space-y-4 transition-none min-h-[400px]">
        {currentPlans.length > 0 ? (
          currentPlans.map((plan, idx) => (
            <DietPlanItem
              key={idx}
              plan={plan}
              isDarkMode={isDarkMode}
              onDelete={handleDeleteClick}
              onUpdate={handleUpdatePlan}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className={`pt-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-none`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}
          >
            « Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 border rounded-lg text-[13px] font-bold transition-none ${currentPage === i + 1 ? 'bg-[#f4a261] text-white' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}
          >
            Next »
          </button>
        </div>

        <div className="flex items-center gap-4 transition-none">
          <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
          <RowsPerPageDropdown
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      <CreateDietPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isDarkMode={isDarkMode}
        onNext={handleCreateNext}
      />

      <CreateDietPlanDetailsModal
        isOpen={isCreateDetailsModalOpen}
        onClose={() => setIsCreateDetailsModalOpen(false)}
        isDarkMode={isDarkMode}
        planName={newPlanName}
        privacyMode={newPlanPrivacy}
        onCreate={handleFinalCreate}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDarkMode={isDarkMode}
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
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:font-medium"
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

export default DietPlanManagement;
