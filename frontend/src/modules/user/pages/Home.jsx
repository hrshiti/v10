import React, { useState, useEffect } from 'react';
import {
    Users,
    Flame,
    User,
    CheckCircle2
} from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import RecommendationCard from '../components/RecommendationCard';
import WaterTracker from '../components/WaterTracker';
import DietPlanSection from '../components/DietPlanSection';
import logo from '../../../assets/logo.jpg';
import { API_BASE_URL } from '../../../config/api';

const Home = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        activeMembers: 0,
        todayAttendance: 0,
        userStatus: { isPresent: false, type: null }
    });

    // Get user data from localStorage
    const userDataStr = localStorage.getItem('userData');
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    const userName = userData ? `${userData.firstName} ${userData.lastName}` : 'Guest';

    // Check if profile is incomplete
    const isProfileIncomplete = userData && (!userData.weight || !userData.height || !userData.age);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/user/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching home stats:', error);
        }
    };

    const recommendations = [
        {
            title: 'Pull Up',
            duration: '15 minutes',
            level: 'Beginner',
            tag: 'Cardio',
            tagColor: '#10B981', // green-500
            tagBg: '#D1FAE5', // emerald-100
            image: 'https://images.unsplash.com/photo-1598971639058-211a74a9468d?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            title: 'Sit Up',
            duration: '30 minutes',
            level: 'Middle',
            tag: 'Muscle',
            tagColor: '#F59E0B', // amber-500
            tagBg: '#FEF3C7', // amber-100
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200&h=200'
        },
        {
            title: 'Biceps curl',
            duration: '2 hours',
            level: 'Pro',
            tag: 'Strength',
            tagColor: '#8B5CF6', // violet-500
            tagBg: '#EDE9FE', // violet-100
            image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200&h=200'
        },
    ];

    return (
        <div className="flex flex-col pb-24">
            {/* Profile Incomplete Notification */}
            {isProfileIncomplete && (
                <div className="mx-4 mt-4 mb-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top-4 fade-in">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold text-sm mb-1">Complete Your Profile</h4>
                        <p className="text-gray-300 text-xs mb-2">Add your weight, height & age to unlock personalized features</p>
                        <button
                            onClick={() => window.location.href = '/profile'}
                            className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            Complete Now →
                        </button>
                    </div>
                </div>
            )}

            {/* Dark Header Section */}
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-6 pb-24 rounded-b-[2.5rem] relative transition-colors duration-300">
                {/* Top Bar: Logo & Avatar */}
                <div className="flex justify-between items-center mb-4">
                    <div className="w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden bg-white flex items-center justify-center p-1">
                        <img src={logo} alt="V-10 Gym" className="w-full h-full object-contain" />
                    </div>

                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center">
                        {userData?.photo ? (
                            <img
                                src={userData.photo}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={20} className="text-emerald-400" />
                        )}
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="mb-5 flex justify-between items-end">
                    <div>
                        <h3 className="text-gray-400 text-xs font-medium opacity-80 mb-0.5">Welcome back</h3>
                        <h1 className="text-2xl font-bold tracking-tight text-white">{userName}</h1>
                    </div>
                    {stats.userStatus.isPresent && (
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border animate-in fade-in slide-in-from-right-4 
                            ${stats.userStatus.type === 'checkin'
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                : 'bg-blue-500/20 border-blue-500/50 text-blue-400'}`}>
                            {stats.userStatus.type === 'checkin' ? '• Checked In' : '• Session Done'}
                        </div>
                    )}
                </div>

                {/* Stats Row (Pills) */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 w-full max-w-full">

                    {/* Active Members Pill */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#252A36] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"></div>
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider whitespace-nowrap">Active: <span className="text-white">{stats.activeMembers}</span></span>
                    </div>

                    {/* Today Present Pill */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#252A36] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                        <CheckCircle2 size={10} className="text-blue-400" />
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider whitespace-nowrap">Today: <span className="text-white">{stats.todayAttendance}</span></span>
                    </div>

                    {/* Total Members Pill */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#252A36] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                        <Users size={10} className="text-gray-400" />
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider whitespace-nowrap">Total: <span className="text-white">{stats.totalMembers}</span></span>
                    </div>
                </div>
            </div>

            {/* Overlapping Progress Card */}
            <div className="px-5 -mt-16 mb-6">
                <ProgressCard />
            </div>

            {/* Diet Plan Section */}
            {/* Diet Plan Section */}
            <div className="px-5 flex-grow">
                <DietPlanSection />
                <div className="mt-6">
                    <WaterTracker />
                </div>
            </div>

            {/* Recommendation Section */}
            <div className="px-5 mt-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 px-1 transition-colors duration-300">Recommendation</h2>
                <div className="flex flex-col gap-3">
                    {recommendations.map((item, index) => (
                        <RecommendationCard
                            key={index}
                            {...item}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}

        </div>
    );
};

export default Home;
