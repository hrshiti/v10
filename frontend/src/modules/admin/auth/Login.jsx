import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/admin/auth/login', {
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
        // Call API for forgot password
        try {
            const response = await fetch('http://localhost:5000/api/admin/auth/forgot-password', {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] px-4">
            <div className="max-w-md w-full bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl overflow-hidden p-8 border dark:border-white/10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-[#f97316] dark:focus:border-[#f97316] text-gray-900 dark:text-white transition-colors"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-[#f97316] dark:focus:border-[#f97316] text-gray-900 dark:text-white transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-sm font-bold text-[#f97316] hover:text-orange-600"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>

            {/* Forgot Password Modal */}
            {isForgotPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-xl shadow-2xl p-6 border dark:border-white/10 relative">
                        <button
                            onClick={() => setIsForgotPassword(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">Reset Password</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enter your email to receive a reset link.</p>

                        <form onSubmit={handleForgotPassword}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-[#f97316] dark:focus:border-[#f97316] text-gray-900 dark:text-white"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg active:scale-[0.98] transition-all"
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
