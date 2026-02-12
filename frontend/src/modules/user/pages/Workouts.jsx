import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlayCircle, Clock, Zap, Dumbbell } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const Workouts = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [myWorkouts, setMyWorkouts] = useState([]);
    const [libraryWorkouts, setLibraryWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const [myRes, libRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/user/workouts`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/user/workout-library`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (myRes.ok) setMyWorkouts(await myRes.json());
                if (libRes.ok) setLibraryWorkouts(await libRes.json());

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const categories = ['All', 'Cardio', 'Strength', 'Yoga', 'HIIT', 'Pilates', 'Functional'];

    // Filter Logic
    const filteredWorkouts = libraryWorkouts.filter(workout => {
        const matchesCategory = activeCategory === 'All' || workout.category === activeCategory;
        const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const normalizedPath = path.replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

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
                                key={workout._id}
                                onClick={() => navigate(`/workout/${workout._id}`)}
                                className="bg-white dark:bg-[#1A1F2B] p-2.5 rounded-[1.8rem] shadow-sm border border-gray-100 dark:border-gray-800/50 relative group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="bg-gray-100 dark:bg-gray-800 h-32 rounded-3xl mb-3 relative overflow-hidden shrink-0">
                                    <img src={workout.images?.[0] ? getImageUrl(workout.images[0]) : 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop'} alt={workout.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                            <PlayCircle className="text-white fill-white" size={20} />
                                        </div>
                                    </div>
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10 tracking-widest">
                                            {workout.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-1 flex-1 flex flex-col justify-between gap-3">
                                    <h3 className="font-black text-gray-900 dark:text-white leading-none text-sm uppercase tracking-tight line-clamp-1">{workout.title}</h3>

                                    <div className="grid grid-cols-2 gap-1.5 pb-1">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <div className="w-5 h-5 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                                <Dumbbell size={10} className="text-emerald-500" />
                                            </div>
                                            <span className="text-[10px] font-bold dark:text-gray-300 truncate">{workout.sets || '3'} Sets</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <div className="w-5 h-5 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                                <Zap size={10} className="text-amber-500" />
                                            </div>
                                            <span className="text-[10px] font-bold dark:text-gray-300 truncate">{workout.reps || '12'} Reps</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400 col-span-2 mt-0.5">
                                            <div className="w-5 h-5 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                                <Clock size={10} className="text-blue-500" />
                                            </div>
                                            <span className="text-[10px] font-bold dark:text-gray-300">{workout.duration || '20m'}</span>
                                        </div>
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
