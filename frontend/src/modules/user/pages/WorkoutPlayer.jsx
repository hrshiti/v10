import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CheckCircle, Clock, Zap, Target, RotateCcw, RotateCw, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

const WorkoutPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Convert duration string to seconds for logic (Mocking 25 min = 1500 sec)
    const TOTAL_DURATION = 1500;

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);

    // New States for Volume, Speed, Fullscreen
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const controlsTimeoutRef = useRef(null);
    const videoContainerRef = useRef(null);

    // Mock workout details
    const workoutDetails = {
        title: 'Full Body HIIT',
        description: 'A high-intensity interval training session designed to burn calories and boost your metabolism. No equipment needed.',
        thumbnail: 'https://images.unsplash.com/photo-1517963879466-dbbcd8ebb0a9?auto=format&fit=crop&q=80&w=800',
        durationStr: '25 min',
        intensity: 'High',
        level: 'Intermediate',
        calories: '320 kcal',
        category: 'HIIT'
    };

    // Format time helper (MM:SS)
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle Controls Visibility
    useEffect(() => {
        if (isPlaying) {
            resetControlsTimeout();
        } else {
            setShowControls(true);
        }
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [isPlaying, showControls]);

    const resetControlsTimeout = () => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000); // Hide after 3 seconds of inactivity
    };

    const handleInteraction = () => {
        resetControlsTimeout();
    };

    // Timer Logic with Speed
    useEffect(() => {
        let interval;
        if (isPlaying && currentTime < TOTAL_DURATION) {
            interval = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev >= TOTAL_DURATION) {
                        setIsPlaying(false);
                        return TOTAL_DURATION;
                    }
                    return prev + 1;
                });
            }, 1000 / playbackSpeed); // Adjust interval based on speed
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTime, playbackSpeed]);

    const handlePlayPause = (e) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
        resetControlsTimeout();
    };

    const skipForward = (e) => {
        e.stopPropagation();
        setCurrentTime((prev) => Math.min(prev + 10, TOTAL_DURATION));
        resetControlsTimeout();
    };

    const skipBackward = (e) => {
        e.stopPropagation();
        setCurrentTime((prev) => Math.max(prev - 10, 0));
        resetControlsTimeout();
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const newTime = Number(e.target.value);
        setCurrentTime(newTime);
        resetControlsTimeout();
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const cycleSpeed = (e) => {
        e.stopPropagation();
        const speeds = [0.5, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
        setPlaybackSpeed(nextSpeed);
    };

    const toggleFullscreen = (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
            videoContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Listen for fullscreen change events (ESC key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleComplete = () => {
        setIsCompleted(true);

        // Update local storage progress
        const currentProgress = parseInt(localStorage.getItem('dailyWorkoutProgress') || '0', 10);
        const newProgress = Math.min(currentProgress + 20, 100);
        localStorage.setItem('dailyWorkoutProgress', newProgress.toString());

        // Dispatch event for same-window updates
        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
            navigate('/', { state: { workoutCompleted: true } });
        }, 1500);
    };

    // Progress percentage for other UI elements
    const progressPercent = (currentTime / TOTAL_DURATION) * 100;

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col transition-colors duration-300">
            {/* Added container to constrain max width on desktop but keep 100% on mobile */}
            <div className={`w-full mx-auto bg-[#121212] min-h-screen relative shadow-2xl overflow-hidden ${isFullscreen ? '' : 'max-w-md'}`}>

                {/* Video Player Container */}
                <div
                    ref={videoContainerRef}
                    className={`relative w-full bg-black group touch-none select-none ${isFullscreen ? 'h-screen flex items-center justify-center' : 'aspect-[16/9]'}`}
                    onClick={handleInteraction}
                >
                    {/* Background Image/Video Placeholder */}
                    <div className={`w-full relative overflow-hidden ${isFullscreen ? 'h-full aspect-video max-h-screen' : 'h-full'}`}>
                        <img
                            src={workoutDetails.thumbnail}
                            alt="Video Thumbnail"
                            className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-40' : 'opacity-60'}`}
                        />
                        {isPlaying && (
                            <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                                {/* In real implementation, <video> tag goes here */}
                            </div>
                        )}
                    </div>

                    {/* Overlays (Controls) */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {/* Top Bar - Header + Right Controls */}
                        <div className="bg-gradient-to-b from-black/80 to-transparent p-4 flex items-start justify-between">
                            {/* Left: Back & Title */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <ArrowLeft size={20} className="text-white" />
                                </button>
                                <div>
                                    <h2 className="text-sm font-bold text-gray-100 leading-none shadow-black drop-shadow-md">{workoutDetails.title}</h2>
                                </div>
                            </div>

                            {/* Right: Volume, Speed, Fullscreen */}
                            <div className="flex items-center gap-4">
                                {/* Speed Toggle */}
                                <button
                                    onClick={cycleSpeed}
                                    className="text-xs font-bold px-2 py-1 rounded bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                                >
                                    {playbackSpeed}x
                                </button>

                                {/* Volume Toggle */}
                                <button onClick={toggleMute} className="text-white hover:text-emerald-400 transition-colors">
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>

                                {/* Fullscreen Toggle */}
                                <button onClick={toggleFullscreen} className="text-white hover:text-emerald-400 transition-colors">
                                    <Maximize size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Center Controls */}
                        <div className="flex items-center justify-center gap-8 md:gap-16">
                            {/* Rewind 10s */}
                            <button
                                onClick={skipBackward}
                                className="p-3 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-all active:scale-95 flex flex-col items-center gap-1 group/btn"
                            >
                                <RotateCcw size={28} />
                                <span className="text-[10px] font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity">-10s</span>
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={handlePlayPause}
                                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            >
                                {isPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} className="ml-1" />}
                            </button>

                            {/* Forward 10s */}
                            <button
                                onClick={skipForward}
                                className="p-3 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-all active:scale-95 flex flex-col items-center gap-1 group/btn"
                            >
                                <RotateCw size={28} />
                                <span className="text-[10px] font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity">+10s</span>
                            </button>
                        </div>

                        {/* Bottom Bar - Timeline */}
                        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-4">

                            {/* Seek Slider & Times Row */}
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-gray-300 w-10 text-right">{formatTime(currentTime)}</span>

                                <div className="relative h-4 group/slider flex-1 flex items-center">
                                    <input
                                        type="range"
                                        min={0}
                                        max={TOTAL_DURATION}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
                                    />
                                    {/* Track Background */}
                                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden relative z-10 pointer-events-none">
                                        {/* Visited Progress */}
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    {/* Thumb (Visual Only - follows progress) */}
                                    <div
                                        className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow border border-white z-10 pointer-events-none transition-all duration-100 ease-linear group-hover/slider:scale-125"
                                        style={{ left: `${progressPercent}%`, transform: 'translateX(-50%)' }}
                                    ></div>
                                </div>

                                <span className="text-xs font-medium text-gray-300 w-10">{formatTime(TOTAL_DURATION)}</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Video Info & Details Content - Hide in Fullscreen */}
                {!isFullscreen && (
                    <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold leading-tight mb-1">{workoutDetails.title}</h1>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block ${workoutDetails.intensity === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
                                    }`}>
                                    {workoutDetails.intensity} Intensity
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="bg-[#1A1F2B] p-3 rounded-2xl border border-gray-800 flex flex-col items-center justify-center gap-1">
                                <Clock size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold text-gray-300">{workoutDetails.durationStr}</span>
                                <span className="text-[9px] text-gray-500 uppercase">Duration</span>
                            </div>
                            <div className="bg-[#1A1F2B] p-3 rounded-2xl border border-gray-800 flex flex-col items-center justify-center gap-1">
                                <Zap size={16} className="text-amber-500" />
                                <span className="text-xs font-bold text-gray-300">{workoutDetails.calories}</span>
                                <span className="text-[9px] text-gray-500 uppercase">Burn</span>
                            </div>
                            <div className="bg-[#1A1F2B] p-3 rounded-2xl border border-gray-800 flex flex-col items-center justify-center gap-1">
                                <Target size={16} className="text-blue-500" />
                                <span className="text-xs font-bold text-gray-300">{workoutDetails.level}</span>
                                <span className="text-[9px] text-gray-500 uppercase">Level</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-200 mb-2">Description</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {workoutDetails.description}
                                </p>
                            </div>

                            {/* Stats / Progress Placeholder */}
                            <div className="bg-[#1A1F2B] p-4 rounded-2xl border border-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-200">Session Progress</span>
                                    <span className="text-xs font-bold text-emerald-500">{Math.round(progressPercent)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Complete Button - Hide in Fullscreen */}
                {!isFullscreen && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent z-20">
                        {!isCompleted ? (
                            <button
                                onClick={handleComplete}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-black font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                <span>Mark as Complete</span>
                            </button>
                        ) : (
                            <div className="w-full bg-[#1A1F2B] text-white font-bold py-4 rounded-2xl border border-emerald-500/30 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-5 fade-in">
                                <CheckCircle size={20} className="text-emerald-500" />
                                <span className="text-emerald-500">Workout Completed!</span>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default WorkoutPlayer;
