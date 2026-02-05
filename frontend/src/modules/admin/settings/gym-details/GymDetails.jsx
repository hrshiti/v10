import React, { useState, useRef, useEffect } from 'react';
import { Edit2, X, Loader2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';
import Toast from '../../components/Toast';

const GymDetails = () => {
  const { isDarkMode } = useOutletContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gymId, setGymId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    logo: null,
    contactNumber: '',
    address: '',
    gstNo: '',
    logoUrl: ''
  });
  const fileInputRef = useRef(null);

  const fetchGymDetails = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/gym-details`, {
        headers: {
          'Authorization': `Bearer ${adminInfo?.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          ...formData,
          contactNumber: data.contactNumber || '',
          address: data.address || '',
          gstNo: data.gstNo || '',
          logoUrl: data.logo || ''
        });
        setGymId(data._id);
      }
    } catch (err) {
      console.error('Error fetching gym details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGymDetails();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const data = new FormData();
      data.append('contactNumber', formData.contactNumber);
      data.append('address', formData.address);
      data.append('gstNo', formData.gstNo);
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/gym-details`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminInfo?.token}`
        },
        body: data
      });

      if (response.ok) {
        const updatedData = await response.json();
        setFormData({
          ...formData,
          logoUrl: updatedData.logo,
          logo: null
        });
        setToastMsg('Gym details updated successfully');
        setShowToast(true);
        setShowEditModal(false);
      } else {
        setToastMsg('Failed to update details');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Error updating gym details:', err);
      setToastMsg('Error updating details');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className={`p-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <h1 className="text-2xl font-bold mb-8 uppercase italic tracking-tight">Gym Information</h1>

      <div className={`rounded-3xl border overflow-hidden transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
        {/* Top Section */}
        <div className="flex justify-between items-start p-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center gap-8">
            <div className={`w-40 h-40 rounded-2xl border-2 flex items-center justify-center p-3 shadow-inner ${isDarkMode ? 'bg-[#121212] border-white/5' : 'bg-white border-gray-50'}`}>
              <img
                src={formData.logoUrl || '/v10_logo.png'}
                alt="Gym Logo"
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.target.src = '/v10_logo.png' }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">V-10 Fitness</h2>
              <p className="text-gray-500 font-bold text-sm tracking-widest mt-1 uppercase">Official Gym Account</p>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className={`flex items-center gap-2 px-8 py-3 bg-[#f97316] text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95`}>
            <Edit2 size={16} strokeWidth={3} />
            Edit Profile
          </button>
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-gray-100 dark:divide-white/5">
          <div className="p-8 group hover:bg-white/5 transition-all">
            <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Contact Number</p>
            <p className="text-[16px] font-bold tracking-tight">{formData.contactNumber || 'Not Provided'}</p>
          </div>
          <div className="p-8 group hover:bg-white/5 transition-all">
            <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Gym Address</p>
            <p className="text-[16px] font-bold tracking-tight leading-relaxed">{formData.address || 'Not Provided'}</p>
          </div>
          <div className="p-8 group hover:bg-white/5 transition-all">
            <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3">GST No.</p>
            <p className={`text-[16px] font-bold tracking-tight ${!formData.gstNo ? 'text-gray-400 font-medium italic' : ''}`}>
              {formData.gstNo || 'Not Provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center p-8 border-b bg-gradient-to-r from-orange-500/10 to-transparent ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <h2 className={`text-2xl font-black uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Update Info</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div className="col-span-1 md:col-span-2">
                  <label className={`block text-[11px] font-black uppercase tracking-widest mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Gym Logo
                  </label>
                  <div className="relative group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${formData.logo
                          ? 'border-orange-500 bg-orange-500/5'
                          : 'border-gray-200 dark:border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5'
                        }`}
                    >
                      {formData.logo ? (
                        <p className="text-orange-500 font-bold">{formData.logo.name}</p>
                      ) : (
                        <>
                          <Edit2 className="text-gray-400" size={24} />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Click to upload brand logo</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className={`block text-[11px] font-black uppercase tracking-widest mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold tracking-tight outline-none focus:ring-4 focus:ring-orange-500/10 transition-all ${isDarkMode
                      ? 'bg-[#121212] border-white/5 text-white focus:border-orange-500'
                      : 'bg-gray-50 border-transparent text-black focus:border-orange-500'
                      }`}
                    placeholder="Enter gym contact"
                  />
                </div>

                {/* GST No */}
                <div>
                  <label className={`block text-[11px] font-black uppercase tracking-widest mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    GST No.
                  </label>
                  <input
                    type="text"
                    value={formData.gstNo}
                    onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                    placeholder="24XXXXX..."
                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold tracking-tight outline-none focus:ring-4 focus:ring-orange-500/10 transition-all ${isDarkMode
                      ? 'bg-[#121212] border-white/5 text-white focus:border-orange-500'
                      : 'bg-gray-50 border-transparent text-black focus:border-orange-500'
                      }`}
                  />
                </div>

                {/* Address */}
                <div className="col-span-1 md:col-span-2">
                  <label className={`block text-[11px] font-black uppercase tracking-widest mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Gym Address
                  </label>
                  <textarea
                    rows="3"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold tracking-tight outline-none focus:ring-4 focus:ring-orange-500/10 transition-all resize-none ${isDarkMode
                      ? 'bg-[#121212] border-white/5 text-white focus:border-orange-500'
                      : 'bg-gray-50 border-transparent text-black focus:border-orange-500'
                      }`}
                    placeholder="Full gym address..."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-10 py-4 bg-[#f97316] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMsg}
          onClose={() => setShowToast(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default GymDetails;
