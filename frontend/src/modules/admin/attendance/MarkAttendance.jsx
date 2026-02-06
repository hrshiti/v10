import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import {
    QrCode,
    CheckCircle2,
    XCircle,
    User,
    History,
    RefreshCw,
    Scan
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const MarkAttendance = () => {
    const { isDarkMode } = useOutletContext();
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [lastScanTime, setLastScanTime] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [loading, setLoading] = useState(false);

    const webcamRef = useRef(null);
    const requestRef = useRef();

    const fetchRecentAttendance = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/members/attendance?limit=5`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setRecentAttendance(data.slice(0, 5));
            }
        } catch (err) {
            console.error('Error fetching recent attendance:', err);
        }
    };

    useEffect(() => {
        fetchRecentAttendance();
    }, []);

    const markAttendance = async (memberIdentifier) => {
        if (loading) return;

        const now = Date.now();
        if (now - lastScanTime < 5000) return; // Prevent double scans within 5 seconds

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/members/attendance/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ memberIdentifier })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data);
                setLastScanTime(now);
                fetchRecentAttendance();
                // Play success sound if needed
            } else {
                setError(data.message || 'Failed to mark attendance');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
            // Resume scanning after a delay
            setTimeout(() => {
                setScanResult(null);
            }, 3000);
        }
    };

    const scan = () => {
        if (webcamRef.current && webcamRef.current.video.readyState === webcamRef.current.video.HAVE_ENOUGH_DATA) {
            const video = webcamRef.current.video;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code && !scanResult) {
                setScanResult(code.data);
                markAttendance(code.data);
            }
        }
        requestRef.current = requestAnimationFrame(scan);
    };

    useEffect(() => {
        if (isScanning) {
            requestRef.current = requestAnimationFrame(scan);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isScanning, scanResult]);

    return (
        <div className={`space-y-6 transition-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <div className="flex justify-between items-center">
                <h1 className="text-[28px] font-black tracking-tight">QR Attendance Scanner</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsScanning(!isScanning)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isScanning
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                    >
                        {isScanning ? <XCircle size={18} /> : <Scan size={18} />}
                        {isScanning ? 'Stop Scanner' : 'Resume Scanner'}
                    </button>
                    <button
                        onClick={fetchRecentAttendance}
                        className={`p-2 rounded-lg border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scanner Section */}
                <div className={`p-6 rounded-2xl border transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
                    <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-xl bg-black border-4 border-[#f97316]/20">
                        {isScanning ? (
                            <>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: 'environment' }}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 border-2 border-[#f97316] m-12 rounded-lg opacity-50 animate-pulse pointer-events-none">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#f97316]"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#f97316]"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#f97316]"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#f97316]"></div>

                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-[#f97316] shadow-[0_0_15px_#f97316] animate-scan"></div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <QrCode size={64} className="mb-4 opacity-20" />
                                <p className="font-bold">Scanner is Paused</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col items-center text-center">
                        {loading && (
                            <div className="flex items-center gap-2 text-[#f97316] font-bold">
                                <RefreshCw className="animate-spin" size={20} />
                                Processing...
                            </div>
                        )}

                        {success && (
                            <div className="w-full p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                                <div className="p-3 bg-green-500 rounded-full text-white">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-lg">{success.message}</p>
                                    <p className="font-bold text-sm opacity-80">{success.member.name} ({success.member.memberId})</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-4 animate-shake">
                                <div className="p-3 bg-red-500 rounded-full text-white">
                                    <XCircle size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-lg">Error</p>
                                    <p className="font-bold text-sm opacity-80">{error}</p>
                                </div>
                            </div>
                        )}

                        {!loading && !success && !error && (
                            <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Scan size={32} className="mb-2" />
                                <p className="font-bold">Position QR code within the frame</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border transition-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
                        <div className="flex items-center gap-2 mb-6">
                            <History className="text-[#f97316]" size={20} />
                            <h2 className="text-xl font-black">Recent Scans</h2>
                        </div>

                        <div className="space-y-4">
                            {recentAttendance.length === 0 ? (
                                <div className="text-center py-10 opacity-50">
                                    <User size={48} className="mx-auto mb-2 opacity-20" />
                                    <p className="font-bold">No recent scans</p>
                                </div>
                            ) : (
                                recentAttendance.map((log, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f97316] to-[#f43f5e] flex items-center justify-center text-white font-black text-lg">
                                                {log.memberId?.firstName?.[0] || 'M'}
                                            </div>
                                            <div>
                                                <p className="font-black truncate max-w-[150px]">
                                                    {log.memberId?.firstName} {log.memberId?.lastName}
                                                </p>
                                                <p className="text-[12px] font-bold text-gray-500">
                                                    ID: {log.memberId?.memberId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-sm">
                                                {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${log.checkOut ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                                                }`}>
                                                {log.checkOut ? 'Out' : 'In'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Stats or Tips */}
                    <div className={`p-6 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#f43f5e] text-white shadow-lg shadow-orange-500/20`}>
                        <h3 className="text-lg font-black mb-2">Pro Tip</h3>
                        <p className="text-sm font-bold opacity-90 leading-relaxed">
                            Ensure the QR code is well-lit and held steady. The system automatically detects check-in/out based on previous records of the day.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export default MarkAttendance;
