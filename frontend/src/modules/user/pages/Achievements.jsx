import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award, Target, Flame, Zap, Star, Lock, CheckCircle, TrendingUp, Calendar, Dumbbell, Heart, ChevronLeft } from 'lucide-react';

const Achievements = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');

    // User stats
    const userStats = {
        totalAchievements: 12,
        totalPoints: 2450,
        currentStreak: 7,
        level: 5
    };

    // Achievement categories
    const categories = ['All', 'Workouts', 'Streaks', 'Milestones', 'Special'];

    // Achievements data
    const achievements = [
        // Unlocked Achievements
        {
            id: 1,
            title: 'First Step',
            description: 'Complete your first workout',
            icon: Dumbbell,
            category: 'Workouts',
            points: 50,
            unlocked: true,
            unlockedDate: '2026-01-15',
            color: 'emerald',
            progress: 100
        },
        {
            id: 2,
            title: 'Week Warrior',
            description: 'Maintain a 7-day workout streak',
            icon: Flame,
            category: 'Streaks',
            points: 200,
            unlocked: true,
            unlockedDate: '2026-01-28',
            color: 'orange',
            progress: 100
        },
        {
            id: 3,
            title: 'Early Bird',
            description: 'Complete 5 morning workouts',
            icon: Star,
            category: 'Workouts',
            points: 150,
            unlocked: true,
            unlockedDate: '2026-01-20',
            color: 'yellow',
            progress: 100
        },
        {
            id: 4,
            title: 'Cardio King',
            description: 'Complete 10 cardio sessions',
            icon: Heart,
            category: 'Workouts',
            points: 200,
            unlocked: true,
            unlockedDate: '2026-01-25',
            color: 'red',
            progress: 100
        },
        {
            id: 5,
            title: 'Consistency Champion',
            description: 'Log workouts for 30 consecutive days',
            icon: Calendar,
            category: 'Streaks',
            points: 500,
            unlocked: false,
            color: 'purple',
            progress: 23,
            current: 23,
            target: 30
        },
        {
            id: 6,
            title: 'Strength Master',
            description: 'Complete 25 strength training sessions',
            icon: Dumbbell,
            category: 'Workouts',
            points: 300,
            unlocked: false,
            color: 'blue',
            progress: 68,
            current: 17,
            target: 25
        },
        {
            id: 7,
            title: 'Century Club',
            description: 'Complete 100 total workouts',
            icon: Trophy,
            category: 'Milestones',
            points: 1000,
            unlocked: false,
            color: 'amber',
            progress: 45,
            current: 45,
            target: 100
        },
        {
            id: 8,
            title: 'Calorie Crusher',
            description: 'Burn 10,000 calories total',
            icon: Flame,
            category: 'Milestones',
            points: 500,
            unlocked: false,
            color: 'orange',
            progress: 72,
            current: 7200,
            target: 10000
        },
        {
            id: 9,
            title: 'Perfect Week',
            description: 'Complete all scheduled workouts in a week',
            icon: CheckCircle,
            category: 'Special',
            points: 300,
            unlocked: true,
            unlockedDate: '2026-01-22',
            color: 'green',
            progress: 100
        },
        {
            id: 10,
            title: 'Night Owl',
            description: 'Complete 5 evening workouts',
            icon: Star,
            category: 'Workouts',
            points: 150,
            unlocked: true,
            unlockedDate: '2026-01-18',
            color: 'indigo',
            progress: 100
        },
        {
            id: 11,
            title: 'Transformation',
            description: 'Reach your target weight',
            icon: TrendingUp,
            category: 'Milestones',
            points: 1500,
            unlocked: false,
            color: 'pink',
            progress: 60,
            current: 6,
            target: 10
        },
        {
            id: 12,
            title: 'Legendary',
            description: 'Maintain a 100-day streak',
            icon: Award,
            category: 'Special',
            points: 2000,
            unlocked: false,
            color: 'purple',
            progress: 7,
            current: 7,
            target: 100
        }
    ];

    // Filter achievements by category
    const filteredAchievements = selectedCategory === 'All'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory);

    // Separate unlocked and locked achievements
    const unlockedAchievements = filteredAchievements.filter(a => a.unlocked);
    const lockedAchievements = filteredAchievements.filter(a => !a.unlocked);

    // Color mapping
    const colorClasses = {
        emerald: 'bg-emerald-500',
        orange: 'bg-orange-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500',
        blue: 'bg-blue-500',
        amber: 'bg-amber-500',
        green: 'bg-green-500',
        indigo: 'bg-indigo-500',
        pink: 'bg-pink-500'
    };

    const colorBgClasses = {
        emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
        orange: 'bg-orange-100 dark:bg-orange-900/30',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/30',
        red: 'bg-red-100 dark:bg-red-900/30',
        purple: 'bg-purple-100 dark:bg-purple-900/30',
        blue: 'bg-blue-100 dark:bg-blue-900/30',
        amber: 'bg-amber-100 dark:bg-amber-900/30',
        green: 'bg-green-100 dark:bg-green-900/30',
        indigo: 'bg-indigo-100 dark:bg-indigo-900/30',
        pink: 'bg-pink-100 dark:bg-pink-900/30'
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 font-sans">
            <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-[#121212] relative shadow-xl flex flex-col">

                {/* Header - Fixed layout */}
                <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-5 pb-6 shadow-md transition-colors duration-300 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold">Achievements</h1>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 p-5 pb-24 overflow-y-auto">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
                            <Trophy size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-bold">{userStats.totalAchievements}</p>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">Unlocked</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg">
                            <Star size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-bold">{userStats.totalPoints}</p>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-amber-100">Points</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
                            <Flame size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-orange-100">Streak</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
                            <Zap size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-bold">{userStats.level}</p>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-purple-100">Level</p>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-300 transform ${selectedCategory === cat
                                        ? 'bg-emerald-500 text-white shadow-md scale-105'
                                        : 'bg-white dark:bg-[#1A1F2B] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Unlocked Achievements */}
                    {unlockedAchievements.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 ml-1">
                                Unlocked ({unlockedAchievements.length})
                            </h2>
                            <div className="space-y-4">
                                {unlockedAchievements.map((achievement) => {
                                    const Icon = achievement.icon;
                                    return (
                                        <div
                                            key={achievement.id}
                                            className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden"
                                        >
                                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${achievement.color}-500 blur-3xl opacity-10 -translate-y-10 translate-x-10`}></div>

                                            <div className="flex items-start gap-4">
                                                <div className={`w-14 h-14 rounded-2xl ${colorBgClasses[achievement.color]} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                                    <Icon size={24} className={`${colorClasses[achievement.color].replace('bg-', 'text-')}`} />
                                                </div>
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                                                            {achievement.title}
                                                        </h3>
                                                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full flex-shrink-0 border border-amber-100 dark:border-amber-500/20">
                                                            <Star size={10} className="text-amber-500 fill-amber-500" />
                                                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                                                {achievement.points}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed line-clamp-2">
                                                        {achievement.description}
                                                    </p>
                                                    <div className="flex items-center gap-1.5">
                                                        <CheckCircle size={12} className="text-emerald-500 fill-emerald-500/20" />
                                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide">
                                                            Unlocked {new Date(achievement.unlockedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Locked Achievements */}
                    {lockedAchievements.length > 0 && (
                        <div>
                            <h2 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 ml-1">
                                In Progress ({lockedAchievements.length})
                            </h2>
                            <div className="space-y-4">
                                {lockedAchievements.map((achievement) => {
                                    const Icon = achievement.icon;
                                    return (
                                        <div
                                            key={achievement.id}
                                            className="bg-white dark:bg-[#1A1F2B] rounded-3xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm opacity-90"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 relative">
                                                    <Icon size={24} className="text-gray-400" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 dark:bg-black/20 rounded-2xl">
                                                        <Lock size={14} className="text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                                                            {achievement.title}
                                                        </h3>
                                                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full flex-shrink-0">
                                                            <Star size={10} className="text-gray-400" />
                                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                                {achievement.points}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
                                                        {achievement.description}
                                                    </p>

                                                    {/* Progress Bar */}
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wide">
                                                            <span className="text-gray-400">
                                                                {achievement.current} / {achievement.target}
                                                            </span>
                                                            <span className="text-gray-600 dark:text-gray-300">
                                                                {achievement.progress}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${colorClasses[achievement.color]} transition-all duration-500`}
                                                                style={{ width: `${achievement.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredAchievements.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <Trophy size={48} className="text-gray-300 mb-4" />
                            <p className="font-bold text-gray-800 dark:text-gray-200">No achievements yet</p>
                            <p className="text-xs text-gray-500 mt-1">Check back later for new challenges!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Achievements;
