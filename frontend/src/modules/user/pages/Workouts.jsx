import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlayCircle, Clock, Zap } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const Workouts = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [myWorkouts, setMyWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchMyWorkouts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/workouts`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setMyWorkouts(data);
                }
            } catch (err) {
                console.error('Error fetching workouts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyWorkouts();
    }, []);

    const categories = ['All', 'Cardio', 'Strength', 'Yoga', 'HIIT'];

    // Mock Database
    const workoutsData = [
        { id: 1, title: 'Full Body HIIT', category: 'HIIT', duration: '25 min', intensity: 'High', image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=400&auto=format&fit=crop' },
        { id: 2, title: 'Yoga Flow', category: 'Yoga', duration: '45 min', intensity: 'Low', image: 'https://images.unsplash.com/photo-1544367563-121955b75268?q=80&w=400&auto=format&fit=crop' },
        { id: 3, title: 'Upper Body Power', category: 'Strength', duration: '30 min', intensity: 'Medium', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop' },
        { id: 4, title: 'Cardio Blast', category: 'Cardio', duration: '20 min', intensity: 'High', image: 'https://images.unsplash.com/photo-1538805060504-d1d52d9557a0?q=80&w=400&auto=format&fit=crop' },
        { id: 5, title: 'Pilates Core', category: 'Strength', duration: '40 min', intensity: 'Low', image: 'https://images.unsplash.com/photo-1518602164578-cd0074062767?q=80&w=400&auto=format&fit=crop' },
        { id: 6, title: 'Extreme Shred', category: 'HIIT', duration: '35 min', intensity: 'Very High', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=400&auto=format&fit=crop' },
        { id: 7, title: 'Runner High', category: 'Cardio', duration: '15 min', intensity: 'Medium', image: 'https://images.unsplash.com/photo-1552674605-46d536d2325c?q=80&w=400&auto=format&fit=crop' },
        { id: 8, title: 'Power Lifting', category: 'Strength', duration: '60 min', intensity: 'High', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' },
    ];

    // Filter Logic
    const filteredWorkouts = workoutsData.filter(workout => {
        const matchesCategory = activeCategory === 'All' || workout.category === activeCategory;
        const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors duration-300">
            <div className="bg-[#1A1F2B] dark:bg-[#0D1117] text-white pt-8 px-6 pb-8 rounded-b-[2rem] shadow-md transition-colors duration-300">
                <h1 className="text-2xl font-bold mb-6">Explore Workouts</h1>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#252A36] text-white placeholder-gray-400 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-400 border border-white/5 transition-all"
                    />
                </div>
            </div>

            <div className="p-6 pb-24">
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 shadow-sm ${activeCategory === cat
                                ? 'bg-black dark:bg-white text-white dark:text-black scale-105 shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* My Assigned Plans */}
                {myWorkouts.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Assigned Plans</h2>
                        <div className="flex flex-col gap-3">
                            {myWorkouts.map((plan) => (
                                <div
                                    key={plan._id}
                                    onClick={() => navigate(`/workout-details/${plan._id}`)}
                                    className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]"
                                >
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">Active Plan</span>
                                            <h3 className="text-2xl font-black leading-tight mb-1">{plan.name}</h3>
                                            <div className="flex items-center gap-2 text-white/90 text-xs font-medium mt-2">
                                                <Clock size={14} />
                                                <span>Starts: {new Date(plan.startDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white text-emerald-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                            <PlayCircle size={28} fill="currentColor" stroke="none" />
                                        </div>
                                    </div>

                                    {/* Abstract Design Elements */}
                                    <div className="absolute top-[-30%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-black/5 rounded-full blur-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Workouts */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Popular</h2>
                    <span className="text-xs font-bold text-gray-400">{filteredWorkouts.length} Results</span>
                </div>

                {filteredWorkouts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredWorkouts.map((workout) => (
                            <div
                                key={workout.id}
                                onClick={() => navigate(`/workout/${workout.id}`)}
                                className="bg-white dark:bg-[#1A1F2B] p-3 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="bg-gray-100 dark:bg-gray-800 h-32 rounded-2xl mb-3 relative overflow-hidden">
                                    <img src={workout.image} alt={workout.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <PlayCircle className="text-white fill-white" size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-1">{workout.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                            {workout.category}
                                        </span>
                                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                                            <Zap size={10} fill="currentColor" /> {workout.intensity}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <Search size={48} className="text-gray-300 mb-4" />
                        <p className="font-bold text-gray-800 dark:text-gray-200">No workouts found</p>
                        <p className="text-sm text-gray-500">Try adjusting your search filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Workouts;
