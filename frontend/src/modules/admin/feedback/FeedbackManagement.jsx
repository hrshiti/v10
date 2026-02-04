import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  X,
  CheckCircle,
  MessageCircle,
  Clock
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';

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

const SuccessNotification = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed top-24 right-8 z-[200] animate-in fade-in slide-in-from-right-10 duration-300">
      <div className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex items-center gap-4 min-w-[320px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-black text-gray-700">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500">
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
  );
};

const ReplyModal = ({ isOpen, onClose, isDarkMode, feedback, onSuccess }) => {
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (feedback?.replyMessage) {
      setReply(feedback.replyMessage);
    } else {
      setReply('');
    }
  }, [feedback]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reply.trim()) return;
    setIsSubmitting(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;

      const res = await fetch(`${API_BASE_URL}/api/admin/feedback/${feedback._id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage: reply })
      });

      if (res.ok) {
        onSuccess('Reply submitted successfully');
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || 'Error submitting reply');
      }
    } catch (error) {
      console.error('Error replying to feedback:', error);
      alert('Internal Server Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-none text-left">
      <div className={`w-[550px] rounded-lg shadow-2xl transition-all ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <MessageCircle className="text-[#f97316]" size={20} />
            <h3 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Reply to {feedback?.userName}</h3>
          </div>
          <button onClick={onClose} className={isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-500 hover:text-black'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>User Message</p>
            <p className={`text-[14px] font-medium leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              "{feedback?.message}"
            </p>
          </div>

          <div>
            <label className={`block text-[14px] font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Admin Remark*</label>
            <textarea
              rows={6}
              placeholder="Type your reply here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl text-[14px] font-medium outline-none resize-none transition-all ${isDarkMode
                ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-500 focus:border-[#f97316]/50'
                : 'bg-white border-gray-300 text-black placeholder-gray-400 focus:border-[#f97316]'
                }`}
            />
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
            onClick={handleSubmit}
            disabled={isSubmitting || !reply.trim()}
            className="bg-[#f97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg text-[14px] font-bold shadow-md active:scale-95 transition-none flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : null}
            Submit Reply
          </button>
        </div>
      </div>
    </div>
  );
};


const FeedbackManagement = () => {
  const { isDarkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const token = adminInfo?.token;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/feedback`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setFeedbacks(data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleReplySuccess = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    fetchFeedbacks();
    setTimeout(() => setShowNotification(false), 3000);
  };

  const filteredFeedbacks = feedbacks.filter(fb =>
    fb.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fb.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fb.feedbackId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedbacks.length / rowsPerPage);
  const displayFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <SuccessNotification
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />

      {/* Header */}
      <div className="flex justify-between items-center transition-none">
        <div>
          <h1 className="text-[28px] font-black tracking-tight uppercase">Feedback Management</h1>
          <p className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage and respond to user feedback and complaints
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md transition-none pt-4">
        <div className="relative">
          <Search size={22} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Name or Message..."
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-[16px] font-bold outline-none transition-none shadow-sm ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-black placeholder:text-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className={`mt-8 border rounded-lg overflow-hidden transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-black' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="px-6 py-5 border-b bg-white dark:bg-white/5 transition-none flex items-center justify-between">
          <span className="text-[14px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">User Feedbacks</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-[11px] font-bold uppercase text-gray-500">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[11px] font-bold uppercase text-gray-500">Replied</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[12px] font-black border-b transition-none ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-gray-50/50 border-gray-100 text-[rgba(0,0,0,0.6)]'}`}>
                <th className="px-6 py-5 uppercase tracking-wider">Feed ID</th>
                <th className="px-6 py-5 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-5 uppercase tracking-wider">Message</th>
                <th className="px-6 py-5 uppercase tracking-wider">Admin Reply</th>
                <th className="px-6 py-5 uppercase tracking-wider">Date & Status</th>
                <th className="px-6 py-5 w-24"></th>
              </tr>
            </thead>
            <tbody className={`text-[13px] font-bold transition-none ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 uppercase tracking-widest text-[12px]">Loading feedbacks...</span>
                    </div>
                  </td>
                </tr>
              ) : displayFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-500 uppercase tracking-widest text-[12px]">
                    No feedbacks found
                  </td>
                </tr>
              ) : (
                displayFeedbacks.map((row) => (
                  <tr key={row._id} className={`border-b transition-none ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-8">
                      <span className="font-black text-[#f97316]">#{row.feedbackId}</span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="space-y-1">
                        <p className="font-black text-[14px] uppercase">{row.userName}</p>
                        <p className={`text-[11px] font-medium opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {row.userId?.mobile || 'N/A'}
                        </p>
                        <div className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block uppercase tracking-wider ${row.type === 'Complaint' ? 'bg-red-100 text-red-600' :
                            row.type === 'Compliment' ? 'bg-emerald-100 text-emerald-600' :
                              'bg-blue-100 text-blue-600'
                          }`}>
                          {row.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8 leading-relaxed max-w-sm">
                      <div className="line-clamp-3">
                        {row.message}
                      </div>
                      {row.rating && (
                        <div className="flex gap-0.5 mt-2 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < row.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-8">
                      {row.replyMessage ? (
                        <div className={`p-3 rounded-lg border italic leading-relaxed text-[12px] ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                          "{row.replyMessage}"
                          {row.repliedBy && (
                            <p className="mt-2 text-[10px] font-black uppercase not-italic opacity-60">
                              - {row.repliedBy}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[12px]">No reply yet</span>
                      )}
                    </td>
                    <td className="px-6 py-8 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <Clock size={12} />
                          {new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.status === 'Replied' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-blue-500 text-white shadow-sm animate-pulse'
                          }`}>
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-right">
                      <button
                        onClick={() => {
                          setSelectedFeedback(row);
                          setIsReplyModalOpen(true);
                        }}
                        className="bg-[#f97316] text-white px-6 py-2 rounded-lg text-[13px] font-bold shadow-md active:scale-95 transition-none hover:bg-orange-600 uppercase tracking-wider"
                      >
                        {row.status === 'Replied' ? 'Edit Reply' : 'Reply'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-6 py-2 border rounded-xl text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50'} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              « Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 border rounded-xl text-[13px] font-black transition-none ${currentPage === i + 1 ? 'bg-[#f4a261] text-white shadow-md' : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-6 py-2 border rounded-xl text-[13px] font-black transition-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50'} ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next »
            </button>
          </div>

          <div className="flex items-center gap-4 transition-none">
            <span className="text-[14px] font-bold text-gray-500 uppercase tracking-tight">Rows per page</span>
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
        feedback={selectedFeedback}
        onSuccess={handleReplySuccess}
      />
    </div>
  );
};

export default FeedbackManagement;
