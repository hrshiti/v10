// Get the backend URL based on current hostname
export const getBackendUrl = () => {
    const hostname = window.location.hostname;
    return hostname === 'localhost'
        ? 'http://localhost:5000'
        : `http://${hostname}:5000`;
};

export const API_BASE_URL = getBackendUrl();
