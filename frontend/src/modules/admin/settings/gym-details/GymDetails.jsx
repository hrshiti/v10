import React, { useState, useRef } from 'react';
import { Edit2, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const GymDetails = () => {
  const { isDarkMode } = useOutletContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    logo: null,
    contactNumber: '8347008511',
    address: '1st Floor, Rajshree Skyz',
    gstNo: ''
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setShowEditModal(false);
  };

  return (
    <div className={`p-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <h1 className="text-2xl font-bold mb-8">Gym Information</h1>

      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        {/* Top Section */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-6">
            <div className={`w-32 h-32 rounded-lg border flex items-center justify-center p-2 ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-100'}`}>
              <img
                src="/v10_logo.png"
                alt="V-10 Fitness"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className={`flex items-center gap-2 px-6 py-2 border rounded-lg text-sm font-bold transition-colors duration-200 ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}>
            <Edit2 size={16} />
            Edit
          </button>
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-gray-100 dark:divide-white/5">
          <div className="p-6">
            <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Number</p>
            <p className="text-[15px] font-bold">{formData.contactNumber}</p>
          </div>
          <div className="p-6">
            <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Gym Address</p>
            <p className="text-[15px] font-bold">{formData.address}</p>
          </div>
          <div className="p-6">
            <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">GST No.</p>
            <p className="text-[15px] font-bold text-gray-400 font-medium italic">
              {formData.gstNo || 'Not Provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-lg shadow-2xl ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Edit Gym Details</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Logo
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`w-full px-4 py-2 border rounded-lg text-sm ${isDarkMode
                        ? 'bg-[#121212] border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f97316] file:text-white hover:file:bg-[#ea580c]'
                        : 'bg-white border-gray-300 text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f97316] file:text-white hover:file:bg-[#ea580c]'
                      }`}
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg text-sm ${isDarkMode
                        ? 'bg-[#121212] border-white/10 text-white'
                        : 'bg-white border-gray-300 text-black'
                      }`}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg text-sm ${isDarkMode
                        ? 'bg-[#121212] border-white/10 text-white'
                        : 'bg-white border-gray-300 text-black'
                      }`}
                  />
                </div>

                {/* GST No */}
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    GST No.
                  </label>
                  <input
                    type="text"
                    value={formData.gstNo}
                    onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                    placeholder="Enter GST No."
                    className={`w-full px-4 py-2 border rounded-lg text-sm ${isDarkMode
                        ? 'bg-[#121212] border-white/10 text-white placeholder:text-gray-500'
                        : 'bg-white border-gray-300 text-black placeholder:text-gray-400'
                      }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-bold transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymDetails;
