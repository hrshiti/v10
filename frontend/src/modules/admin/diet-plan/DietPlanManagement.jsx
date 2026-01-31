import React, { useState } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const DietPlanManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Public');

  const dietPlans = [
    { name: 'INSTANT WEIGHT LOSS DIET' },
    { name: 'WEIGHT LOSS DIET SCHEDULE' },
    { name: 'BODY BUILDING DIET' },
    { name: 'WEIGHT GAIN' },
    { name: 'HEART HEALTHY & HIGH CHOLESTROL & HIGH BLOOD PRESSURE' }
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Diet Plan Management</h1>
        <button className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none">
          <Plus size={20} />
          Create Diet Plan
        </button>
      </div>

      {/* Tabs */}
      <div className={`border-b border-gray-100 dark:border-white/5 flex transition-none`}>
        <button
          onClick={() => setActiveTab('Public')}
          className={`px-32 py-4 text-[14px] font-bold transition-none border-b-2 ${activeTab === 'Public' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Public
        </button>
        <button
          onClick={() => setActiveTab('Private')}
          className={`px-32 py-4 text-[14px] font-bold transition-none border-b-2 ${activeTab === 'Private' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-400'}`}
        >
          Private
        </button>
      </div>

      <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400 pt-2">All Diet Plan(s) (7)</p>

      {/* Diet Plan List */}
      <div className="space-y-4 transition-none">
        {dietPlans.map((plan, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-[#f8f9fa] border-gray-100'}`}>
            <span className={`text-[16px] font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>{plan.name}</span>

            <div className="flex items-center gap-6 transition-none">
              <div className="relative min-w-[200px]">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <select className={`appearance-none w-full pl-10 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-500'}`}>
                  <option>Search Members</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>

              <ChevronDown size={20} className="text-gray-400 cursor-pointer" />
              <MoreVertical size={20} className="text-gray-400 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={`pt-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-none`}>
        <div className="flex flex-wrap items-center gap-2">
          <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
          {[1, 2].map(num => (
            <button key={num} className={`w-10 h-10 border rounded-lg text-[13px] font-bold transition-none ${num === 1 ? 'bg-[#f4a261] text-white' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 text-gray-600')}`}>
              {num}
            </button>
          ))}
          <button className={`px-4 py-2 border rounded-lg text-[13px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
        </div>

        <div className="flex items-center gap-4 transition-none">
          <span className="text-[14px] font-bold text-gray-500">Rows per page</span>
          <div className="relative">
            <select className={`appearance-none pl-4 pr-10 py-2 border rounded-lg text-[14px] font-bold outline-none cursor-pointer transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-300 text-black shadow-sm'}`}>
              <option>5</option>
              <option>10</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanManagement;
