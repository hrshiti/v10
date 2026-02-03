import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, ArrowRight } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Clear any existing tokens when login page loads
    useEffect(() => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const backendUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:5000'
                : `http://${window.location.hostname}:5000`;

            const response = await fetch(`${backendUrl}/api/user/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile })
            });
            const data = await response.json();

            if (response.ok) {
                navigate('/verify-otp', { state: { mobile, type: 'login' } });
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] font-sans w-full max-w-md mx-auto relative shadow-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 transition-colors duration-300 flex flex-col justify-center px-6">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md z-10 relative">
                <div className="mb-8 text-center pt-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your mobile number to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                    {/* Mobile Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Smartphone className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                        </div>
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
                            placeholder="Mobile Number"
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 dark:bg-white text-white dark:text-black'}`}
                    >
                        <span>{loading ? 'Sending...' : 'Get OTP'}</span>
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-center pb-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
