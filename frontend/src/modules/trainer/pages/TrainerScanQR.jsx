import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Image, Camera, ScanLine, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/api';

const TrainerScanQR = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);

    // States
    const [hasPermission, setHasPermission] = useState(null);
    const [torchOn, setTorchOn] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraError, setCameraError] = useState(null);

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
                            ctx.drawImage(img, 0, 0, w, h);

                            const imageData = ctx.getImageData(0, 0, w, h);
                            return jsQR(imageData.data, w, h, {
                                inversionAttempts: "attemptBoth"
                            });
                        };

                        // Multi-pass scanning (Robust)
                        let code = scan(1);
                        if (!code) code = scan(Math.min(1, 600 / Math.max(img.width, img.height)));
                        if (!code) code = scan(Math.min(1, 800 / Math.max(img.width, img.height)), 'contrast(1.6) grayscale(1) brightness(1.1)');
                        if (!code) code = scan(Math.min(1, 1000 / Math.max(img.width, img.height)), 'contrast(2) saturate(0) brightness(1.2)');

                        if (code && code.data) {
                            toast.success("QR Code detected!", { id: 'qr-upload' });
                            handleScanSuccess(code.data);
                        } else {
                            toast.error("Could not find a valid QR.", { id: 'qr-upload' });
                        }
                    } catch (err) {
                        toast.error("Error analyzing image.", { id: 'qr-upload' });
                    }
                }, 200);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Success Handler (Trainer Specific)
    const handleScanSuccess = async (data) => {
        if (isProcessing) return;
        setIsProcessing(true);

        if ('vibrate' in navigator) navigator.vibrate(120);

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/trainer/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({ gymId: data })
            });
            const result = await response.json();

            if (response.ok && result.success) {
                setScannedData(data);
                toast.success(result.message);
                setTimeout(() => {
                    navigate('/trainer');
                }, 1200);
            } else {
                toast.error(result.message || 'Error marking attendance');
                setIsProcessing(false);
                setScannedData(null);
            }
        } catch (err) {
            toast.error('Connection error.');
            setIsProcessing(false);
            setScannedData(null);
        }
    };

    // Scanning Loop
    useEffect(() => {
        let lastScanTime = 0;
        const SCAN_INTERVAL = 100;
        let animationId;

        const scanFrame = () => {
            if (webcamRef.current && webcamRef.current.video) {
                const video = webcamRef.current.video;
                if (video.readyState === video.HAVE_ENOUGH_DATA && !isProcessing && !scannedData) {
                    const now = Date.now();
                    if (now - lastScanTime > SCAN_INTERVAL) {
                        const canvas = document.createElement('canvas');
                        const displayWidth = video.videoWidth;
                        const displayHeight = video.videoHeight;
                        const scale = Math.min(1, 640 / Math.max(displayWidth, displayHeight));

                        canvas.width = displayWidth * scale;
                        canvas.height = displayHeight * scale;

                        const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: "attemptBoth",
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
            {/* Camera View */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                {!hasPermission && !cameraError && (
                    <p className="text-white/50 animate-pulse">Initializing Camera...</p>
                )}
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    videoConstraints={videoConstraints}
                    onUserMediaError={(err) => {
                        setCameraError(err);
                        toast.error('Camera access denied');
                    }}
                    onUserMedia={() => setHasPermission(true)}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-20 w-full p-6 flex justify-between items-center text-white">
                <button
                    onClick={() => navigate('/trainer')}
                    className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold tracking-wide">Trainer Check-in</h1>
                <div className="w-10"></div>
            </div>

            {/* Scan Frame */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full pointer-events-none">
                <div className="relative w-64 h-64">
                    <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-xl border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>
                    <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-xl border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>
                    <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-xl border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>
                    <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-xl border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]`}></div>

                    {/* Scan Line */}
                    {!isProcessing && !scannedData && (
                        <motion.div
                            initial={{ top: 0, opacity: 0 }}
                            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)]"
                        />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                        {isProcessing && !scannedData && (
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Verifying...</span>
                            </div>
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
                </div>
                <p className="mt-12 text-white/80 text-sm font-medium">Place gym QR in the box</p>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-20 w-full p-8 pb-12 flex justify-center gap-8">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white"
                >
                    <Image size={24} />
                </button>
                <button
                    onClick={toggleTorch}
                    className={`p-4 rounded-full backdrop-blur-md border transition-all ${torchOn ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' : 'bg-white/10 border-white/10 text-white'}`}
                >
                    <Zap size={24} className={torchOn ? 'fill-yellow-400' : ''} />
                </button>
            </div>
        </div>
    );
};

export default TrainerScanQR;
