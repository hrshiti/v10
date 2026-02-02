import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Image, Camera, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const ScanQR = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);

    // States
    const [hasPermission, setHasPermission] = useState(null);
    const [torchOn, setTorchOn] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [cameraError, setCameraError] = useState(null);

    // Camera constraints
    const videoConstraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "environment"
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
                // Determine if we should show a specific error or just standard alert
                const errorMsg = "Flashlight control is not supported by this browser/device.";
                alert(errorMsg);
            }
        }
    };

    // Handle File Upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    handleScanSuccess(code.data);
                } else {
                    alert("No QR code found in this image. Please try another clearer image.");
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Success Handler
    const handleScanSuccess = (data) => {
        if (scannedData) return;
        setScannedData(data);
        // Navigate immediately or showing a success state first
        navigate('/success');
    };

    // Scanning Loop
    useEffect(() => {
        const scanFrame = () => {
            if (webcamRef.current && webcamRef.current.video?.readyState === 4 && !scannedData) {
                const video = webcamRef.current.video;
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    handleScanSuccess(code.data);
                }
            }
            if (!scannedData) {
                requestAnimationFrame(scanFrame);
            }
        };

        const animationId = requestAnimationFrame(scanFrame);
        return () => cancelAnimationFrame(animationId);
    }, [scannedData]);

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
                    onUserMediaError={(err) => setCameraError(err)}
                    onUserMedia={() => setHasPermission(true)}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Dark Overlay with cutout */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Error Message */}
            {cameraError && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-6 text-center">
                    <div className="text-white">
                        <Camera size={48} className="mx-auto mb-4 text-red-500" />
                        <h2 className="text-xl font-bold mb-2">Camera Error</h2>
                        <p className="text-gray-400 mb-4">Could not access camera. Please ensure permissions are granted.</p>
                        <button onClick={() => navigate('/')} className="px-6 py-2 bg-white text-black rounded-full font-bold">Go Back</button>
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
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                    {/* Scanning Animation Line */}
                    <motion.div
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                    />

                    {/* Hint Text */}
                    <div className="absolute -bottom-16 left-0 right-0 text-center">
                        <p className="text-white/80 text-sm font-medium">Align QR code within the frame</p>
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
        </div>
    );
};

export default ScanQR;
