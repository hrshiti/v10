import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClearStorageAndRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear all localStorage
        localStorage.clear();

        // Redirect to login
        setTimeout(() => {
            navigate('/login');
        }, 100);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-sm font-medium">Clearing session...</p>
            </div>
        </div>
    );
};

export default ClearStorageAndRedirect;
