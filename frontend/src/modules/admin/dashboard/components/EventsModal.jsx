import React from 'react';
import { X, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventsModal = ({ isOpen, onClose, title, eventList = [], isDarkMode }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4">
            <div
                className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all ${isDarkMode ? 'bg-[#1e1e1e] text-white shadow-black/50 border border-white/10' : 'bg-white text-gray-800'
                    }`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-orange-50'}`}>
                            <span className="text-[18px]">{title.includes('Expiries') ? '⚠️' : '🎉'}</span>
                        </div>
                        <div>
                            <h2 className="text-[18px] font-black tracking-tight">{title}</h2>
                            <p className={`text-[12px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {eventList.length} member{eventList.length !== 1 ? 's' : ''} today
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl transition-all ${isDarkMode
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {eventList.length === 0 ? (
                        <div className="text-center py-8">
                            <p className={`text-[14px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                No {title.toLowerCase()} today
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {eventList.map((member, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(`/admin/members/profile/${member._id}`)}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${isDarkMode
                                        ? 'bg-[#1a1a1a] border border-white/5 hover:bg-white/5'
                                        : 'bg-gray-50 hover:bg-orange-50/50 border border-gray-100 hover:border-orange-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {member.photo ? (
                                            <img
                                                src={member.photo}
                                                alt=""
                                                className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
                                                style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'white' }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-white font-bold shadow-sm">
                                                {member.firstName?.[0]?.toUpperCase()}
                                                {member.lastName?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[14px] group-hover:text-[#f97316] transition-colors line-clamp-1">
                                                {member.firstName} {member.lastName}
                                            </span>
                                            <span className={`text-[11px] font-semibold mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {member.memberId || 'N/A'} {member.endDate && ` • Expired: ${new Date(member.endDate).toLocaleDateString('en-GB')}`}
                                            </span>
                                        </div>
                                    </div>
                                    <a
                                        href={`tel:${member.mobile}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`p-2 rounded-full transition-all ${isDarkMode
                                            ? 'bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400'
                                            : 'bg-white border shadow-sm hover:bg-blue-50 hover:border-blue-200 text-gray-500 hover:text-blue-600'
                                            }`}
                                    >
                                        <Phone size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventsModal;
