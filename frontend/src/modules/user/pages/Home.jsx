import React, { useState, useEffect } from 'react';
import {
    Users,
    Flame,
    User,
    CheckCircle2,
    Trophy
} from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import RecommendationCard from '../components/RecommendationCard';
import SuccessStoryCard from '../components/SuccessStoryCard';
import WaterTracker from '../components/WaterTracker';
import DietPlanSection from '../components/DietPlanSection';
import BMICalculator from '../components/BMICalculator';
import logo from '../../../assets/logo.jpg';
import { API_BASE_URL } from '../../../config/api';

const Home = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        activeMembers: 0,
        todayAttendance: 0,
        activeInGym: 0,
        activeTrainers: 0,
        userStatus: { isPresent: false, type: null }
    });
    const [stories, setStories] = useState([]);
    const [loadingStories, setLoadingStories] = useState(true);
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('userData');
        return saved ? JSON.parse(saved) : null;
    });

    const userName = userData ? `${userData.firstName} ${userData.lastName}` : 'Guest';

    // Check if profile is incomplete
    const isProfileIncomplete = userData && (
        !userData.weight || userData.weight === '0' || userData.weight === 0 ||
        !userData.height || userData.height === '0' || userData.height === 0 ||
        !userData.age || userData.age === '0' || userData.age === 0
    );

    useEffect(() => {
        fetchStats();
        fetchStories();
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUserData(data);
                localStorage.setItem('userData', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error fetching profile in home:', error);
        }
    };

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

    const fetchStories = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/api/user/trainer/stories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStories(data);
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoadingStories(false);
        }
    };

    return (
        <div className="flex flex-col">
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
                            ${stats.userStatus.isSessionActive
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                : 'bg-blue-500/20 border-blue-500/50 text-blue-400'}`}>
                            {stats.userStatus.isSessionActive ? '• Active Session' : '• Session Done'}
                        </div>
                    )}
                </div>

                {/* Stats Row (Pills) */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 w-full max-w-full">
                    <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#252A36] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                        <Flame size={10} className="text-orange-500 fill-orange-500 animate-pulse" />
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider whitespace-nowrap">Active in Gym: <span className="text-white">{stats.activeInGym}</span></span>
                    </div>

                    {stats.activeTrainers > 0 && (
                        <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#252A36] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider whitespace-nowrap">Trainers Active: <span className="text-white">{stats.activeTrainers}</span></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlapping Progress Card */}
            <div className="px-5 -mt-16 mb-6">
                <ProgressCard />
            </div>

            {/* BMI Calculator */}
            <div className="px-5">
                <BMICalculator />
            </div>

            {/* Transformation Highlights (Social Style) */}
            {stories.length > 0 && (
                <div className="px-5 mt-6 mb-8">
                    <div className="flex items-center justify-between mb-5 px-1">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white transition-colors duration-300 flex items-center gap-2">
                            <Trophy size={20} className="text-amber-500" />
                            Transformation Lab
                        </h2>
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                Live News
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
                        {stories.map((story) => (
                            <div key={story._id} className="w-[88%] flex-shrink-0 snap-center">
                                <SuccessStoryCard
                                    story={story}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Diet Plan Section */}
            <div className="px-5">
                <DietPlanSection />
                <div className="mt-6">
                    <WaterTracker />
                </div>
            </div>
        </div>
    );
};

export default Home;
