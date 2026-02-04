import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-white' : 'bg-white';
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const iconColor = isSuccess ? 'text-white bg-green-500' : 'text-white bg-red-500';
    const progressColor = isSuccess ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className="fixed top-6 right-6 z-[200] animate-slideIn">
            <div className={`${bgColor} ${borderColor} border-l-4 rounded-lg shadow-2xl overflow-hidden min-w-[320px] max-w-md`}>
                <div className="flex items-start gap-3 p-4">
                    {/* Icon */}
                    <div className={`${iconColor} rounded-full p-1.5 flex-shrink-0`}>
                        {isSuccess ? (
                            <CheckCircle size={20} strokeWidth={3} />
                        ) : (
                            <AlertCircle size={20} strokeWidth={3} />
                        )}
                    </div>

                    {/* Message */}
                    <p className="text-gray-800 text-[15px] font-semibold flex-1 pt-0.5">
                        {message}
                    </p>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 relative overflow-hidden">
                    <div
                        className={`h-full ${progressColor} animate-progress`}
                        style={{
                            animation: `progress ${duration}ms linear forwards`
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
        </div>
    );
};

export default Toast;
