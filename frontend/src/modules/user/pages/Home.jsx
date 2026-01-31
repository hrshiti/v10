import React from 'react';
import {
    Users,
    Flame
} from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import RecommendationCard from '../components/RecommendationCard';
import WaterTracker from '../components/WaterTracker';
import DietPlanSection from '../components/DietPlanSection';
import logo from '../../../assets/logo.jpg';

const Home = () => {


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
            {/* Dark Header Section */}
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-6 pb-24 rounded-b-[2.5rem] relative transition-colors duration-300">
                {/* Top Bar: Logo & Avatar */}
                <div className="flex justify-between items-center mb-4">
                    <div className="w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden bg-white flex items-center justify-center p-1">
                        <img src={logo} alt="V-10 Gym" className="w-full h-full object-contain" />
                    </div>

                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <img
                            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="mb-5">
                    <h3 className="text-gray-400 text-xs font-medium opacity-80 mb-0.5">Welcome back</h3>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Jordan Eagle</h1>
                </div>

                {/* Stats Row (Pills) */}
                <div className="flex items-center gap-2">
                    {/* Active Members Pill */}
                    <div className="flex items-center gap-2 bg-[#252A36] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"></div>
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider">Active Members: <span className="text-white">152</span></span>
                    </div>

                    {/* Total Members Pill */}
                    <div className="flex items-center gap-2 bg-[#252A36] px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider">Total Members: <span className="text-white">350</span></span>
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
