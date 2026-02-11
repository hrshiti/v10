import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Image, Camera, ScanLine, CheckCircle } from 'lucide-react';

import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import toast, { Toaster } from 'react-hot-toast';
import ManualEntryModal from '../components/ManualEntryModal';
import { API_BASE_URL } from '../../../config/api';

const ScanQR = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);

    // States
    const [hasPermission, setHasPermission] = useState(null);
    const [torchOn, setTorchOn] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [showManualEntry, setShowManualEntry] = useState(false);

    // Camera constraints
    const videoConstraints = {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
    };


    // Toggle Flashlight
    const toggleTorch = async () => {
        if (webcamRef.current && webcamRef.current.stream) {
            const track = webcamRef.current.stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            if (capabilities.torch) {
                try {
                    await track.applyConstraints({
                        advanced: [{ torch: !torchOn }]
                    });
                    setTorchOn(!torchOn);
                } catch (err) {
                    console.error("Torch error:", err);
                }
            } else {
                toast.error("Flashlight not supported on this device.");
            }
        }
    };

    // Handle File Upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const loadingToast = toast.loading("Processing image...", { id: 'qr-upload' });

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                setTimeout(() => {
                    try {
                        const scan = (scale = 1, filter = 'none') => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d', { willReadFrequently: true });
                            const w = Math.floor(img.width * scale);
                            const h = Math.floor(img.height * scale);
                            canvas.width = w;
                            canvas.height = h;

                            if (filter !== 'none') ctx.filter = filter;

                            // Draw image with potential filtering
                            ctx.drawImage(img, 0, 0, w, h);

                            const imageData = ctx.getImageData(0, 0, w, h);
                            return jsQR(imageData.data, w, h, {
                                inversionAttempts: "attemptBoth"
                            });
                        };

                        // 1. Try original
                        let code = scan(1);

                        // 2. Try optimized resolution (600px - sweet spot for jsQR)
                        if (!code) {
                            code = scan(Math.min(1, 600 / Math.max(img.width, img.height)));
                        }

                        // 3. Try high contrast + grayscale (helps with reflections/shadows)
                        if (!code) {
                            code = scan(Math.min(1, 800 / Math.max(img.width, img.height)), 'contrast(1.6) grayscale(1) brightness(1.1)');
                        }

                        // 4. Try aggressive sharpen (simulated via multiple draws or filter)
                        if (!code) {
                            code = scan(Math.min(1, 1000 / Math.max(img.width, img.height)), 'contrast(2) saturate(0) brightness(1.2)');
                        }

                        if (code && code.data) {
                            toast.success("QR Code detected!", { id: 'qr-upload' });
                            handleScanSuccess(code.data);
                        } else {
                            toast.error("Could not find a valid QR. Please ensure the code is clear and not blocked.", { id: 'qr-upload' });
                        }
                    } catch (err) {
                        console.error('QR Decode Error:', err);
                        toast.error("Error analyzing image.", { id: 'qr-upload' });
                    }
                }, 200);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Success Handler
    const handleScanSuccess = async (data) => {
        if (isProcessing) return;
        setIsProcessing(true);

        // Haptic Feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(120);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/attendance/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({ gymId: data })
            });
            const result = await response.json();

            if (response.ok && result.success) {
                setScannedData(data); // Lock the scanner

                // Audio feedback (Beep) logic could go here if sound file exists

                // Short delay before showing success screen for premium feel
                setTimeout(() => {
                    navigate('/success', { state: { message: result.message, type: result.type } });
                }, 800);
            } else {
                // Check if subscription expired
                if (result.type === 'expired') {
                    // Show a more prominent error for expired subscription
                    toast.error(
                        <div className="flex flex-col gap-2">
                            <p className="font-bold text-base">⚠️ Subscription Expired</p>
                            <p className="text-sm">{result.message}</p>
                        </div>,
                        {
                            duration: 6000,
                            style: {
                                background: '#dc2626',
                                color: '#fff',
                                border: '2px solid #fca5a5',
                                minWidth: '300px'
                            }
                        }
                    );
                } else {
                    toast.error(result.message || 'Error marking attendance');
                }
                setIsProcessing(false); // Unlock to try again
                setScannedData(null);
            }
        } catch (err) {
            toast.error('Connection error. Please try again.');
            setIsProcessing(false);
            setScannedData(null);
        }
    };

    // Scanning Loop
    useEffect(() => {
        let lastScanTime = 0;
        const SCAN_INTERVAL = 100; // Increased frequency for "instant" feel
        let animationId;

        const scanFrame = () => {
            if (webcamRef.current && webcamRef.current.video) {
                const video = webcamRef.current.video;

                if (video.readyState === video.HAVE_ENOUGH_DATA && !isProcessing && !scannedData) {
                    const now = Date.now();
                    if (now - lastScanTime > SCAN_INTERVAL) {
                        const canvas = document.createElement('canvas');

                        // Downscale slightly for much faster processing without losing QR detail
                        const displayWidth = video.videoWidth;
                        const displayHeight = video.videoHeight;
                        const scale = Math.min(1, 640 / Math.max(displayWidth, displayHeight));

                        canvas.width = displayWidth * scale;
                        canvas.height = displayHeight * scale;

                        const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
                        ctx.imageSmoothingEnabled = false; // Sharper edges for QR
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: "attemptBoth", // More robust in different lighting
                        });

                        if (code && code.data) {
                            handleScanSuccess(code.data);
                        }
                        lastScanTime = now;
                    }
                }
            }

            if (!scannedData) {
                animationId = requestAnimationFrame(scanFrame);
            }
        };

        animationId = requestAnimationFrame(scanFrame);
        return () => cancelAnimationFrame(animationId);
    }, [isProcessing, scannedData]);




    return (
        <div className="h-screen w-full bg-black relative flex flex-col items-center justify-between font-sans overflow-hidden">

            {/* Camera Viewfinder */}
            <div className="absolute inset-0 z-0 text-center flex items-center justify-center">
                {/* Placeholder until loaded */}
                {!hasPermission && !cameraError && (
                    <p className="text-white/50 animate-pulse">Initializing Camera...</p>
                )}

                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMediaError={(err) => {
                        console.error('Camera error:', err);
                        setCameraError(err);
                        toast.error('Camera access denied. Please enable camera permissions.');
                    }}
                    onUserMedia={() => setHasPermission(true)}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Dark Overlay with cutout */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Error Message - Non Blocking */}
            {cameraError && (
                <div className="absolute top-20 z-50 w-full px-6">
                    <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 p-4 rounded-2xl flex items-center gap-4">
                        <Camera size={24} className="text-red-500" />
                        <div className="flex-1">
                            <p className="text-white text-xs font-bold">Camera Access Failed</p>
                            <p className="text-gray-400 text-[10px]">Use the upload button below to scan from gallery.</p>
                        </div>
                        <button
                            onClick={() => setCameraError(null)}
                            className="text-white/50 text-[10px] underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="relative z-20 w-full max-w-md p-6 flex justify-between items-center text-white">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/10 transition-all border border-white/10"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold tracking-wide">Scan QR Code</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Scanning Area */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full pointer-events-none">
                <div className="relative w-72 h-72">
                    {/* Corner Borders */}
                    <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-xl transition-colors duration-300 ${isProcessing ? 'border-yellow-400' : scannedData ? 'border-emerald-500' : 'border-emerald-500'} shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>
                    <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-xl transition-colors duration-300 ${isProcessing ? 'border-yellow-400' : scannedData ? 'border-emerald-500' : 'border-emerald-500'} shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>
                    <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-300 ${isProcessing ? 'border-yellow-400' : scannedData ? 'border-emerald-500' : 'border-emerald-500'} shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>
                    <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-xl transition-colors duration-300 ${isProcessing ? 'border-yellow-400' : scannedData ? 'border-emerald-500' : 'border-emerald-500'} shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>

                    {/* Content Overlay */}
                    <div className="absolute inset-4 flex flex-col items-center justify-center">
                        {isProcessing && !scannedData && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-black/40 backdrop-blur-md p-6 rounded-3xl flex flex-col items-center gap-3 border border-yellow-500/30"
                            >
                                <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">Processing...</span>
                            </motion.div>
                        )}

                        {scannedData && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-emerald-500 p-6 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                            >
                                <CheckCircle size={48} className="text-white" />
                            </motion.div>
                        )}
                    </div>

                    {/* Scanning Animation Line */}
                    {!isProcessing && !scannedData && (
                        <motion.div
                            initial={{ top: 0, opacity: 0 }}
                            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} // Faster animation
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(52,211,153,1)]"
                        />
                    )}

                    {/* Hint Text */}
                    <div className="absolute -bottom-16 left-0 right-0 text-center flex flex-col items-center gap-2">
                        <p className="text-white/80 text-sm font-medium">Align QR code within the frame</p>
                        <button
                            onClick={() => setShowManualEntry(true)}
                            className="text-emerald-400 text-xs font-bold uppercase tracking-widest p-2 pointer-events-auto"
                        >
                            Manual Entry?
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-20 w-full max-w-md p-8 pb-12 flex flex-col gap-6">

                {/* Control Bar */}
                <div className="flex justify-center items-center gap-12 text-white">
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 group-active:scale-95 transition-all group-hover:bg-white/20">
                            <Image size={24} />
                        </div>
                        <span className="text-xs font-medium text-white/60">Upload</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 group">
                        <div className="p-5 rounded-full bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] group-active:scale-95 transition-all scale-110 border-4 border-black/20">
                            <ScanLine size={28} />
                        </div>
                    </button>

                    <button
                        onClick={toggleTorch}
                        className={`flex flex-col items-center gap-2 group transition-colors ${torchOn ? 'text-yellow-400' : 'text-white'}`}
                    >
                        <div className={`p-4 rounded-full backdrop-blur-md border group-active:scale-95 transition-all group-hover:bg-white/20 ${torchOn ? 'bg-yellow-400/20 border-yellow-400/50' : 'bg-white/10 border-white/10'}`}>
                            <Zap size={24} className={torchOn ? 'fill-yellow-400' : ''} />
                        </div>
                        <span className="text-xs font-medium text-white/60">{torchOn ? 'On' : 'Flash'}</span>
                    </button>
                </div>
            </div>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)'
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Manual Entry Modal */}
            {showManualEntry && (
                <ManualEntryModal
                    onClose={() => setShowManualEntry(false)}
                    onSubmit={handleScanSuccess}
                />
            )}
        </div>
    );
};

export default ScanQR;
