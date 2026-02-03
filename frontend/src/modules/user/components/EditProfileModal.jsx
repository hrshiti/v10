import React, { useState } from 'react';
import { X, Save, User, Ruler, Weight, Calendar } from 'lucide-react';

const EditProfileModal = ({ userData, onClose, onSave }) => {
    const [formData, setFormData] = useState(userData);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(userData.photo || null);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData, selectedImage);
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                        <div className="w-24 h-24 rounded-full border-4 border-emerald-50 overflow-hidden bg-gray-100 flex items-center justify-center transition-all group-hover:opacity-80">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-gray-300" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Save size={20} className="text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            id="profile-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase tracking-widest">Tap to change photo</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={`${formData.firstName || ''} ${formData.lastName || ''}`.trim()}
                                readOnly
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    {/* Weight & Height Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Weight (kg)</label>
                            <div className="relative">
                                <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Height (cm)</label>
                            <div className="relative">
                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Age */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Age</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'}`}
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={20} />
                        )}
                        {isSaving ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
