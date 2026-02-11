import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, X, Loader2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';

const MemberSearch = ({ isDarkMode }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length >= 2) {
                performSearch();
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const performSearch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const token = adminInfo?.token;
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/api/admin/members?keyword=${encodeURIComponent(query)}&pageSize=5`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch members');
            const data = await res.json();
            setResults(data.members || []);
            setShowResults(true);
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectMember = (memberId) => {
        navigate(`/admin/members/profile/${memberId}/edit`); // Navigating to edit which is the default for profile/:id
        setQuery('');
        setShowResults(false);
    };

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className={`relative group flex items-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#f97316]/50 focus-within:border-[#f97316]`}>
                <div className="pl-4 text-gray-400 group-focus-within:text-[#f97316] transition-colors">
                    {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Search size={20} />
                    )}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search member by name or phone..."
                    className={`w-full px-4 py-2.5 text-[15px] outline-none bg-transparent ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-black placeholder:text-gray-400'}`}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
                        className="pr-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {showResults && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                    {results.length > 0 ? (
                        <div className="py-2">
                            {results.map((member) => (
                                <div
                                    key={member._id}
                                    onClick={() => handleSelectMember(member._id)}
                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                            {member.photo ? (
                                                <img src={member.photo} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-[15px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                                {member.firstName} {member.lastName}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[12px] font-medium">
                                                <Phone size={12} />
                                                <span>{member.mobile}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/members/profile/${member._id}/sale/fresh`);
                                                setQuery('');
                                                setShowResults(false);
                                            }}
                                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-orange-500/20 text-orange-500' : 'hover:bg-orange-50 text-orange-600'}`}
                                            title="New Sale"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                                            member.status === 'Expired' ? 'bg-red-500/10 text-red-500' :
                                                'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {member.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-[14px] font-medium">No members found</p>
                            <p className="text-[12px] mt-1">Try another name or mobile number</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemberSearch;
