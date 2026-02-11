import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [gymData, setGymData] = useState({ name: 'V-10 Fitness Lab', logo: '' });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGymInfo = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/gym-details`);
                if (res.ok) {
                    const data = await res.json();
                    setGymData({
                        name: data.name || 'V-10 Fitness Lab',
                        logo: data.logo ? (data.logo.startsWith('http') ? data.logo : `${API_BASE_URL}/uploads/${data.logo}`) : ''
                    });
                }
            } catch (err) {
                console.error('Error fetching gym info for login:', err);
            }
        };
        fetchGymInfo();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminInfo', JSON.stringify(data));
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setIsForgotPassword(false);
            } else {
                alert(data.message || 'Error sending email');
            }
        } catch (err) {
            alert('Network issue');
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-[#121212]">
            {/* Left Side: Brand Section */}
            <div className="hidden lg:flex w-1/2 bg-[#1A1F2B] dark:bg-[#0D1117] relative items-center justify-center overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10 text-center space-y-8 p-12 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="flex justify-center items-center gap-6">
                        {/* V-10 Logo */}
                        <div className="w-24 h-24 bg-white rounded-2xl p-3 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
                            <img src="/v10_logo.png" alt="V-10 Logo" className="w-full h-full object-contain" />
                        </div>

                        {/* Dynamic Gym Logo */}
                        {gymData.logo && (
                            <>
                                <div className="h-12 w-px bg-white/10"></div>
                                <div className="w-28 h-28 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
                                    <img
                                        src={gymData.logo}
                                        alt="Gym Logo"
                                        className="w-full h-full object-contain"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            V-10 Fitness Lab
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-sm">
                            Management System
                        </p>
                    </div>

                    <div className="pt-12 grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                            <span className="block text-2xl font-black text-orange-500 italic">24/7</span>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Real-time monitoring</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                            <span className="block text-2xl font-black text-blue-500 italic">SSL</span>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Secure Access</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="lg:hidden text-center mb-12">
                        <img src="/v10_logo.png" alt="V-10 Logo" className="w-20 h-20 mx-auto object-contain mb-4" />
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">V-10 Fitness</h1>
                    </div>

                    <div className="text-left space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <ShieldCheck className="text-orange-500" size={20} />
                            </div>
                            <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Admin Access</span>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Login.</h2>
                        <p className="text-gray-500 font-bold text-sm tracking-tight">Enter your credentials to manage your business.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 pt-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100 dark:border-red-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 text-gray-900 dark:text-white font-bold transition-all"
                                        placeholder="admin@v10.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPassword(true)}
                                        className="text-xs font-black text-[#f97316] hover:text-orange-600 uppercase tracking-widest"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 text-gray-900 dark:text-white font-bold transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-orange-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                        >
                            {loading ? 'Authenticating...' : 'Sign In Now'}
                        </button>
                    </form>

                    <div className="pt-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        Protected by V-10 Security Infrastructure
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {isForgotPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-white/10 relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsForgotPassword(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Reset Pass.</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mt-1">Enter your admin email to reset.</p>
                        </div>

                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
                                <input
                                    type="email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-orange-500/50 text-gray-900 dark:text-white font-bold"
                                    placeholder="your-email@v10.com"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm"
                            >
                                Send Reset Link
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
