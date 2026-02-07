import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext'; // Import useTheme hook
import { API_BASE_URL } from '../../../config/api';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits
    const inputRefs = useRef([]);
    const mobile = location.state?.mobile || '9999999999';

    // Force dark mode context check to prevent white flash
    const themeContext = useTheme();

    // Handle input change
    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp: otpString })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user details
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data));

                if (data.role === 'trainer') {
                    navigate('/trainer');
                } else {
                    navigate('/');
                }
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] font-sans w-full max-w-md mx-auto relative shadow-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 transition-colors duration-300 flex flex-col px-6 pt-8 pb-6">
            {/* Background elements */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-400/10 to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 mb-8 mt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 flex flex-col z-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Verification</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        We've sent a 6-digit verification code to
                        <br />
                        <span className="font-semibold text-gray-900 dark:text-gray-200">+91 {mobile}</span>
                    </p>
                </div>

                <div className="flex justify-between gap-2 mb-12 w-full">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-11 h-14 rounded-xl bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-gray-800 text-center text-xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm"
                            inputMode="numeric"
                        />
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="text-center mb-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Didn't receive the code?{' '}
                        <button className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline bg-transparent border-none cursor-pointer">
                            Resend Again
                        </button>
                    </p>
                </div>

                <div className="mt-auto mb-4">
                    <button
                        onClick={handleVerify}
                        disabled={!isOtpComplete || loading}
                        className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${isOtpComplete && !loading
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-[1.02] shadow-lg shadow-emerald-500/20'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <span>{loading ? 'Verifying...' : 'Verify & Proceed'}</span>
                        {!loading && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
