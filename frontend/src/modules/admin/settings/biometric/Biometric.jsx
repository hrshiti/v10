import React, { useState } from 'react';
import { Plus, Fingerprint } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// Add Biometric Modal Component
const AddBiometricModal = ({ isOpen, onClose, isDarkMode }) => {
  const [deviceName, setDeviceName] = useState('');
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-lg shadow-2xl ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100'}`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-800">
              <Fingerprint size={20} className="text-white" />
            </div>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Biometric</h2>
          </div>
          <button onClick={onClose} className={`text-2xl ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Serial No */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Serial No.*
            </label>
            <input
              type="text"
              placeholder="Device Serial No."
              className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode
                  ? 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'
                  : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'
                }`}
            />
          </div>

          {/* Device Type */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Device Type
            </label>
            <input
              type="text"
              placeholder="Device Type"
              className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode
                  ? 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'
                  : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'
                }`}
            />
          </div>

          {/* Device Model */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Device Model
            </label>
            <input
              type="text"
              placeholder="Device Model No."
              className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${isDarkMode
                  ? 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'
                  : 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400'
                }`}
            />
          </div>

          {/* Device Name Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
              className="w-auto px-4 py-3 border-2 border-orange-500 rounded-lg text-sm font-medium text-orange-500 flex items-center gap-2 hover:bg-orange-50 transition-colors"
            >
              {deviceName || 'Select Device Name'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L2 4h8L6 8z" />
              </svg>
            </button>

            {isDeviceDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div
                  onClick={() => {
                    setDeviceName('Biomax');
                    setIsDeviceDropdownOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  Biomax
                </div>
                <div
                  onClick={() => {
                    setDeviceName('ESSL');
                    setIsDeviceDropdownOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  ESSL
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const Biometric = () => {
  const { isDarkMode } = useOutletContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            BIOMETRIC ACCESS
          </h1>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Configure hardware security devices
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md active:scale-95 transition-all"
        >
          <Plus size={20} />
          PROVISION DEVICE
        </button>
      </div>

      {/* Main Content */}
      <div className={`rounded-3xl border p-16 min-h-[500px] flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-100'
        }`}>
        {/* Fingerprint Icon */}
        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 ${isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-300'
          }`}>
          <Fingerprint size={48} className="opacity-40" />
        </div>

        {/* Title */}
        <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Establish <span className="text-orange-500">Security Gateways</span>
        </h2>

        {/* Description */}
        <p className={`text-base font-medium max-w-xl mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Connect your ZKTeco or Essl biometric devices to synchronize facility access with member membership status in real-time.
        </p>

        {/* Features */}
        <div className={`pt-8 flex items-center justify-center gap-8 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'
          }`}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                <rect x="9" y="9" width="6" height="6" strokeWidth="2" />
              </svg>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              AUTO SYNC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" />
              </svg>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              ACCESS CONTROL
            </span>
          </div>
        </div>
      </div>

      {/* Add Biometric Modal */}
      <AddBiometricModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Biometric;
