import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Employees = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const employees = [
    { id: '492360', name: 'PARI PANDYA', mobile: '9586638773', activities: '', role: 'Trainer,Receptionist,Sales consultant', active: true },
    { id: '491419', name: 'V10 FITNESS LAB', mobile: '8347008511', activities: '', role: 'Trainer', active: true },
    { id: '489895', name: 'ANJALI KANWAR', mobile: '9824060468', activities: '', role: 'Trainer,Receptionist,Sales consultant', active: true },
    { id: '489291', name: 'Abdulla Pathan', mobile: '8320350506', activities: '', role: 'Gym owner,Trainer,Sales consultant', active: true },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>

      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Employee Management</h1>
        <button className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-[15px] font-bold shadow-md active:scale-95 transition-none">
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md transition-none">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[16px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-5 py-5 border-b bg-white dark:bg-white/5 flex justify-between items-center">
          <span className="text-[13px] font-black uppercase text-gray-800 dark:text-gray-200 tracking-wider">Employees</span>
          <div className="flex gap-3">
            <button className="bg-[#f97316] text-white px-5 py-2 rounded-lg text-[14px] font-bold shadow-sm active:scale-95 transition-none">View Gym QR</button>
            <button className="bg-[#f97316] text-white px-5 py-2 rounded-lg text-[14px] font-bold shadow-sm active:scale-95 transition-none">Access Control</button>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-50 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Emp ID</th>
                <th className="px-6 py-5">Emp Name</th>
                <th className="px-6 py-5">Mobile Number</th>
                <th className="px-6 py-5">Activities</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Active / Inactive</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-200' : 'text-[rgba(0,0,0,0.8)]'}`}>
              {employees.map((emp) => (
                <tr key={emp.id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{emp.id}</td>
                  <td className="px-6 py-8 uppercase">{emp.name}</td>
                  <td className="px-6 py-8">{emp.mobile}</td>
                  <td className="px-6 py-8">{emp.activities}</td>
                  <td className="px-6 py-8">{emp.role}</td>
                  <td className="px-6 py-8">
                    <div className="flex items-center">
                      <div className="relative w-[50px] h-[24px] rounded-full bg-[#10b981] flex items-center px-1 border border-black/10">
                        <span className="text-white text-[10px] font-black ml-1">On</span>
                        <div className="absolute right-1 w-[20px] h-[18px] bg-white rounded-lg shadow-sm border border-black/5"></div>
                        <div className="absolute right-[2px] top-1 bottom-1 w-[2px] bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <button className="text-gray-400 hover:text-black dark:hover:text-white transition-none">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 bg-gray-50/20'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f97316] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-300 shadow-sm'}`}>Next »</button>
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
    </div>
  );
};

export default Employees;
