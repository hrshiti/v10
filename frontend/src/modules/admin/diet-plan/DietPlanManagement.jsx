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

const CreateDietPlanModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;
  const [privacyMode, setPrivacyMode] = useState('Select');
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
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-none">
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

<<<<<<< Updated upstream
const MealAccordion = ({ mealType, foods, isDarkMode }) => {
=======
// Edit Diet Plan Modal - Full Screen with 7 Days and Dynamic Cards
const EditDietPlanModal = ({ isOpen, onClose, isDarkMode, planName }) => {
  const [activeDay, setActiveDay] = useState('Monday');

  // Initial diet cards data
  const initialCards = [
    { id: 1, foodType: 'VEG', mealType: 'Breakfast', quantity: '1', unit: 'Glass', timing: '07:00', itemName: 'black coffee/a small fruit/4 dates', description: '' },
    { id: 2, foodType: 'VEG', mealType: 'Breakfast', quantity: '1', unit: 'Cup', timing: '08:00', itemName: 'green tea/skimmed milk+ 1 plate veg poha/dhokla', description: '' },
    { id: 3, foodType: 'VEG', mealType: 'Breakfast', quantity: '1', unit: 'Plate', timing: '10:00', itemName: '1 plate fresh fruit salad + buttermilk +water +1 coconut water', description: '' },
    { id: 4, foodType: 'VEG', mealType: 'Lunch', quantity: '1', unit: 'Plate', timing: '14:00', itemName: '1 plate salad +brown rice+dal+curd', description: '' },
    { id: 5, foodType: 'VEG', mealType: 'Evening Snacks', quantity: '1', unit: 'Bowl', timing: '17:00', itemName: 'lemon tea/green tea/1 bowl boiled mung/chana', description: '' },
    { id: 6, foodType: 'VEG', mealType: 'Dinner', quantity: '1', unit: 'Bowl', timing: '20:00', itemName: 'veg. soup + veg salad+veg khichdi/rice/curd', description: '' },
    { id: 7, foodType: 'VEG', mealType: 'Dinner', quantity: '1', unit: 'Piece', timing: '22:00', itemName: 'fruit any 1 before going to bed', description: '' },
  ];

  // State for diet cards for each day
  const [dietCardsPerDay, setDietCardsPerDay] = useState({
    Monday: initialCards,
    Tuesday: initialCards,
    Wednesday: initialCards,
    Thursday: initialCards,
    Friday: initialCards,
    Saturday: initialCards,
    Sunday: initialCards,
  });

  const [nextId, setNextId] = useState(8);

  if (!isOpen) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDayCards = dietCardsPerDay[activeDay];

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
      id: nextId,
      foodType: 'VEG',
      mealType: 'Breakfast',
      quantity: '1',
      unit: 'Glass',
      timing: '07:00',
      itemName: '',
      description: ''
    };

    setDietCardsPerDay(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newCard]
    }));

    setNextId(nextId + 1);
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
            {planName || 'INSTANT WEIGHT LOSS DIET'}
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
                    defaultValue={card.foodType}
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
                    defaultValue={card.mealType}
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
                    defaultValue={card.quantity}
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
                    defaultValue={card.unit}
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
                    defaultValue={card.timing}
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
                  defaultValue={card.itemName}
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
                  defaultValue={card.description}
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
        <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-none">
          Submit
        </button>
      </div>
    </div>
  );
}

const MealAccordion = ({ meal, isDarkMode }) => {
>>>>>>> Stashed changes
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

const DietPlanItem = ({ plan, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
            onClick={() => setIsSearchActive(true)}
          >
            <Search size={16} className={`mr-2 ${isSearchActive ? 'text-[#f97316]' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search Members"
              className={`w-full bg-transparent text-[14px] font-bold outline-none placeholder:font-medium placeholder:text-gray-400 ${isDarkMode ? 'text-white' : 'text-[#f97316]'
                }`}
            />
            <ChevronDown size={16} className={`ml-2 ${isSearchActive ? 'text-[#f97316]' : 'text-gray-400'}`} />
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
                {['Edit', 'Delete'].map((action, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (action === 'Edit') {
                        setIsEditModalOpen(true);
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
        planName={plan.name}
      />
    </div>
  );
};

const DietPlanManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Public');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action Menu State
  const [activeActionRow, setActiveActionRow] = useState(null);
  const actionContainerRefs = useRef({});

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch('http://localhost:5000/api/admin/diet-plans', {
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
            <DietPlanItem key={idx} plan={plan} isDarkMode={isDarkMode} />
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
      />
    </div>
  );
};

export default DietPlanManagement;
