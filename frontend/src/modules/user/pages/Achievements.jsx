import React, { useState } from 'react';
import { Trophy, Award, Target, Flame, Zap, Star, Lock, CheckCircle, TrendingUp, Calendar, Dumbbell, Heart } from 'lucide-react';
import SettingPageLayout from '../components/SettingPageLayout';

const Achievements = () => {
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
        <SettingPageLayout title="Achievements">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
                    <Trophy size={24} className="mb-2" />
                    <p className="text-2xl font-bold">{userStats.totalAchievements}</p>
                    <p className="text-xs text-emerald-100">Achievements</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
                    <Star size={24} className="mb-2" />
                    <p className="text-2xl font-bold">{userStats.totalPoints}</p>
                    <p className="text-xs text-amber-100">Total Points</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
                    <Flame size={24} className="mb-2" />
                    <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                    <p className="text-xs text-orange-100">Day Streak</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
                    <Zap size={24} className="mb-2" />
                    <p className="text-2xl font-bold">Level {userStats.level}</p>
                    <p className="text-xs text-purple-100">Current Level</p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-[#1A1F2B] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
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
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">
                        Unlocked ({unlockedAchievements.length})
                    </h2>
                    <div className="space-y-3">
                        {unlockedAchievements.map((achievement) => {
                            const Icon = achievement.icon;
                            return (
                                <div
                                    key={achievement.id}
                                    className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 rounded-2xl ${colorBgClasses[achievement.color]} flex items-center justify-center flex-shrink-0`}>
                                            <Icon size={28} className={`${colorClasses[achievement.color].replace('bg-', 'text-')}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {achievement.title}
                                                </h3>
                                                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg flex-shrink-0">
                                                    <Star size={12} className="text-amber-600 dark:text-amber-400" />
                                                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                                        {achievement.points}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                {achievement.description}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                    Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

            {/* Locked Achievements (In Progress) */}
            {lockedAchievements.length > 0 && (
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">
                        In Progress ({lockedAchievements.length})
                    </h2>
                    <div className="space-y-3">
                        {lockedAchievements.map((achievement) => {
                            const Icon = achievement.icon;
                            return (
                                <div
                                    key={achievement.id}
                                    className="bg-white dark:bg-[#1A1F2B] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 transition-all duration-300 opacity-75 hover:opacity-100"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 relative">
                                            <Icon size={28} className="text-gray-400" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-2xl">
                                                <Lock size={16} className="text-gray-500" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {achievement.title}
                                                </h3>
                                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg flex-shrink-0">
                                                    <Star size={12} className="text-gray-400" />
                                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        {achievement.points}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                {achievement.description}
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        {achievement.current} / {achievement.target}
                                                    </span>
                                                    <span className="font-bold text-gray-600 dark:text-gray-300">
                                                        {achievement.progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                    <p className="font-bold text-gray-800 dark:text-gray-200">No achievements in this category</p>
                    <p className="text-sm text-gray-500">Try selecting a different category</p>
                </div>
            )}

            {/* Motivational Footer */}
            <div className="mt-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                <Target size={32} className="mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Keep Pushing!</h3>
                <p className="text-sm text-purple-100">
                    You're doing great! Complete more workouts to unlock new achievements and earn points.
                </p>
            </div>
        </SettingPageLayout>
    );
};

export default Achievements;
