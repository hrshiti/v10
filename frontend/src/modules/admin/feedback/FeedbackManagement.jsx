import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  X
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

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

const ReplyModal = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none">
      <div className={`w-[500px] rounded-lg shadow-2xl transition-all ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <h3 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Reply</h3>
          <button onClick={onClose} className={isDarkMode ? 'text-white' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Remark*</label>
          <textarea
            rows={6}
            placeholder="Remark..."
            className={`w-full px-4 py-3 border rounded-xl text-[14px] font-medium outline-none resize-none ${isDarkMode
                ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-black placeholder-gray-400'
              }`}
          />
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
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};


const FeedbackManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const feedbackData = [
    { id: '788', userName: 'Mili Harry', userMessage: 'please help me to make my everyday weight training program chart for Monday to Saturday', replyMessage: '', date: '21 Nov, 2025 01:19 PM' },
    { id: '701', userName: 'Tejpalsinh parmar', userMessage: 'how to contact ahemdabad ctm branch', replyMessage: '', date: '14 Aug, 2025 05:06 AM' },
    { id: '665', userName: 'Tejpalsinh parmar', userMessage: 'how to check diet plan', replyMessage: '', date: '08 Jul, 2025 06:40 PM' },
    { id: '664', userName: 'Tejpalsinh parmar', userMessage: 'diet plan', replyMessage: '', date: '08 Jul, 2025 06:35 PM' },
    { id: '646', userName: 'dhaval solanki', userMessage: 'how to check date plan', replyMessage: '', date: '17 Jun, 2025 07:25 PM' },
  ];

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <h1 className="text-[28px] font-black tracking-tight">Feedback Management</h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-md transition-none">
        <div className="relative">
          <Search size={22} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[16px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-6 py-5 border-b bg-white dark:bg-white/5 transition-none">
          <span className="text-[14px] font-black text-gray-800 dark:text-gray-200">Follow Ups</span>
        </div>
        <div className="overflow-x-visible min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5">Feed ID</th>
                <th className="px-6 py-5">User Name</th>
                <th className="px-6 py-5">User Message</th>
                <th className="px-6 py-5">Reply Message</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 w-24"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {feedbackData.map((row, idx) => (
                <tr key={idx} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-8">{row.id}</td>
                  <td className="px-6 py-8">{row.userName}</td>
                  <td className="px-6 py-8 leading-relaxed max-w-sm">{row.userMessage}</td>
                  <td className="px-6 py-8">{row.replyMessage}</td>
                  <td className="px-6 py-8 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-8 text-right">
                    <button
                      onClick={() => setIsReplyModalOpen(true)}
                      className="bg-[#f97316] text-white px-6 py-2 rounded-lg text-[13px] font-bold shadow-md active:scale-95 transition-none"
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-5 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm'}`}>« Previous</button>
            <button className="w-10 h-10 border rounded-lg text-[12px] font-bold bg-[#f4a261] text-white shadow-md transition-none">1</button>
            <button className={`px-4 py-2 border rounded-lg text-[12px] font-bold transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm'}`}>Next »</button>
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
      </div>

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default FeedbackManagement;
