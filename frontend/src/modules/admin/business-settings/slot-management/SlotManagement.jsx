import React from 'react';
import { useOutletContext } from 'react-router-dom';

const SlotManagement = () => {
  const { isDarkMode } = useOutletContext();

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="mb-8">
          <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
            {/* Person doing exercise illustration */}
            <g>
              {/* Body */}
              <ellipse cx="100" cy="140" rx="60" ry="15" fill="#e5e7eb" opacity="0.3" />

              {/* Legs */}
              <path d="M 85 110 Q 70 130 75 155" stroke="#374151" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M 115 110 Q 130 130 125 155" stroke="#374151" strokeWidth="8" fill="none" strokeLinecap="round" />

              {/* Shoes */}
              <ellipse cx="75" cy="155" rx="12" ry="6" fill="#1f2937" />
              <ellipse cx="125" cy="155" rx="12" ry="6" fill="#1f2937" />

              {/* Torso */}
              <rect x="80" y="60" width="40" height="50" rx="20" fill="#3b82f6" />

              {/* Arms */}
              <path d="M 80 70 Q 60 80 50 100" stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 120 70 Q 140 80 150 100" stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" />

              {/* Hands */}
              <circle cx="50" cy="100" r="8" fill="#fcd34d" />
              <circle cx="150" cy="100" r="8" fill="#fcd34d" />

              {/* Phone in hand */}
              <rect x="145" y="95" width="15" height="25" rx="2" fill="#1f2937" />
              <rect x="147" y="97" width="11" height="19" rx="1" fill="#60a5fa" />

              {/* Head */}
              <circle cx="100" cy="45" r="18" fill="#fbbf24" />

              {/* Hair */}
              <path d="M 85 35 Q 90 25 100 25 Q 110 25 115 35" fill="#1f2937" />

              {/* Face details */}
              <circle cx="95" cy="43" r="2" fill="#1f2937" />
              <circle cx="105" cy="43" r="2" fill="#1f2937" />
              <path d="M 95 50 Q 100 52 105 50" stroke="#1f2937" strokeWidth="1.5" fill="none" />
            </g>
          </svg>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Slot Booking
        </h1>

        {/* Description */}
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Contact to gymowl team for{' '}
          <span className="text-orange-500 font-semibold">SLOT BOOKING</span>
          {' '}subscription
        </p>
      </div>
    </div>
  );
};

export default SlotManagement;
