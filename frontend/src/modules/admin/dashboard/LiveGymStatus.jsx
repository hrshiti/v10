import React, { useState, useEffect } from 'react';
import {
    Users,
    ShieldCheck,
    Clock,
    Search,
    ArrowLeft,
    Activity,
    Timer,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BadgeCheck,
    AlertCircle
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/api';

const LiveGymStatus = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useOutletContext();
    const [activeTab, setActiveTab] = useState('members');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ members: [], trainers: [] });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLiveStatus();
        const interval = setInterval(fetchLiveStatus, 30000); // Auto refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchLiveStatus = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/live-gym`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resData = await response.json();
            if (response.ok) {
                setData(resData);
            } else {
                toast.error('Failed to fetch live status');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

    const calculateDuration = (checkInTime) => {
        const inTime = new Date(checkInTime);
        const now = new Date();
        const diffMs = now - inTime;
        const diffMins = Math.floor(diffMs / 60000);

        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        return {
            text: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
            mins: diffMins
        };
    };

    const filteredMembers = data.members.filter(m =>
        m.memberId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.memberId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.memberId?.memberId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTrainers = data.trainers.filter(t =>
        t.employeeId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.employeeId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <Activity className="text-emerald-500 animate-pulse" />
                            Live Gym Status
                        </h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Real-time tracking of people currently in the gym</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search name or ID..."
                            className="bg-gray-50 dark:bg-gray-800 border-none rounded-2xl pl-12 pr-6 py-3.5 text-sm w-full md:w-64 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => setActiveTab('members')}
                    className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all ${activeTab === 'members'
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-emerald-200'}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Users size={32} className={activeTab === 'members' ? 'text-white' : 'text-emerald-500'} />
                        <span className={`text-3xl font-black ${activeTab === 'members' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {data.members.length}
                        </span>
                    </div>
                    <p className={`font-black uppercase tracking-widest text-xs ${activeTab === 'members' ? 'text-white/80' : 'text-gray-400'}`}>Members Present</p>
                </div>

                <div
                    onClick={() => setActiveTab('trainers')}
                    className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all ${activeTab === 'trainers'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-600/20'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-200'}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <ShieldCheck size={32} className={activeTab === 'trainers' ? 'text-white' : 'text-blue-500'} />
                        <span className={`text-3xl font-black ${activeTab === 'trainers' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {data.trainers.length}
                        </span>
                    </div>
                    <p className={`font-black uppercase tracking-widest text-xs ${activeTab === 'trainers' ? 'text-white/80' : 'text-gray-400'}`}>Trainers Present</p>
                </div>
            </div>

            {/* List Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                    {activeTab === 'members' ? (
                        filteredMembers.length > 0 ? filteredMembers.map(item => {
                            const duration = calculateDuration(item.checkIn);
                            return (
                                <div key={item._id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-emerald-500/10">
                                            {item.memberId?.photo ? (
                                                <img src={getImageUrl(item.memberId.photo)} className="w-full h-full object-cover" alt="Member" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-emerald-500">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
                                                {item.memberId?.firstName} {item.memberId?.lastName}
                                            </h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ID: {item.memberId?.memberId}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                    <Clock size={14} className="text-emerald-500" />
                                                    Checked In: {new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`inline-flex flex-col items-center p-4 rounded-3xl ${duration.mins >= 50 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                            <Timer size={18} className="mb-1" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">Duration</span>
                                            <span className="text-sm font-black italic">{duration.text}</span>
                                        </div>
                                        {duration.mins >= 50 && (
                                            <div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-tight">
                                                <AlertCircle size={12} /> Long Session
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="lg:col-span-2 text-center py-20 bg-white dark:bg-gray-900 rounded-[3.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                                <Users size={64} className="mx-auto text-gray-200 mb-6" />
                                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Active Members</h3>
                            </div>
                        )
                    ) : (
                        filteredTrainers.length > 0 ? filteredTrainers.map(item => {
                            const duration = calculateDuration(item.inTime);
                            return (
                                <div key={item._id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-blue-500/10">
                                            {item.employeeId?.photo ? (
                                                <img src={getImageUrl(item.employeeId.photo)} className="w-full h-full object-cover" alt="Trainer" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-blue-500">
                                                    <BadgeCheck size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
                                                {item.employeeId?.firstName} {item.employeeId?.lastName}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(item.employeeId?.gymRole || []).map((role, i) => (
                                                    <span key={i} className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/20 tracking-widest">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-3 flex items-center gap-3">
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                    <Clock size={14} className="text-blue-500" />
                                                    Punched: {new Date(item.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="inline-flex flex-col items-center p-4 rounded-3xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                                            <Timer size={18} className="mb-1" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">On Duty</span>
                                            <span className="text-sm font-black italic">{duration.text}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="lg:col-span-2 text-center py-20 bg-white dark:bg-gray-900 rounded-[3.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                                <ShieldCheck size={64} className="mx-auto text-gray-200 mb-6" />
                                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Trainers On Duty</h3>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default LiveGymStatus;
