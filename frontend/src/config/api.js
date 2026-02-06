const getBackendUrl = () => {
    // 1. Priority: Environment Variable from .env file
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl) return envUrl;

    // 2. Fallback: Check if running on localhost
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) return 'http://localhost:5000';

    // 3. Final Fallback: Default Production URL
    return 'https://v10-fitness-gym.onrender.com';
};

export const API_BASE_URL = getBackendUrl();

