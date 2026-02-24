import React, { useState, useRef, useEffect } from 'react';
import { Edit2, X, Loader2, QrCode, RefreshCw, Printer, Download } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config/api';
import Toast from '../../components/Toast';
import { QRCodeCanvas } from 'qrcode.react';

const GymDetails = () => {
  const { isDarkMode } = useOutletContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gymId, setGymId] = useState(null);
  const [gymCode, setGymCode] = useState(null);
  const [gymCodeLoading, setGymCodeLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    logo: null,
    name: '',
    contactNumber: '',
    address: '',
    gstNo: '',
    logoUrl: ''
  });
  const fileInputRef = useRef(null);
  const qrCanvasRef = useRef(null);

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
          name: data.name || 'V-10 Fitness',
          contactNumber: data.contactNumber || '',
          address: data.address || '',
          gstNo: data.gstNo || '',
          logoUrl: data.logo ? (data.logo.startsWith('http') ? data.logo : `${API_BASE_URL}/uploads/${data.logo}`) : ''
        });
        setGymId(data._id);
      }
    } catch (err) {
      console.error('Error fetching gym details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGymCode = async () => {
    try {
      setGymCodeLoading(true);
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/gym-details/qr-code`, {
        headers: { 'Authorization': `Bearer ${adminInfo?.token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setGymCode(data.gymCode);
      }
    } catch (err) {
      console.error('Error fetching gym QR code:', err);
    } finally {
      setGymCodeLoading(false);
    }
  };

  const handleRegenerateQR = async () => {
    if (!window.confirm('Regenerating the QR code will invalidate the old one. Members will need to scan the new QR code. Continue?')) return;
    try {
      setRegenerating(true);
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
      const response = await fetch(`${API_BASE_URL}/api/admin/gym-details/qr-code/regenerate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminInfo?.token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setGymCode(data.gymCode);
        setToastMsg('QR Code regenerated! Print the new one for the gym.');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Error regenerating QR:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handlePrintQR = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Gym QR Code</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;padding:20px;}
      h2{font-size:22px;font-weight:900;margin-bottom:8px;}
      p{color:#666;font-size:13px;margin-bottom:24px;}
      img{width:280px;height:280px;image-rendering:pixelated;}
      </style></head><body>
      <h2>${formData.name || 'V-10 Fitness'}</h2>
      <p>Scan this QR code at the gym entrance to mark attendance</p>
      <img src="${dataUrl}" />
      <p style="margin-top:20px;font-size:11px;color:#aaa;">Official Gym Attendance QR</p>
      <script>window.onload=()=>window.print();<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleDownloadQR = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'gym-attendance-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    fetchGymDetails();
    fetchGymCode();
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
      data.append('name', formData.name);
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
          name: updatedData.name,
          logoUrl: updatedData.logo ? (updatedData.logo.startsWith('http') ? updatedData.logo : `${API_BASE_URL}/uploads/${updatedData.logo}`) : '',
          logo: null
        });
        setToastMsg('Gym details updated successfully');
        setShowToast(true);
        setShowEditModal(false);
        // Dispatch event for Navbar to update
        window.dispatchEvent(new Event('gymDetailsUpdated'));
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
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">{formData.name || 'V-10 Fitness'}</h2>
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

      {/* ===== GYM QR CODE SECTION ===== */}
      <div className={`mt-8 rounded-3xl border overflow-hidden transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="flex justify-between items-center p-8 border-b bg-gradient-to-r from-orange-500/5 to-transparent" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <QrCode size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase italic tracking-tight">Gym Attendance QR Code</h2>
              <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Only this official QR code marks attendance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadQR}
              disabled={gymCodeLoading || !gymCode}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              <Download size={14} />
              Download
            </button>
            <button
              onClick={handlePrintQR}
              disabled={gymCodeLoading || !gymCode}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Printer size={14} />
              Print
            </button>
            <button
              onClick={handleRegenerateQR}
              disabled={regenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 ${isDarkMode ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
              Regenerate
            </button>
          </div>
        </div>
        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
          {/* QR Code - Canvas based, no logo, high quality, scannable from screenshot */}
          <div ref={qrCanvasRef} className="rounded-2xl p-6 flex items-center justify-center bg-white" style={{ minWidth: 220, minHeight: 220 }}>
            {gymCodeLoading ? (
              <Loader2 className="animate-spin text-orange-500" size={40} />
            ) : gymCode ? (
              <QRCodeCanvas
                value={gymCode}
                size={200}
                level="M"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            ) : (
              <div className="text-center">
                <QrCode size={48} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">QR not available</p>
              </div>
            )}
          </div>
          {/* Instructions */}
          <div className="flex-1 space-y-4">
            <div className={`rounded-2xl p-5 border-l-4 border-orange-500 ${isDarkMode ? 'bg-orange-500/5' : 'bg-orange-50'}`}>
              <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-2">How It Works</p>
              <ul className={`text-sm font-medium space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>✅ Print this QR code and place it at the gym entrance</li>
                <li>✅ Members scan it from their <strong>V-10 App</strong> to mark attendance</li>
                <li>❌ Any other QR code will be <strong>rejected</strong> — only this official code works</li>
                <li>🔄 Use <strong>Regenerate</strong> if the QR is compromised (old one becomes invalid)</li>
              </ul>
            </div>
            <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">QR Code ID</p>
              <p className={`text-xs font-mono break-all ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{gymCode || '—'}</p>
            </div>
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
                {/* Gym Name */}
                <div className="col-span-1 md:col-span-2">
                  <label className={`block text-[11px] font-black uppercase tracking-widest mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Gym Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-bold tracking-tight outline-none focus:ring-4 focus:ring-orange-500/10 transition-all ${isDarkMode
                      ? 'bg-[#121212] border-white/5 text-white focus:border-orange-500'
                      : 'bg-gray-50 border-transparent text-black focus:border-orange-500'
                      }`}
                    placeholder="Enter Gym Name"
                  />
                </div>
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
                        <div className="w-full h-full p-2 flex items-center justify-center">
                          <img
                            src={URL.createObjectURL(formData.logo)}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>
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
