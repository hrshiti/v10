import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, MapPin, Calendar, Camera, Briefcase } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/api';
import SingleDatePicker from '../../admin/components/SingleDatePicker';

const formatISOToDDMMYYYY = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

const formatDDMMYYYYToISO = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [d, m, y] = parts;
    return `${y}-${m}-${d}`;
};

const TrainerEditProfile = () => {
    const navigate = useNavigate();
    const context = useOutletContext();
    const isDarkMode = context?.isDarkMode || false;
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        gender: '',
        address: '',
        experience: ''
    });

    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            const data = JSON.parse(stored);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                birthDate: data.birthDate ? formatISOToDDMMYYYY(data.birthDate) : '',
                gender: data.gender || '',
                address: data.address || '',
                experience: data.experience || ''
            });
            if (data.photo) {
                setPreviewUrl(data.photo.startsWith('http') ? data.photo : `${API_BASE_URL}/${data.photo}`);
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                let value = formData[key];
                if (key === 'birthDate' && value && value.match(/^\d{2}-\d{2}-\d{4}$/)) {
                    value = formatDDMMYYYYToISO(value);
                }
                data.append(key, value);
            });
            if (selectedFile) {
                data.append('photo', selectedFile);
            }

            const response = await fetch(`${API_BASE_URL}/api/user/trainer/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: data
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Profile updated successfully!');
                // Update localStorage with returned user data
                const stored = JSON.parse(localStorage.getItem('userData'));
                localStorage.setItem('userData', JSON.stringify({ ...stored, ...result }));
                setTimeout(() => navigate('/trainer/profile'), 1500);
            } else {
                toast.error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] p-6 pb-24 text-gray-900 dark:text-white">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-[#1A1F2B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:scale-90 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-black">Edit Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full bg-emerald-100 border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden flex items-center justify-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-emerald-600" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all">
                            <Camera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mt-4">Change Profile Picture</p>
                </div>

                {/* Identity Card */}
                <div className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Work Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white dark:bg-[#1A1F2B] p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Birth Date</label>
                            <div className="relative">
                                {/* <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> */}
                                <SingleDatePicker
                                    value={formData.birthDate}
                                    onSelect={(val) => setFormData(prev => ({ ...prev, birthDate: val }))}
                                    isDarkMode={isDarkMode}
                                    placeholder="DD-MM-YYYY"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Experience (Years)</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Home Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-4 pl-12 rounded-2xl bg-gray-50 dark:bg-[#121212] border-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold min-h-[100px] resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white dark:bg-emerald-500 font-black py-5 rounded-[2.5rem] shadow-xl active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Save size={18} />
                    )}
                    <span>Update Profile</span>
                </button>
            </form>
        </div>
    );
};

export default TrainerEditProfile;
